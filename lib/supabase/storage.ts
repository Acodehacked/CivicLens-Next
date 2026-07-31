import type { SupabaseClient } from "@supabase/supabase-js";

const AVATARS_BUCKET = "avatars";

// Pass either the browser client (lib/supabase/client.ts) or the server
// client (lib/supabase/server.ts) - both expose the same storage API, and
// access is governed by the bucket's RLS policies for the current user.
export async function uploadAvatar(
  supabase: SupabaseClient,
  userId: string,
  file: File
) {
  const path = `${userId}/${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from(AVATARS_BUCKET)
    .upload(path, file, { upsert: true });

  if (error) throw error;

  return supabase.storage.from(AVATARS_BUCKET).getPublicUrl(path).data
    .publicUrl;
}

export async function listAvatars(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase.storage
    .from(AVATARS_BUCKET)
    .list(userId);

  if (error) throw error;
  return data;
}

export async function removeAvatar(
  supabase: SupabaseClient,
  userId: string,
  path: string
) {
  const { error } = await supabase.storage
    .from(AVATARS_BUCKET)
    .remove([`${userId}/${path}`]);

  if (error) throw error;
}
