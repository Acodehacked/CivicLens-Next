import "server-only";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "@/db/client";
import { profiles, departments } from "@/db/schema";
import { createAdminClient } from "@/lib/supabase/admin";
import type { DepartmentType } from "@/lib/constants/departments";

export type StaffDirectoryRow = {
  id: string;
  fullName: string | null;
  email: string | null;
  role: "admin" | "department_staff";
  department: DepartmentType | null;
};

// Real staff accounts only - no fake SuperAdmin/Operator/ReadOnly roles or
// invite flow, since profiles.role only ever holds citizen/department_staff/
// admin. Email comes from auth.users via the admin client since it isn't
// mirrored onto profiles (same approach as lib/data/reporters.ts).
export async function getStaffDirectory(scope: DepartmentType | null): Promise<StaffDirectoryRow[]> {
  const roleFilter = inArray(profiles.role, ["admin", "department_staff"]);
  const where = scope ? and(roleFilter, eq(profiles.department, scope)) : roleFilter;

  const rows = await db
    .select({
      id: profiles.id,
      fullName: profiles.fullName,
      role: profiles.role,
      department: profiles.department,
    })
    .from(profiles)
    .where(where);

  if (rows.length === 0) return [];

  const admin = createAdminClient();
  return Promise.all(
    rows.map(async (r) => {
      const { data } = await admin.auth.admin.getUserById(r.id);
      return {
        id: r.id,
        fullName: r.fullName,
        role: r.role as "admin" | "department_staff",
        department: r.department,
        email: data.user?.email ?? null,
      };
    })
  );
}

// Real recipients for support tickets (see lib/actions/settings.ts's
// submitSupportTicket) - every admin account, rather than a hardcoded or
// invented support inbox.
export async function getAdminEmails(): Promise<string[]> {
  const admins = await db.select({ id: profiles.id }).from(profiles).where(eq(profiles.role, "admin"));
  if (admins.length === 0) return [];

  const admin = createAdminClient();
  const emails = await Promise.all(
    admins.map(async (a) => {
      const { data } = await admin.auth.admin.getUserById(a.id);
      return data.user?.email ?? null;
    })
  );
  return emails.filter((e): e is string => e !== null);
}

export type DepartmentSettingsRow = {
  id: string;
  name: DepartmentType;
  contactEmail: string | null;
  avgResolutionHours: number | null;
};

export async function getDepartmentSettings(): Promise<DepartmentSettingsRow[]> {
  return db
    .select({
      id: departments.id,
      name: departments.name,
      contactEmail: departments.contactEmail,
      avgResolutionHours: departments.avgResolutionHours,
    })
    .from(departments)
    .orderBy(departments.name);
}
