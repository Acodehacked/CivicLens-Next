"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import type { SeverityByCategory } from "@/lib/data/analytics";
import { formatIssueLabel } from "@/lib/constants/severity";

export default function SeverityDistributionChart({ data }: { data: SeverityByCategory[] }) {
  const chartData = data.map((d) => ({
    category: formatIssueLabel(d.category),
    Low: d.low,
    Medium: d.medium,
    High: d.high,
    Critical: d.critical,
  }));

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col h-full" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Severity Distribution</h2>
          <p className="text-xs text-slate-500">Breakdown of low, medium, high, and critical risk issues by category</p>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm text-slate-400 font-medium">No reports yet</div>
      ) : (
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <XAxis type="number" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
              <YAxis dataKey="category" type="category" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} width={100} />
              <Tooltip
                content={({ active, payload, label }: any) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs border border-slate-700">
                        <p className="font-bold text-white mb-1.5">{label}</p>
                        {payload.map((entry: any) => (
                          <div key={entry.name} className="flex items-center justify-between gap-4 mb-0.5">
                            <span style={{ color: entry.color }}>● {entry.name}:</span>
                            <span className="font-bold text-white">{entry.value}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }} />
              <Bar dataKey="Low" stackId="a" fill="#3B82F6" />
              <Bar dataKey="Medium" stackId="a" fill="#F59E0B" />
              <Bar dataKey="High" stackId="a" fill="#F97316" />
              <Bar dataKey="Critical" stackId="a" fill="#EF4444" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
