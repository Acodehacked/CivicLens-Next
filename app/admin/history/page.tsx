import { getStaffContext } from "@/lib/auth/staff-context";
import { getHistoryLog, getAvgResolutionHours, getOverviewStats } from "@/lib/data/analytics";
import HistoryPage from "@/app/admin/pages/history/HistoryPage";

export default async function HistoryRoute() {
  const { role, department } = await getStaffContext();
  const scope = role === "admin" ? null : department;

  const [entries, avgResolutionHours, stats] = await Promise.all([
    getHistoryLog(scope, 100),
    getAvgResolutionHours(scope),
    getOverviewStats(scope),
  ]);

  return <HistoryPage entries={entries} avgResolutionHours={avgResolutionHours} stats={stats} />;
}
