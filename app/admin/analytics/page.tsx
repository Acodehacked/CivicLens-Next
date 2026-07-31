import { getStaffContext } from "@/lib/auth/staff-context";
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
import RefreshHeader from "./RefreshHeader";
import KPICards from "@/app/admin/pages/analytics/components/KPICards";
import ReportTrendsChart from "@/app/admin/pages/analytics/components/ReportTrendsChart";
import CategoryDonutChart from "@/app/admin/pages/analytics/components/CategoryDonutChart";
import SeverityDistributionChart from "@/app/admin/pages/analytics/components/SeverityDistributionChart";
import MonthlyBarChart from "@/app/admin/pages/analytics/components/MonthlyBarChart";
import DepartmentPerformanceGrid from "@/app/admin/pages/analytics/components/DepartmentPerformanceGrid";
import AIPerformanceCard from "@/app/admin/pages/analytics/components/AIPerformanceCard";
import CityHotspotsMiniMap from "@/app/admin/pages/analytics/components/CityHotspotsMiniMap";
import TopLocationsTable from "@/app/admin/pages/analytics/components/TopLocationsTable";
import RecentAIInsightsTimeline from "@/app/admin/pages/analytics/components/RecentAIInsightsTimeline";
import AnalyticsAIPanel from "@/app/admin/pages/analytics/components/AnalyticsAIPanel";

export default async function AnalyticsPage() {
  const { role, department } = await getStaffContext();
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
  ] = await Promise.all([
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
  ]);

  return (
    <div className="flex-1 flex overflow-hidden relative bg-[#F8FAFC]">
      {/* Center workspace */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6 pb-24">
          <RefreshHeader />
          <KPICards stats={stats} trend={trend} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ReportTrendsChart daily={daily} monthly={monthly} />
            </div>
            <div>
              <CategoryDonutChart categories={categories} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <SeverityDistributionChart data={severityByCategory} />
            </div>
            <div className="lg:col-span-2">
              <MonthlyBarChart data={monthly} />
            </div>
          </div>

          <DepartmentPerformanceGrid departments={departmentPerformance} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AIPerformanceCard stats={stats} totalReportsSubmitted={totalReportsSubmitted} />
            <CityHotspotsMiniMap markers={mapMarkers} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TopLocationsTable locations={topLocations} />
            </div>
            <div>
              <RecentAIInsightsTimeline events={recentEvents} />
            </div>
          </div>
        </div>
      </div>

      {/* Right AI Intelligence Panel */}
      <AnalyticsAIPanel stats={stats} departments={departmentPerformance} topLocation={topLocations[0] ?? null} />
    </div>
  );
}
