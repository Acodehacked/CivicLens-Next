"use client";

import Link from "next/link";
import {
  Sparkles,
  Activity,
  MapPin,
  AlertTriangle,
  Download,
  FileText,
  Map,
  ListTodo,
  ChevronRight
} from "lucide-react";
import type { OverviewStats, DepartmentPerformanceRow, TopLocationRow } from "@/lib/data/analytics";
import { DEPARTMENT_LABELS } from "@/lib/constants/departments";

export default function AnalyticsAIPanel({
  stats,
  departments,
  topLocation,
}: {
  stats: OverviewStats;
  departments: DepartmentPerformanceRow[];
  topLocation: TopLocationRow | null;
}) {
  const resolutionRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;
  const busiestDept = departments.filter((d) => d.pending > 0).sort((a, b) => b.pending - a.pending)[0];

  return (
    <aside className="w-full lg:w-80 shrink-0 bg-white border-l border-slate-200 p-5 flex flex-col gap-6 overflow-y-auto z-10">

      {/* Resolution Rate */}
      <div className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-4 relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB]">Resolution Rate</span>
          <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl font-extrabold text-slate-900">{resolutionRate}%</span>
          <span className="text-xs font-bold text-[#2563EB]">{stats.resolved} of {stats.total} resolved</span>
        </div>

        <div className="w-full h-2 bg-blue-200/60 rounded-full overflow-hidden mb-2">
          <div className="h-full bg-[#2563EB] rounded-full" style={{ width: `${resolutionRate}%` }} />
        </div>
        <p className="text-[11px] text-slate-600 leading-tight">
          Share of all reported issues marked resolved, across the scope you can see.
        </p>
      </div>

      {/* Real diagnostics */}
      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Diagnostics</h4>

        {topLocation && (
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-3">
            <MapPin size={16} className="text-[#2563EB] shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-slate-900 block">Top Reported Location</span>
              <span className="text-slate-500 block text-[11px]">{topLocation.addressText} ({topLocation.complaintCount} complaints)</span>
            </div>
          </div>
        )}

        {busiestDept && (
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-3">
            <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-slate-900 block">Highest Backlog</span>
              <span className="text-slate-500 block text-[11px]">{DEPARTMENT_LABELS[busiestDept.name]} ({busiestDept.pending} pending)</span>
            </div>
          </div>
        )}

        <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-3">
          <Activity size={16} className="text-purple-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-slate-900 block">Avg Detection Confidence</span>
            <span className="text-slate-500 block text-[11px]">{Math.round(stats.avgConfidence * 100)}% across {stats.total} reports</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-auto pt-4 border-t border-slate-200 flex flex-col gap-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Quick Actions</h4>

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
          href="/admin/priority-queue"
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
