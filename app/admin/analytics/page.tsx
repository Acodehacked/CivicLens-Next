"use client";

import { useState } from "react";
import AnalyticsHeader from "@/app/admin/pages/analytics/components/AnalyticsHeader";
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

export default function AnalyticsPage() {
  const [range, setRange] = useState("30d");

  return (
    <div className="flex-1 flex overflow-hidden relative bg-[#F8FAFC]">
      {/* Center workspace */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6 pb-24">
          <AnalyticsHeader onRefresh={() => {}} isRefreshing={false} />
          <KPICards />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ReportTrendsChart />
            </div>
            <div>
              <CategoryDonutChart />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <SeverityDistributionChart />
            </div>
            <div className="lg:col-span-2">
              <MonthlyBarChart />
            </div>
          </div>

          <DepartmentPerformanceGrid />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AIPerformanceCard />
            <CityHotspotsMiniMap />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TopLocationsTable />
            </div>
            <div>
              <RecentAIInsightsTimeline />
            </div>
          </div>
        </div>
      </div>

      {/* Right AI Intelligence Panel */}
      <AnalyticsAIPanel />
    </div>
  );
}
