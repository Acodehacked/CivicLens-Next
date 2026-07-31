# badjelly-fish

Next.js (App Router) with [Hono](https://hono.dev) as the API layer, [Drizzle ORM](https://orm.drizzle.team) over Supabase Postgres, and Supabase Auth + Storage.

## Stack

- **Next.js 16** - frontend, Server Components, and the host for the API
- **Hono** - mounted as the API layer at `/api/*` via `app/api/[[...route]]/route.ts`
- **Drizzle ORM** - typed queries against Supabase's Postgres database (`db/schema.ts`)
- **Supabase** - Postgres, Auth (magic link), and Storage

## Project layout

```
app/
  api/[[...route]]/route.ts  Hono app mounted here (hono/vercel adapter)
  auth/callback/route.ts     Exchanges the magic-link code for a session
  login/page.tsx             Magic-link sign-in form
  page.tsx                   Demo page: auth state, posts, avatar upload
components/                  Client components used by app/page.tsx
db/
  schema.ts                  Drizzle table definitions
  client.ts                  Drizzle client (postgres.js)
  setup.sql                  RLS policies, profile-sync trigger, storage bucket
lib/
  api/app.ts                 Hono app + routes
  api/auth.ts                Hono middleware verifying the Supabase session
  supabase/client.ts          Browser Supabase client
  supabase/server.ts          Server Component / Route Handler Supabase client
  supabase/middleware.ts      Session refresh used by proxy.ts
  supabase/storage.ts         Storage (avatars bucket) helpers
proxy.ts                      Next.js 16's replacement for middleware.ts
drizzle.config.ts
```

> **Note on `proxy.ts`**: Next.js 16 renamed the `middleware.ts` convention to
> `proxy.ts` (`export default function proxy(...)` instead of `export function
> middleware(...)`). This project already uses the new convention.

## Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Copy `.env.example` to `.env` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` / `SUPABASE_SECRET_KEY` — Project Settings → API
   - `DATABASE_URL` — Project Settings → Database → Connection string (URI). Use the direct connection (port 5432) for local dev/migrations.
3. Install dependencies and push the schema:
   ```bash
   bun install
   bun run db:push
   ```
4. Open the Supabase SQL editor and run `db/setup.sql` — it wires up:
   - a trigger that creates a `profiles` row for every new `auth.users` row
   - Row Level Security policies for `profiles` and `posts`
   - the `avatars` Storage bucket and its access policies
5. In Supabase Auth settings, enable the **Email** provider (magic link) and add `http://localhost:3000/auth/callback` to the redirect URL allow list.
6. Run the app:
   ```bash
   bun dev
   ```
   Visit `http://localhost:3000`, sign in via magic link, publish a post, and upload an avatar.

## Database workflow

- `bun run db:generate` — generate SQL migration files from schema changes
- `bun run db:migrate` — apply generated migrations
- `bun run db:push` — push the schema directly (fast iteration, no migration files)
- `bun run db:studio` — open Drizzle Studio against your database

## API

The Hono app lives in `lib/api/app.ts` and is mounted at `/api`:

- `GET /api/health` — liveness check
- `GET /api/posts` — list posts
- `POST /api/posts` — create a post (requires an authenticated session)
- `DELETE /api/posts/:id` — delete your own post (requires an authenticated session)

Auth is enforced with `requireUser` (`lib/api/auth.ts`), which reads the Supabase
session from cookies via the same request-scoped `next/headers` context the
Next.js route handler runs in — no separate JWT plumbing needed.

## Adding a new API route

Add a route to `lib/api/app.ts` (optionally behind `requireUser`), and query
`db` from `db/client.ts` using the tables in `db/schema.ts`. No changes to
`app/api/[[...route]]/route.ts` are needed - it forwards every method to the
Hono app.
