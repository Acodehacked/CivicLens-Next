"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const severityData = [
  {
    category: "Potholes",
    Low: 180,
    Medium: 420,
    High: 360,
    Critical: 121,
  },
  {
    category: "Garbage",
    Low: 250,
    Medium: 310,
    High: 120,
    Critical: 31,
  },
  {
    category: "Waterlogging",
    Low: 90,
    Medium: 180,
    High: 172,
    Critical: 70,
  },
  {
    category: "Streetlights",
    Low: 180,
    Medium: 110,
    High: 41,
    Critical: 10,
  },
  {
    category: "Fallen Trees",
    Low: 20,
    Medium: 60,
    High: 85,
    Critical: 35,
  },
];

export default function SeverityDistributionChart() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col h-full" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900" style={{ fontFamily: "var(--font-heading)" }}>
            Severity Distribution
          </h2>
          <p className="text-xs text-slate-500" style={{ fontFamily: "var(--font-body)" }}>
            Breakdown of low, medium, high, and critical risk issues
          </p>
        </div>
      </div>

      {/* Stacked Horizontal Bar Chart */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={severityData}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <XAxis type="number" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis dataKey="category" type="category" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} width={80} />
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
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
            />
            <Bar dataKey="Low" stackId="a" fill="#3B82F6" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Medium" stackId="a" fill="#F59E0B" radius={[0, 0, 0, 0]} />
            <Bar dataKey="High" stackId="a" fill="#F97316" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Critical" stackId="a" fill="#EF4444" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
