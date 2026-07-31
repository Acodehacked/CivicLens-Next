"use client";

import KPICards from "../components/KPICards";
import ReportsTable from "../components/ReportsTable";
import PriorityQueue from "../components/PriorityQueue";
import DepartmentPerformance from "../components/DepartmentPerformance";
import AnalyticsCharts from "../components/AnalyticsCharts";
import AIInsightsPanel from "../components/AIInsightsPanel";
import RecentActivity from "../components/RecentActivity";

import dynamic from "next/dynamic";

const DynamicDashboardMap = dynamic(() => import("../components/DashboardMap"), { ssr: false });

export default function AdminDashboardPage() {
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
          <div className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto">
            Last synced: Just now
          </div>
        </div>

        {/* KPIs */}
        <KPICards />

        {/* Map & Queues Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DynamicDashboardMap />
          </div>
          <div className="h-[450px]">
            <PriorityQueue />
          </div>
        </div>

        {/* Charts */}
        <AnalyticsCharts />

        {/* Bottom Grid: Reports, Depts, Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2">
            <ReportsTable />
          </div>
          <div className="lg:col-span-1">
            <DepartmentPerformance />
          </div>
          <div className="lg:col-span-1">
            <RecentActivity />
          </div>
        </div>

      </div>

      {/* Right Sidebar (Sticky AI Panel) */}
      <div className="xl:block hidden">
        <div className="sticky top-8">
          <AIInsightsPanel />
        </div>
      </div>
      
      {/* Mobile/Tablet AI Panel */}
      <div className="xl:hidden block mt-2">
         <AIInsightsPanel />
      </div>

    </div>
  );
}
