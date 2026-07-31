import { ReactNode } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "./components/Sidebar";
import TopNav from "./components/TopNav";

export default async function ReportLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let currentUser: { displayName: string; href: string } | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .single();

    currentUser = {
      displayName: profile?.full_name || user.email || "Account",
      href: profile?.role === "admin" || profile?.role === "department_staff" ? "/admin" : "/report",
    };
  }
  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] overflow-hidden text-sm">
      <Sidebar displayName={currentUser?.displayName ?? null} email={user?.email ?? null} />
      <div className="flex-1 flex flex-col  relative">
        <TopNav displayName={currentUser?.displayName ?? null} />
        <div className="overflow-y-scroll w-full">
          {children}
          <Footer />
        </div>
      </div>
    </div>
  );
}
