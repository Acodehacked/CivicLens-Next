import { ReactNode } from "react";
import Sidebar from "./components/Sidebar";
import TopNav from "./components/TopNav";
import { createClient } from "@/lib/supabase/server";

export default async function ReportLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName: string | null = null;
  let email: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    displayName = profile?.full_name || user.email || "Citizen";
    email = user.email ?? null;
  }

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] overflow-hidden text-sm">
      <Sidebar displayName={displayName} email={email} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <TopNav displayName={displayName} />
        {children}
      </div>
    </div>
  );
}
