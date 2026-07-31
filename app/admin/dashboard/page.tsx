import { and, desc, eq, inArray } from "drizzle-orm";
import KPICards from "../components/KPICards";
import ReportsTable from "../components/ReportsTable";
import PriorityQueue from "../components/PriorityQueue";
import DepartmentPerformance from "../components/DepartmentPerformance";
import AnalyticsCharts from "../components/AnalyticsCharts";
import AIInsightsPanel from "../components/AIInsightsPanel";
import RecentActivity from "../components/RecentActivity";
import { getStaffContext } from "@/lib/auth/staff-context";
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
import DashboardMapClient from "./DashboardMapClient";

export default async function AdminDashboardPage() {
  const { role, department } = await getStaffContext();
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

  return (
    <div className="p-3 sm:p-5 lg:p-8 max-w-[1600px] mx-auto flex flex-col xl:flex-row gap-4 sm:gap-6">

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight mb-1">Command Center</h1>
            <p className="text-sm font-semibold text-slate-500 max-w-2xl">
              Monitor city-wide civic issues, AI detections, department performance, and operational insights from one intelligent workspace.
            </p>
          </div>
        </div>

        {/* KPIs */}
        <KPICards stats={stats} />

        {/* Map & Queues Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DashboardMapClient markers={mapMarkers} />
          </div>
          <div className="h-[450px]">
            <PriorityQueue items={priorityItems} />
          </div>
        </div>

        {/* Charts */}
        <AnalyticsCharts dailyTrend={dailyTrend} categoryBreakdown={categoryBreakdown} />

        {/* Bottom Grid: Reports, Depts, Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2">
            <ReportsTable reports={recentComplaints} />
          </div>
          <div className="lg:col-span-1">
            <DepartmentPerformance departments={departmentPerformance} />
          </div>
          <div className="lg:col-span-1">
            <RecentActivity events={recentEvents} />
          </div>
        </div>

      </div>

      {/* Right Sidebar (Sticky AI Panel) */}
      <div className="xl:block hidden">
        <div className="sticky top-8">
          <AIInsightsPanel stats={stats} departments={departmentPerformance} />
        </div>
      </div>

      {/* Mobile/Tablet AI Panel */}
      <div className="xl:hidden block mt-2">
        <AIInsightsPanel stats={stats} departments={departmentPerformance} />
      </div>

    </div>
  );
}
