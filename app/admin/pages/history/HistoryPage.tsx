"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History, Search, Calendar, CheckCircle2,
  Clock, Building2, Eye, FileText, X,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { cn } from "@/lib/utils/cn";
import type { HistoryEntry, OverviewStats } from "@/lib/data/analytics";
import { DEPARTMENT_LABELS, type DepartmentType } from "@/lib/constants/departments";
import { severityStyle, formatIssueLabel } from "@/lib/constants/severity";

const STATUS_LABELS: Record<string, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  rejected: "Rejected",
  duplicate: "Duplicate",
};

const STATUS_BADGE: Record<string, string> = {
  open: "bg-blue-50 text-blue-700 border-blue-200",
  in_progress: "bg-orange-50 text-orange-700 border-orange-200",
  resolved: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-slate-100 text-slate-600 border-slate-200",
  duplicate: "bg-purple-50 text-purple-700 border-purple-200",
};

export default function HistoryPage({
  entries,
  avgResolutionHours,
  stats,
}: {
  entries: HistoryEntry[];
  avgResolutionHours: number | null;
  stats: OverviewStats;
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<HistoryEntry | null>(null);

  const filtered = entries.filter((e) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (e.yoloClass ?? "").toLowerCase().includes(q) ||
      (e.addressText ?? "").toLowerCase().includes(q) ||
      e.id.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const kpis = [
    { label: "Total Handled", val: stats.total.toLocaleString(), icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Avg Resolution", val: avgResolutionHours != null ? `${avgResolutionHours.toFixed(1)}h` : "—", icon: Clock, color: "text-green-600", bg: "bg-green-50" },
    { label: "Resolved", val: stats.resolved.toLocaleString(), icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
    { label: "Critical", val: stats.critical.toLocaleString(), icon: Building2, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 pb-20">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-sm">
                <History size={16} className="text-white" />
              </div>
              <h1 className="text-2xl font-black text-primary tracking-tight">History Log</h1>
              <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-700 text-xs font-bold">
                {entries.length} Entries
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Every complaint&apos;s current state - what it is, where, and when it was reported and resolved.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {kpis.map((card) => (
            <div key={card.label} className="bg-white rounded-2xl border border-border p-4 shadow-sm">
              <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center mb-2", card.bg, card.color)}>
                <card.icon size={16} />
              </div>
              <div className="text-xl font-black text-primary tracking-tight">{card.val}</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">{card.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search by ID, category, or address…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 shadow-sm"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-5">
          {["All", "open", "in_progress", "resolved", "rejected", "duplicate"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={cn("px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-sm",
                statusFilter === st ? "bg-[#2563EB] text-white border-[#2563EB]" : "bg-white text-slate-600 border-border hover:bg-slate-50"
              )}
            >
              {st === "All" ? "All" : STATUS_LABELS[st]}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="divide-y divide-border/60">
            {filtered.length > 0 ? filtered.map((entry, idx) => {
              const severity = severityStyle(entry.severity);
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.02, 0.3) }}
                  className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={entry.thumbnailUrl ?? entry.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 shadow-sm" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-mono text-xs font-bold text-slate-400">{entry.id.slice(0, 8)}</span>
                        <span className="font-bold text-primary text-sm truncate">{formatIssueLabel(entry.yoloClass)}</span>
                        <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider", severity.badgeClass)}>{severity.label}</span>
                        <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold border", STATUS_BADGE[entry.status])}>{STATUS_LABELS[entry.status]}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-medium flex-wrap">
                        <span className="flex items-center gap-1 text-blue-600 font-semibold">
                          <Building2 size={12} />{DEPARTMENT_LABELS[entry.department as DepartmentType] ?? entry.department}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-400"><Clock size={12} />{formatDistanceToNow(new Date(entry.lastReportedAt), { addSuffix: true })}</span>
                        {entry.reportCount > 1 && (
                          <>
                            <span>•</span>
                            <span>{entry.reportCount} reports</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    <div className="text-right hidden md:block">
                      <div className="text-xs font-bold text-primary">Priority {entry.priorityScore.toFixed(0)}</div>
                    </div>
                    <button
                      onClick={() => setSelected(entry)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors flex items-center gap-1"
                    >
                      <Eye size={13} /> Details
                    </button>
                  </div>
                </motion.div>
              );
            }) : (
              <div className="p-12 text-center text-slate-400">
                <History size={36} className="mx-auto mb-2 opacity-50" />
                <p className="font-semibold text-slate-600">No history entries found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-border shadow-2xl max-w-lg w-full overflow-hidden"
            >
              <div className="p-5 border-b border-border flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-400">{selected.id.slice(0, 8)}</span>
                  <h3 className="font-bold text-primary text-base">{formatIssueLabel(selected.yoloClass)}</h3>
                </div>
                <button onClick={() => setSelected(null)} className="w-7 h-7 rounded-lg text-slate-400 hover:bg-slate-200 flex items-center justify-center">
                  <X size={15} />
                </button>
              </div>
              <div className="p-5 space-y-4 text-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selected.imageUrl} alt="" className="w-full h-40 rounded-xl object-cover border border-slate-200" />
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {[
                    { label: "Department", val: DEPARTMENT_LABELS[selected.department as DepartmentType] ?? selected.department },
                    { label: "Status", val: STATUS_LABELS[selected.status] },
                    { label: "Severity", val: severityStyle(selected.severity).label },
                    { label: "Priority Score", val: selected.priorityScore.toFixed(0) },
                    { label: "Reports Filed", val: String(selected.reportCount) },
                    { label: "Location", val: selected.addressText ?? "Unavailable" },
                    { label: "First Reported", val: format(new Date(selected.firstReportedAt), "MMM d, yyyy h:mm a") },
                    { label: "Last Activity", val: format(new Date(selected.lastReportedAt), "MMM d, yyyy h:mm a") },
                  ].map((row) => (
                    <div key={row.label} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-400 font-semibold block mb-0.5">{row.label}</span>
                      <span className="font-bold text-primary">{row.val}</span>
                    </div>
                  ))}
                  {selected.resolvedAt && (
                    <div className="p-3 bg-green-50 rounded-xl border border-green-200 col-span-2">
                      <span className="text-green-600 font-semibold block mb-0.5 flex items-center gap-1"><Calendar size={11} /> Resolved At</span>
                      <span className="font-bold text-green-900">{format(new Date(selected.resolvedAt), "MMM d, yyyy h:mm a")}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4 border-t border-border bg-slate-50 flex justify-end">
                <button onClick={() => setSelected(null)} className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors">
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
