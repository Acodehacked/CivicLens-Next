"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/cn";

export function LogoutButton({
  redirectTo = "/",
  className,
  children = "Sign out",
}: {
  redirectTo?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className={cn("rounded border border-neutral-300 px-3 py-1.5 text-sm", className)}
    >
      {children}
    </button>
  );
}
