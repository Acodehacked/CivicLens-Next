"use client";

import { useEffect, useState } from "react";
import KPICards from "../components/KPICards";
import ReportsTable from "../components/ReportsTable";
import PriorityQueue from "../components/PriorityQueue";
import DepartmentPerformance from "../components/DepartmentPerformance";
import AnalyticsCharts from "../components/AnalyticsCharts";
import AIInsightsPanel from "../components/AIInsightsPanel";
import RecentActivity from "../components/RecentActivity";
import AdminErrorPanel from "../components/AdminErrorPanel";
import AdminLoading from "../components/AdminLoading";
import { fetchDashboard, type DashboardData } from "@/lib/api/admin";
import DashboardMapClient from "./DashboardMapClient";

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchDashboard()
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err : new Error(String(err))));
  }, []);

  if (error) return <AdminErrorPanel error={error} />;
  if (!data) return <AdminLoading />;

  const { stats, dailyTrend, categoryBreakdown, departmentPerformance, recentEvents, mapMarkers, priorityItems, recentComplaints } = data;

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
