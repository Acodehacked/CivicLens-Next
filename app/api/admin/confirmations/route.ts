import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { getStaffContextForApi } from "@/lib/auth/staff-context";
import { adminApiError } from "@/lib/api/admin-error";
import { db } from "@/db/client";
import { complaints } from "@/db/schema";

export async function GET() {
  const auth = await getStaffContextForApi();
  if (!auth.ok) return auth.response;
  const { role, department } = auth.context;

  try {
    const openOnly = eq(complaints.status, "open");
    const where = role === "admin" ? openOnly : and(openOnly, eq(complaints.department, department!));

    const pending = await db
      .select()
      .from(complaints)
      .where(where)
      .orderBy(desc(complaints.priorityScore))
      .limit(200);

    return NextResponse.json({ pending, isAdmin: role === "admin" });
  } catch (err) {
    return adminApiError("confirmations", err);
  }
}
