import { NextResponse } from "next/server";
import { and, desc, eq, inArray } from "drizzle-orm";
import { getStaffContextForApi } from "@/lib/auth/staff-context";
import { adminApiError } from "@/lib/api/admin-error";
import { db } from "@/db/client";
import { complaints } from "@/db/schema";
import { DEPARTMENTS } from "@/lib/constants/departments";

export async function GET() {
  const auth = await getStaffContextForApi();
  if (!auth.ok) return auth.response;
  const { role, department } = auth.context;

  try {
    const activeOnly = inArray(complaints.status, ["open", "in_progress"]);
    const where = role === "admin" ? activeOnly : and(activeOnly, eq(complaints.department, department!));

    const reports = await db
      .select()
      .from(complaints)
      .where(where)
      .orderBy(desc(complaints.priorityScore))
      .limit(100);

    return NextResponse.json({ reports, isAdmin: role === "admin", departments: DEPARTMENTS });
  } catch (err) {
    return adminApiError("priority-queue", err);
  }
}
