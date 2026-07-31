import { Metadata } from "next";
import { and, eq, sql } from "drizzle-orm";
import Sidebar from "./components/Sidebar";
import TopNav from "./components/TopNav";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db/client";
import { complaints } from "@/db/schema";
import { DEPARTMENT_LABELS, type DepartmentType } from "@/lib/constants/departments";

export const metadata: Metadata = {
  title: "Admin Dashboard | CivicLens",
  description: "Central command center for city administrators.",
};

// Real auth, not a decoration: proxy.ts already redirects non-staff away from
// /admin/** before this ever renders, but we still need the actual
// role/department here to show the right name and scope the sidebar - so
// this stays a server component that reads the live Supabase session rather
// than a client-side flag anyone could set in devtools.
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
  let pendingCount = 0;

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

    const openScope =
      profile?.role === "admin"
        ? eq(complaints.status, "open")
        : and(eq(complaints.status, "open"), eq(complaints.department, profile?.department as DepartmentType));

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(complaints)
      .where(openScope);
    pendingCount = count;
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar displayName={displayName} roleLabel={roleLabel} pendingCount={pendingCount} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNav displayName={displayName} roleLabel={roleLabel} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
