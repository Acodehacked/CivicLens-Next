"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from "recharts";

const monthlyData = [
  { month: "Jan", count: 1400 },
  { month: "Feb", count: 1650 },
  { month: "Mar", count: 1820 },
  { month: "Apr", count: 1950 },
  { month: "May", count: 2100 },
  { month: "Jun", count: 2450 },
  { month: "Jul", count: 2845, isCurrent: true },
];

export default function MonthlyBarChart() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col h-full" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900" style={{ fontFamily: "var(--font-heading)" }}>
            Monthly Reports
          </h2>
          <p className="text-xs text-slate-500" style={{ fontFamily: "var(--font-body)" }}>
            Monthly issue volume progression (Current month highlighted)
          </p>
        </div>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              content={({ active, payload, label }: any) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl text-xs border border-slate-700">
                      <p className="font-bold text-white">{label}</p>
                      <p className="text-slate-300"><strong className="text-white">{payload[0].value}</strong> reports</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {monthlyData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isCurrent ? "#2563EB" : "#DBEAFE"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
