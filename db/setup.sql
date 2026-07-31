-- Run once in the Supabase SQL editor after `bun run db:push` (or
-- `db:migrate`) has created the tables in db/schema.ts. Drizzle only owns
-- table/column DDL - RLS policies, triggers, and storage buckets are managed
-- here since they're Supabase/Postgres concerns outside the schema.

-- ---------------------------------------------------------------------
-- 1. Auto-create a `profiles` row for every new `auth.users` row.
--
-- Both citizen signup (app/signup) and department signup (app/office/signup)
-- call `supabase.auth.signUp()` with an `account_type` field in the user's
-- metadata ("citizen" | "department_staff"). This trigger reads that
-- metadata to set the initial role - but NEVER trusts a request for
-- "admin", since that would let anyone self-escalate to full admin by
-- crafting a signup request. Promoting a department_staff account to admin
-- is a manual, server-side-only operation (update the row directly).
-- ---------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  requested_role public.user_role;
begin
  requested_role := coalesce(
    (new.raw_user_meta_data->>'account_type')::public.user_role,
    'citizen'
  );

  if requested_role = 'admin' then
    requested_role := 'citizen';
  end if;

  insert into public.profiles (
    id,
    role,
    department,
    full_name,
    address,
    mobile_number,
    aadhaar_number,
    profession
  )
  values (
    new.id,
    requested_role,
    nullif(new.raw_user_meta_data->>'department', '')::public.department_type,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'address',
    new.raw_user_meta_data->>'mobile_number',
    nullif(new.raw_user_meta_data->>'aadhaar_number', ''),
    new.raw_user_meta_data->>'profession'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- 2. Lock `role` and `department` against self-service updates.
--
-- RLS's `with check` can't cleanly express "this column may not change",
-- so this is done with a trigger instead: any UPDATE run as the
-- `authenticated` role (i.e. from the browser/server acting as the user,
-- not a trusted service-role/admin context) has role/department pinned
-- back to their existing values, no matter what the client sent.
-- ---------------------------------------------------------------------
create or replace function public.lock_profile_role()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if auth.role() = 'authenticated' then
    new.role := old.role;
    new.department := old.department;
  end if;
  return new;
end;
$$;

drop trigger if exists lock_profile_role_trigger on public.profiles;
create trigger lock_profile_role_trigger
  before update on public.profiles
  for each row execute function public.lock_profile_role();

-- ---------------------------------------------------------------------
-- 3. Helper to read the current user's role without recursive RLS.
-- SECURITY DEFINER runs as the function owner, bypassing RLS on this one
-- internal lookup, so policies that call it don't recurse into themselves.
-- ---------------------------------------------------------------------
create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- ---------------------------------------------------------------------
-- 4. Row Level Security.
-- ---------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.departments enable row level security;

drop policy if exists "Profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Staff can view all profiles" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
-- These four are NOT created anywhere in this file, but Supabase's dashboard
-- "add policy" UI has suggested naive templates with these exact names in
-- the past, and they cause real infinite recursion: they query `profiles`
-- from inside a policy ON `profiles` without going through
-- current_user_role()'s SECURITY DEFINER indirection, so evaluating them
-- requires re-evaluating them, forever. If you ever see
-- "infinite recursion detected in policy for relation profiles", it's
-- because one of these (or something shaped like them) got added back
-- outside this file - drop it again.
drop policy if exists "admins can view all profiles" on public.profiles;
drop policy if exists "admins can update any profile" on public.profiles;
drop policy if exists "users can update their own name only" on public.profiles;
drop policy if exists "users can view their own profile" on public.profiles;

-- Citizens can see only their own profile (it holds PII: address, mobile,
-- Aadhaar). Department staff/admins can see all profiles, since the admin
-- dashboard needs reporter/staff info.
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Staff can view all profiles"
  on public.profiles for select
  using (public.current_user_role() in ('admin', 'department_staff'));

-- Anyone can update their own row, but lock_profile_role_trigger (above)
-- silently discards any attempted change to role/department.
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Departments are viewable by everyone"
  on public.departments for select
  using (true);

-- ---------------------------------------------------------------------
-- 5. Storage bucket for lib/supabase/storage.ts (avatars, keyed by user id
-- folder: "<user_id>/<filename>").
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "Avatar images are publicly accessible" on storage.objects;
drop policy if exists "Users can upload their own avatar" on storage.objects;
drop policy if exists "Users can update their own avatar" on storage.objects;
drop policy if exists "Users can delete their own avatar" on storage.objects;

create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update their own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete their own avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ---------------------------------------------------------------------
-- 6. Seed the five departments this app's YOLO classes route to. Safe to
-- re-run - `on conflict do nothing` skips rows that already exist.
-- ---------------------------------------------------------------------
insert into public.departments (name, contact_email) values
  ('roads', null),
  ('sanitation', null),
  ('drainage', null),
  ('disaster_management', null),
  ('parks', null)
on conflict (name) do nothing;

-- ---------------------------------------------------------------------
-- 7. Storage bucket for report photos (lib/supabase/storage.ts's
-- uploadReportImage). Public, and insert is open to anon + authenticated -
-- reports.reporter_id is nullable, so citizens can submit without an
-- account. The FastAPI detection backend fetches the image by public URL,
-- so this bucket must stay public (unlike "avatars", uploads aren't
-- scoped to a per-user folder since there's no user to scope to).
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('report-images', 'report-images', true)
on conflict (id) do nothing;

drop policy if exists "Report images are publicly accessible" on storage.objects;
drop policy if exists "Anyone can upload a report image" on storage.objects;

create policy "Report images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'report-images');

create policy "Anyone can upload a report image"
  on storage.objects for insert
  with check (bucket_id = 'report-images');
