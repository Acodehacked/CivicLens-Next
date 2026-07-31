"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type TimeRange = "Today" | "7 Days" | "30 Days" | "12 Months";

const dataMap: Record<TimeRange, { label: string; reports: number; resolved: number }[]> = {
  Today: [
    { label: "06:00", reports: 12, resolved: 8 },
    { label: "09:00", reports: 38, resolved: 22 },
    { label: "12:00", reports: 64, resolved: 41 },
    { label: "15:00", reports: 85, resolved: 58 },
    { label: "18:00", reports: 42, resolved: 36 },
    { label: "21:00", reports: 18, resolved: 15 },
  ],
  "7 Days": [
    { label: "Mon", reports: 180, resolved: 145 },
    { label: "Tue", reports: 220, resolved: 190 },
    { label: "Wed", reports: 248, resolved: 210 },
    { label: "Thu", reports: 210, resolved: 185 },
    { label: "Fri", reports: 290, resolved: 240 },
    { label: "Sat", reports: 160, resolved: 150 },
    { label: "Sun", reports: 130, resolved: 125 },
  ],
  "30 Days": [
    { label: "Week 1", reports: 620, resolved: 540 },
    { label: "Week 2", reports: 740, resolved: 680 },
    { label: "Week 3", reports: 810, resolved: 760 },
    { label: "Week 4", reports: 675, resolved: 630 },
  ],
  "12 Months": [
    { label: "Jan", reports: 1400, resolved: 1250 },
    { label: "Feb", reports: 1650, resolved: 1510 },
    { label: "Mar", reports: 1820, resolved: 1700 },
    { label: "Apr", reports: 1950, resolved: 1820 },
    { label: "May", reports: 2100, resolved: 1980 },
    { label: "Jun", reports: 2450, resolved: 2300 },
    { label: "Jul", reports: 2845, resolved: 2680 },
  ],
};

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs border border-slate-700">
        <p className="font-bold text-slate-300 mb-1">{label}</p>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
          <span>New Reports: <strong className="text-white">{payload[0].value}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#60A5FA]" />
          <span>Resolved: <strong className="text-white">{payload[1]?.value}</strong></span>
        </div>
      </div>
    );
  }
  return null;
}

export default function ReportTrendsChart() {
  const [range, setRange] = useState<TimeRange>("7 Days");

  const data = dataMap[range];

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col h-full" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-base font-bold text-slate-900" style={{ fontFamily: "var(--font-heading)" }}>
            Reports Over Time
          </h2>
          <p className="text-xs text-slate-500" style={{ fontFamily: "var(--font-body)" }}>
            Volume of incoming civic issue reports vs resolution rate
          </p>
        </div>

        {/* Time Switches */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          {(["Today", "7 Days", "30 Days", "12 Months"] as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                range === r
                  ? "bg-white text-[#2563EB] shadow-sm font-bold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="reportsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="resolvedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#60A5FA" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="label" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="reports"
              stroke="#2563EB"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#reportsGrad)"
            />
            <Area
              type="monotone"
              dataKey="resolved"
              stroke="#60A5FA"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#resolvedGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
