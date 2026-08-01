import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { getStaffContextForApi } from "@/lib/auth/staff-context";
import { withTimeout } from "@/lib/api/with-timeout";
import { DEMO_ISSUES } from "@/lib/data/admin-demo";
import { db } from "@/db/client";
import { complaints } from "@/db/schema";

export async function GET() {
  const auth = await getStaffContextForApi();
  if (!auth.ok) return auth.response;
  const { role, department } = auth.context;

  try {
    const where = role === "admin" ? undefined : eq(complaints.department, department!);

    const issues = await withTimeout(
      db
        .select()
        .from(complaints)
        .where(where)
        .orderBy(desc(complaints.lastReportedAt))
        .limit(200)
    );

    return NextResponse.json({ issues, isAdmin: role === "admin" });
  } catch (err) {
    console.error("[api/admin/issues] falling back to demo data:", err);
    return NextResponse.json(DEMO_ISSUES);
  }
}
