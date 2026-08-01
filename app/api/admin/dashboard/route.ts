import { NextResponse } from "next/server";
import { and, desc, eq, inArray } from "drizzle-orm";
import { getStaffContextForApi } from "@/lib/auth/staff-context";
import { withTimeout } from "@/lib/api/with-timeout";
import { DEMO_DASHBOARD } from "@/lib/data/admin-demo";
import { db } from "@/db/client";
import { complaints } from "@/db/schema";
import {
  getOverviewStats,
  getDailyTrend,
  getCategoryBreakdown,
  getDepartmentPerformance,
  getRecentEvents,
  getMapMarkers,
} from "@/lib/data/analytics";

export async function GET() {
  const auth = await getStaffContextForApi();
  if (!auth.ok) return auth.response;
  const { role, department } = auth.context;

  try {
    const scope = role === "admin" ? null : department;
    const deptFilter = scope ? eq(complaints.department, scope) : undefined;
    const activeOnly = inArray(complaints.status, ["open", "in_progress"]);

    // One at a time rather than Promise.all - concurrent queries pipelined
    // over this module's single pooled connection (max: 1) don't play well
    // with Supabase's transaction-mode pooler, which has been the source of
    // the hangs/timeouts seen against this project's DB.
    const stats = await withTimeout(getOverviewStats(scope));
    const dailyTrend = await withTimeout(getDailyTrend(scope, 7));
    const categoryBreakdown = await withTimeout(getCategoryBreakdown(scope));
    const departmentPerformance = await withTimeout(getDepartmentPerformance());
    const recentEvents = await withTimeout(getRecentEvents(scope, 5));
    const mapMarkers = await withTimeout(getMapMarkers(scope, 300));
    const priorityItems = await withTimeout(
      db
        .select()
        .from(complaints)
        .where(deptFilter ? and(activeOnly, deptFilter) : activeOnly)
        .orderBy(desc(complaints.priorityScore))
        .limit(3)
    );
    const recentComplaints = await withTimeout(
      db
        .select()
        .from(complaints)
        .where(deptFilter)
        .orderBy(desc(complaints.lastReportedAt))
        .limit(6)
    );

    return NextResponse.json({
      stats,
      dailyTrend,
      categoryBreakdown,
      departmentPerformance,
      recentEvents,
      mapMarkers,
      priorityItems,
      recentComplaints,
    });
  } catch (err) {
    console.error("[api/admin/dashboard] falling back to demo data:", err);
    return NextResponse.json(DEMO_DASHBOARD);
  }
}
