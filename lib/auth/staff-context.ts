import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { DepartmentType } from "@/lib/constants/departments";

export type StaffContext = {
  userId: string;
  role: "admin" | "department_staff";
  department: DepartmentType | null;
  fullName: string | null;
};

// Server-only helper for admin pages that query Supabase/Drizzle directly.
// proxy.ts already keeps non-staff out of /admin/** as an optimistic check,
// but these pages still need the actual role/department to scope their
// queries (a department_staff account only ever sees their own
// department's complaints; admin sees everything) - this is that lookup,
// with the redirect as defense in depth, not the primary guard.
export async function getStaffContext(): Promise<StaffContext> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/office/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, department, full_name")
    .eq("id", user.id)
    .single();

  if (!profile || (profile.role !== "admin" && profile.role !== "department_staff")) {
    redirect("/");
  }

  return {
    userId: user.id,
    role: profile.role,
    department: profile.department,
    fullName: profile.full_name,
  };
}
