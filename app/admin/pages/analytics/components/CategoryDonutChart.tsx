"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import type { CategoryCount } from "@/lib/data/analytics";
import { formatIssueLabel } from "@/lib/constants/severity";

const PALETTE = ["#2563EB", "#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE", "#DBEAFE"];

export default function CategoryDonutChart({ categories }: { categories: CategoryCount[] }) {
  const total = categories.reduce((sum, c) => sum + c.count, 0);
  const data = categories.map((c, i) => ({
    name: formatIssueLabel(c.category),
    value: c.count,
    pct: total > 0 ? Math.round((c.count / total) * 100) : 0,
    color: PALETTE[i % PALETTE.length],
  }));

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col h-full" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <h2 className="text-base font-bold text-slate-900 mb-1">Issue Categories</h2>
      <p className="text-xs text-slate-500 mb-4">Distribution across AI-detected categories</p>

      {data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm text-slate-400 font-medium">No reports yet</div>
      ) : (
        <>
          <div className="relative w-full h-44 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={3} dataKey="value">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }: any) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl text-xs border border-slate-700">
                          <p className="font-bold text-white">{d.name}</p>
                          <p className="text-slate-300">{d.value} reports ({d.pct}%)</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-extrabold text-slate-900">{total}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-100">
            {data.map((cat) => (
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
        </>
      )}
    </div>
  );
}
