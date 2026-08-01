import { NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { getStaffContextForApi } from "@/lib/auth/staff-context";
import { adminApiError } from "@/lib/api/admin-error";
import { db } from "@/db/client";
import { complaints } from "@/db/schema";
import { DEPARTMENT_LABELS, type DepartmentType } from "@/lib/constants/departments";

export async function GET() {
  const auth = await getStaffContextForApi();
  if (!auth.ok) return auth.response;
  const { role, department, fullName, email } = auth.context;

  try {
    const openScope =
      role === "admin"
        ? eq(complaints.status, "open")
        : and(eq(complaints.status, "open"), eq(complaints.department, department as DepartmentType));

    const [{ count }] = await db
      .select({ count: sql<number>`count(*)`.mapWith(Number) })
      .from(complaints)
      .where(openScope);

    const displayName = fullName || email || "Staff";
    const roleLabel =
      role === "admin"
        ? "Administrator"
        : department
          ? `${DEPARTMENT_LABELS[department]} Dept.`
          : "Department Staff";

    return NextResponse.json({ displayName, roleLabel, pendingCount: count });
  } catch (err) {
    return adminApiError("layout-stats", err);
  }
}
