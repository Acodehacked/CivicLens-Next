import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { getStaffContextForApi } from "@/lib/auth/staff-context";
import { withTimeout } from "@/lib/api/with-timeout";
import { DEMO_CONFIRMATIONS } from "@/lib/data/admin-demo";
import { db } from "@/db/client";
import { complaints } from "@/db/schema";

export async function GET() {
  const auth = await getStaffContextForApi();
  if (!auth.ok) return auth.response;
  const { role, department } = auth.context;

  try {
    const openOnly = eq(complaints.status, "open");
    const where = role === "admin" ? openOnly : and(openOnly, eq(complaints.department, department!));

    const pending = await withTimeout(
      db
        .select()
        .from(complaints)
        .where(where)
        .orderBy(desc(complaints.priorityScore))
        .limit(200)
    );

    return NextResponse.json({ pending, isAdmin: role === "admin" });
  } catch (err) {
    console.error("[api/admin/confirmations] falling back to demo data:", err);
    return NextResponse.json(DEMO_CONFIRMATIONS);
  }
}
