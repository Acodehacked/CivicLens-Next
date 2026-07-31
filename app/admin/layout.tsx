import { Metadata } from "next";
import Sidebar from "./components/Sidebar";
import TopNav from "./components/TopNav";
import { createClient } from "@/lib/supabase/server";
import { DEPARTMENT_LABELS, type DepartmentType } from "@/lib/constants/departments";

export const metadata: Metadata = {
  title: "Admin Dashboard | CivicLens",
  description: "Central command center for city administrators.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName = "Staff";
  let roleLabel = "Department Staff";

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, role, department")
      .eq("id", user.id)
      .single();

    displayName = profile?.full_name || user.email || "Staff";
    roleLabel =
      profile?.role === "admin"
        ? "Administrator"
        : profile?.department
          ? `${DEPARTMENT_LABELS[profile.department as DepartmentType]} Dept.`
          : "Department Staff";
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar displayName={displayName} roleLabel={roleLabel} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNav displayName={displayName} roleLabel={roleLabel} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
