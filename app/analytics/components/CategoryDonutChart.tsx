"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const categoryData = [
  { name: "Potholes", value: 1081, pct: 38, color: "#2563EB" },
  { name: "Garbage Overflow", value: 711, pct: 25, color: "#3B82F6" },
  { name: "Waterlogging", value: 512, pct: 18, color: "#60A5FA" },
  { name: "Streetlights", value: 341, pct: 12, color: "#93C5FD" },
  { name: "Fallen Trees", value: 200, pct: 7, color: "#BFDBFE" },
];

export default function CategoryDonutChart() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col h-full" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <h2 className="text-base font-bold text-slate-900 mb-1" style={{ fontFamily: "var(--font-heading)" }}>
        Issue Categories
      </h2>
      <p className="text-xs text-slate-500 mb-4" style={{ fontFamily: "var(--font-body)" }}>
        Distribution of reported infrastructure defects
      </p>

      {/* Chart */}
      <div className="relative w-full h-44 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }: any) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl text-xs border border-slate-700">
                      <p className="font-bold text-white">{data.name}</p>
                      <p className="text-slate-300">{data.value} reports ({data.pct}%)</p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-extrabold text-slate-900" style={{ fontFamily: "var(--font-heading)" }}>2,845</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-100">
        {categoryData.map((cat) => (
          <div key={cat.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
              <span className="font-medium text-slate-700">{cat.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">{cat.value}</span>
              <span className="text-slate-400 text-[10px]">({cat.pct}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
