"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts";
import type { DailyTrendPoint, CategoryCount } from "@/lib/data/analytics";
import { formatIssueLabel } from "@/lib/constants/severity";

export default function AnalyticsCharts({
  dailyTrend,
  categoryBreakdown,
}: {
  dailyTrend: DailyTrendPoint[];
  categoryBreakdown: CategoryCount[];
}) {
  const catData = categoryBreakdown.slice(0, 6).map((c) => ({ name: formatIssueLabel(c.category), count: c.count }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Area Chart: Reports Over Time */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden p-5">
        <div className="mb-4">
          <h3 className="font-bold text-primary">Reports vs. Resolutions</h3>
          <p className="text-[11px] font-semibold text-slate-400">Past 7 days across your departments</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                labelStyle={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}
              />
              <Area type="monotone" dataKey="reports" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorReports)" name="Reports" />
              <Area type="monotone" dataKey="resolved" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorResolved)" name="Resolved" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Chart: Reports By Category */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden p-5">
        <div className="mb-4">
          <h3 className="font-bold text-primary">Issues by Category</h3>
          <p className="text-[11px] font-semibold text-slate-400">Reports across AI-detected categories</p>
        </div>
        <div className="h-64 w-full">
          {catData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-sm text-slate-400 font-medium">
              No reports yet
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={catData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#4f46e5' }}
                />
                <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Reports" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
