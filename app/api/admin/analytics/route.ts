import { NextResponse } from "next/server";
import { getStaffContextForApi } from "@/lib/auth/staff-context";
import { withTimeout } from "@/lib/api/with-timeout";
import { DEMO_ANALYTICS } from "@/lib/data/admin-demo";
import {
  getOverviewStats,
  getTrendComparison,
  getCategoryBreakdown,
  getSeverityByCategory,
  getDailyTrend,
  getMonthlyTrend,
  getDepartmentPerformance,
  getTopLocations,
  getRecentEvents,
  getMapMarkers,
  getTotalReportsSubmitted,
} from "@/lib/data/analytics";

export async function GET() {
  const auth = await getStaffContextForApi();
  if (!auth.ok) return auth.response;
  const { role, department } = auth.context;

  try {
    const scope = role === "admin" ? null : department;

    // One at a time rather than Promise.all - see dashboard/route.ts.
    const stats = await withTimeout(getOverviewStats(scope));
    const trend = await withTimeout(getTrendComparison(scope, 7));
    const categories = await withTimeout(getCategoryBreakdown(scope));
    const severityByCategory = await withTimeout(getSeverityByCategory(scope));
    const daily = await withTimeout(getDailyTrend(scope, 30));
    const monthly = await withTimeout(getMonthlyTrend(scope, 12));
    const departmentPerformance = await withTimeout(getDepartmentPerformance());
    const topLocations = await withTimeout(getTopLocations(scope, 8));
    const recentEvents = await withTimeout(getRecentEvents(scope, 6));
    const mapMarkers = await withTimeout(getMapMarkers(scope, 300));
    const totalReportsSubmitted = await withTimeout(getTotalReportsSubmitted(scope));

    return NextResponse.json({
      stats,
      trend,
      categories,
      severityByCategory,
      daily,
      monthly,
      departmentPerformance,
      topLocations,
      recentEvents,
      mapMarkers,
      totalReportsSubmitted,
    });
  } catch (err) {
    console.error("[api/admin/analytics] falling back to demo data:", err);
    return NextResponse.json(DEMO_ANALYTICS);
  }
}
