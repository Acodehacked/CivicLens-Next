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
import type { DailyTrendPoint, MonthlyTrendPoint } from "@/lib/data/analytics";

type TimeRange = "7 Days" | "30 Days" | "12 Months";

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs border border-slate-700">
        <p className="font-bold text-slate-300 mb-1">{label}</p>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
          <span>New Reports: <strong className="text-white">{payload[0].value}</strong></span>
        </div>
        {payload[1] && (
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#60A5FA]" />
            <span>Resolved: <strong className="text-white">{payload[1].value}</strong></span>
          </div>
        )}
      </div>
    );
  }
  return null;
}

export default function ReportTrendsChart({
  daily,
  monthly,
}: {
  daily: DailyTrendPoint[];
  monthly: MonthlyTrendPoint[];
}) {
  const [range, setRange] = useState<TimeRange>("7 Days");

  // `daily` covers the last 30 days - "7 Days" is just the tail end of it,
  // so there's no need for a second query.
  const data =
    range === "12 Months"
      ? monthly.map((m) => ({ label: m.label, reports: m.count }))
      : range === "30 Days"
      ? daily.map((d) => ({
          label: new Date(d.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          reports: d.reports,
          resolved: d.resolved,
        }))
      : daily.slice(-7).map((d) => ({ label: d.label, reports: d.reports, resolved: d.resolved }));

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col h-full" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-base font-bold text-slate-900">Reports Over Time</h2>
          <p className="text-xs text-slate-500">Volume of incoming civic issue reports vs resolution rate</p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          {(["7 Days", "30 Days", "12 Months"] as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                range === r ? "bg-white text-[#2563EB] shadow-sm font-bold" : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

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
            <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="reports"
              stroke="#2563EB"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#reportsGrad)"
            />
            {range !== "12 Months" && (
              <Area
                type="monotone"
                dataKey="resolved"
                stroke="#60A5FA"
                strokeWidth={2}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#resolvedGrad)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
