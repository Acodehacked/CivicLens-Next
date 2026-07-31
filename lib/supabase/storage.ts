import type { SupabaseClient } from "@supabase/supabase-js";

const AVATARS_BUCKET = "avatars";
const REPORT_IMAGES_BUCKET = "report-images";

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

// Report photos aren't scoped to a user folder - the "reports" flow allows
// anonymous submissions (reports.reporter_id is nullable), so there's no
// user id to namespace by. The FastAPI detection backend (constants/lib.ts)
// fetches the image by this public URL, so the bucket must stay public.
export async function uploadReportImage(supabase: SupabaseClient, file: File) {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from(REPORT_IMAGES_BUCKET)
    .upload(path, file, { contentType: file.type || "image/jpeg" });

  if (error) throw error;

  return supabase.storage.from(REPORT_IMAGES_BUCKET).getPublicUrl(path).data
    .publicUrl;
}

// @supabase/storage-js's own `.upload()` is fetch-based and exposes no
// upload-progress events at all, so a real progress bar needs a raw XHR
// against Storage's REST endpoint instead. This mirrors exactly what the
// SDK itself does when you pass it an ArrayBuffer (see
// StorageFileApi.uploadOrUpdate: non-Blob bodies are sent as-is with
// `content-type`/`cache-control` headers, no multipart wrapping) - so it
// hits the same backend contract, just with `xhr.upload.onprogress` wired
// up. Client-only (uses XMLHttpRequest).
export function uploadReportImageWithProgress(
  file: File,
  onProgress: (percent: number) => void
): Promise<string> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const apiKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  return new Promise((resolve, reject) => {
    file
      .arrayBuffer()
      .then((arrayBuffer) => {
        const xhr = new XMLHttpRequest();
        xhr.open(
          "POST",
          `${supabaseUrl}/storage/v1/object/${REPORT_IMAGES_BUCKET}/${path}`
        );
        xhr.setRequestHeader("apikey", apiKey);
        xhr.setRequestHeader("Authorization", `Bearer ${apiKey}`);
        xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
        xhr.setRequestHeader("cache-control", "max-age=3600");
        xhr.setRequestHeader("x-upsert", "false");

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            onProgress(Math.round((event.loaded / event.total) * 100));
          }
        };

        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            onProgress(100);
            resolve(`${supabaseUrl}/storage/v1/object/public/${REPORT_IMAGES_BUCKET}/${path}`);
          } else {
            reject(new Error(`Image upload failed (status ${xhr.status}).`));
          }
        };
        xhr.onerror = () => reject(new Error("Network error while uploading the image."));
        xhr.send(arrayBuffer);
      })
      .catch(() => reject(new Error("Could not read the selected image file.")));
  });
}
