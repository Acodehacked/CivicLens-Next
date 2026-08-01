import { NextResponse } from "next/server";
import { getStaffContextForApi } from "@/lib/auth/staff-context";
import { DEMO_HISTORY_DATA } from "@/lib/data/admin-demo";
import { getHistoryLog, getAvgResolutionHours, getOverviewStats } from "@/lib/data/analytics";

export async function GET() {
  const auth = await getStaffContextForApi();
  if (!auth.ok) return auth.response;
  const { role, department } = auth.context;

  try {
    const scope = role === "admin" ? null : department;
    const [entries, avgResolutionHours, stats] = await Promise.all([
      getHistoryLog(scope, 100),
      getAvgResolutionHours(scope),
      getOverviewStats(scope),
    ]);

    return NextResponse.json({ entries, avgResolutionHours, stats });
  } catch (err) {
    console.error("[api/admin/history] falling back to demo data:", err);
    return NextResponse.json(DEMO_HISTORY_DATA);
  }
}
