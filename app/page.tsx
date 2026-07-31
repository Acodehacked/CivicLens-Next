import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logout-button";
import { PostsPanel } from "@/components/posts-panel";
import { AvatarUploader } from "@/components/avatar-uploader";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 p-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">badjelly-fish</h1>
        {user ? (
          <div className="flex items-center gap-3 text-sm">
            <span>{user.email}</span>
            <LogoutButton />
          </div>
        ) : (
          <Link href="/login" className="text-sm underline">
            Sign in
          </Link>
        )}
      </header>

      {user && <AvatarUploader userId={user.id} />}

      <PostsPanel canPost={Boolean(user)} />
    </main>
  );
}
