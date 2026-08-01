import { NextResponse } from "next/server";
import { and, desc, eq, inArray } from "drizzle-orm";
import { getStaffContextForApi } from "@/lib/auth/staff-context";
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

    const [stats, dailyTrend, categoryBreakdown, departmentPerformance, recentEvents, mapMarkers, priorityItems, recentComplaints] =
      await Promise.all([
        getOverviewStats(scope),
        getDailyTrend(scope, 7),
        getCategoryBreakdown(scope),
        getDepartmentPerformance(),
        getRecentEvents(scope, 5),
        getMapMarkers(scope, 300),
        db
          .select()
          .from(complaints)
          .where(deptFilter ? and(activeOnly, deptFilter) : activeOnly)
          .orderBy(desc(complaints.priorityScore))
          .limit(3),
        db
          .select()
          .from(complaints)
          .where(deptFilter)
          .orderBy(desc(complaints.lastReportedAt))
          .limit(6),
      ]);

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
