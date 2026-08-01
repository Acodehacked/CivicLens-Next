import "server-only";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { DepartmentType } from "@/lib/constants/departments";

export type StaffContext = {
  userId: string;
  role: "admin" | "department_staff";
  department: DepartmentType | null;
  fullName: string | null;
  email: string | null;
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
    email: user.email ?? null,
  };
}

// Route Handler equivalent of getStaffContext() above. redirect() throws a
// Next-internal signal meant for Server Component/Server Action rendering -
// a JSON API should return a normal 401/403 response instead and let the
// client decide what to do (e.g. redirect via router.push). proxy.ts gates
// page navigation to /admin/** but its path-prefix check does not cover
// /api/admin/** routes, so each route calling this is its own auth gate.
export async function getStaffContextForApi(): Promise<
  { ok: true; context: StaffContext } | { ok: false; response: NextResponse }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, response: NextResponse.json({ error: "Not signed in." }, { status: 401 }) };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, department, full_name")
    .eq("id", user.id)
    .single();

  if (!profile || (profile.role !== "admin" && profile.role !== "department_staff")) {
    return { ok: false, response: NextResponse.json({ error: "Not authorized." }, { status: 403 }) };
  }

  return {
    ok: true,
    context: {
      userId: user.id,
      role: profile.role,
      department: profile.department,
      fullName: profile.full_name,
      email: user.email ?? null,
    },
  };
}
