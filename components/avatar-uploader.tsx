"use client";

import { useState, type ChangeEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { uploadAvatar } from "@/lib/supabase/storage";

export function AvatarUploader({ userId }: { userId: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">(
    "idle"
  );

  async function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("uploading");
    try {
      const supabase = createClient();
      const publicUrl = await uploadAvatar(supabase, userId, file);
      setUrl(publicUrl);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold">Avatar</h2>
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt="Avatar"
          className="h-16 w-16 rounded-full object-cover"
        />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={status === "uploading"}
      />
      {status === "error" && (
        <p className="text-sm text-red-600">
          Upload failed - make sure an &quot;avatars&quot; bucket exists in
          Supabase Storage.
        </p>
      )}
    </div>
  );
}
