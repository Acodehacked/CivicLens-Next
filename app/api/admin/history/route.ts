import { NextResponse } from "next/server";
import { getStaffContextForApi } from "@/lib/auth/staff-context";
import { withTimeout } from "@/lib/api/with-timeout";
import { DEMO_HISTORY_DATA } from "@/lib/data/admin-demo";
import { getHistoryLog, getAvgResolutionHours, getOverviewStats } from "@/lib/data/analytics";

export async function GET() {
  const auth = await getStaffContextForApi();
  if (!auth.ok) return auth.response;
  const { role, department } = auth.context;

  try {
    const scope = role === "admin" ? null : department;
    // One at a time rather than Promise.all - see dashboard/route.ts.
    const entries = await withTimeout(getHistoryLog(scope, 100));
    const avgResolutionHours = await withTimeout(getAvgResolutionHours(scope));
    const stats = await withTimeout(getOverviewStats(scope));

    return NextResponse.json({ entries, avgResolutionHours, stats });
  } catch (err) {
    console.error("[api/admin/history] falling back to demo data:", err);
    return NextResponse.json(DEMO_HISTORY_DATA);
  }
}
