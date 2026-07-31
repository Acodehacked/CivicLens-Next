import { ReactNode } from "react";
import Footer from "@/app/components/Footer";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";

// Shared chrome for every citizen-facing dashboard page (/report, /my-reports,
// /live, /departments) - fetches the signed-in user once and renders the
// same sidebar/topnav/footer around whatever page content is passed in.
// /map deliberately does NOT use this - it wants a full-bleed, chrome-less
// layout for maximum map real estate.
export default async function CitizenShell({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();

    displayName = profile?.full_name || user.email || "Citizen";
  }

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] overflow-hidden text-sm">
      <Sidebar displayName={displayName} email={user?.email ?? null} />
      <div className="flex-1 flex flex-col relative">
        <TopNav displayName={displayName} />
        <div className="overflow-y-scroll w-full">
          {children}
          <Footer />
        </div>
      </div>
    </div>
  );
}
