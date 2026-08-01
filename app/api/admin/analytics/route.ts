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

    const [
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
    ] = await withTimeout(
      Promise.all([
        getOverviewStats(scope),
        getTrendComparison(scope, 7),
        getCategoryBreakdown(scope),
        getSeverityByCategory(scope),
        getDailyTrend(scope, 30),
        getMonthlyTrend(scope, 12),
        getDepartmentPerformance(),
        getTopLocations(scope, 8),
        getRecentEvents(scope, 6),
        getMapMarkers(scope, 300),
        getTotalReportsSubmitted(scope),
      ])
    );

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
