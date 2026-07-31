"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  CloudRain, 
  Activity, 
  MapPin, 
  AlertTriangle, 
  HardHat, 
  FileText, 
  Download, 
  Map, 
  ListTodo,
  CheckCircle2,
  ChevronRight
} from "lucide-react";

export default function AnalyticsAIPanel() {
  const [summaryGenerated, setSummaryGenerated] = useState(false);

  return (
    <aside className="w-full lg:w-80 shrink-0 bg-white border-l border-slate-200 p-5 flex flex-col gap-6 overflow-y-auto z-10">
      
      {/* City Health Score Header */}
      <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-4 relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB]">
            City Health Score
          </span>
          <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl font-extrabold text-slate-900" style={{ fontFamily: "var(--font-heading)" }}>
            86%
          </span>
          <span className="text-xs font-bold text-[#2563EB]">Optimal Operations</span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-blue-200/60 rounded-full overflow-hidden mb-2">
          <div className="h-full bg-[#2563EB] rounded-full" style={{ width: "86%" }} />
        </div>
        <p className="text-[11px] text-slate-600 leading-tight">
          Overall municipal infrastructure stability index calculated from report resolution velocity and backlog.
        </p>
      </div>

      {/* Weather Alert & Risk Prediction */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4">
        <div className="flex items-center gap-2 text-amber-700 mb-2">
          <CloudRain size={18} />
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
            Weather Alert &amp; Forecast
          </h3>
        </div>
        <p className="text-xs text-amber-900 font-semibold mb-1">
          Heavy rainfall expected tomorrow
        </p>
        <p className="text-[11px] text-amber-800 leading-relaxed mb-3">
          Flood-related reports are predicted to increase by approximately <strong className="text-amber-950">30%</strong> in low-lying zones.
        </p>
        <div className="p-2 bg-white/80 rounded-xl border border-amber-200 text-[10px] font-medium text-amber-900 flex items-center gap-1.5">
          <Sparkles size={13} className="text-amber-600 shrink-0" />
          <span>Recommend pre-deploying drainage teams to Ward 4.</span>
        </div>
      </div>

      {/* Predictive Hotspots & Heavy Load */}
      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          AI Risk Diagnostics
        </h4>

        {/* Predicted Hotspots */}
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-3">
          <MapPin size={16} className="text-[#2563EB] shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-slate-900 block">Predicted Hotspots</span>
            <span className="text-slate-500 block text-[11px]">Ward 4 &amp; MG Road Corridor</span>
          </div>
        </div>

        {/* Heavy Load Department */}
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-3">
          <HardHat size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-slate-900 block">Department Heavy Load</span>
            <span className="text-slate-500 block text-[11px]">Road Maintenance (92% queue cap)</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-auto pt-4 border-t border-slate-200 flex flex-col gap-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
          Quick Actions
        </h4>

        <button
          onClick={() => {
            setSummaryGenerated(true);
            setTimeout(() => setSummaryGenerated(false), 4000);
          }}
          className="w-full py-2.5 px-3 bg-[#2563EB] text-white rounded-xl text-xs font-semibold shadow-sm hover:bg-[#1D4ED8] transition-all flex items-center justify-center gap-2 active:scale-98"
        >
          <Sparkles size={14} />
          <span>{summaryGenerated ? "AI Summary Generated ✓" : "Generate AI Summary"}</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button className="py-2 px-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 shadow-sm">
            <Download size={13} className="text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button className="py-2 px-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 shadow-sm">
            <FileText size={13} className="text-slate-500" />
            <span>Export PDF</span>
          </button>
        </div>

        <Link
          href="/map"
          className="w-full py-2 px-3 bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Map size={14} className="text-[#2563EB]" />
            <span>Open Community Map</span>
          </div>
          <ChevronRight size={14} className="text-slate-400" />
        </Link>

        <Link
          href="/admin"
          className="w-full py-2 px-3 bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <ListTodo size={14} className="text-[#2563EB]" />
            <span>View Priority Queue</span>
          </div>
          <ChevronRight size={14} className="text-slate-400" />
        </Link>
      </div>

    </aside>
  );
}
