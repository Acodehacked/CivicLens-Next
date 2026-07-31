"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle, Search, RefreshCw, CheckCircle2,
  Clock, MapPin, Building2, ShieldAlert, Sparkles, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import type { Complaint } from "@/db/schema";
import { DEPARTMENT_LABELS, type DepartmentType } from "@/lib/constants/departments";
import { severityStyle, formatIssueLabel } from "@/lib/constants/severity";
import { updateComplaintStatus } from "@/lib/actions/complaint-status";

export default function PriorityQueuePage({
  reports,
  isAdmin,
  departments,
}: {
  reports: Complaint[];
  isAdmin: boolean;
  departments: readonly DepartmentType[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);

  const filtered = reports.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (r.yoloClass ?? "").toLowerCase().includes(q) ||
      (r.addressText ?? "").toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q);
    const matchDept = selectedDept === "All" || r.department === selectedDept;
    return matchSearch && matchDept;
  });

  const handleStatusChange = (id: string, status: "in_progress" | "resolved") => {
    setActingId(id);
    startTransition(async () => {
      await updateComplaintStatus(id, status);
      setActingId(null);
      router.refresh();
    });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-red-500 rounded-xl flex items-center justify-center shadow-sm">
                <AlertTriangle size={16} className="text-white" />
              </div>
              <h1 className="text-2xl font-black text-primary tracking-tight">Priority Queue</h1>
              <span className="px-2.5 py-0.5 rounded-md bg-red-100 text-red-700 text-xs font-bold">
                {reports.length} Active
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Open and in-progress reports ranked by AI-computed priority score, highest first.
            </p>
          </div>
          <button
            onClick={() => router.refresh()}
            className="flex items-center gap-1.5 px-3 py-2 border border-border bg-white rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 shadow-sm"
          >
            <RefreshCw size={13} /> Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-border p-4 shadow-sm mb-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Search by issue type, address, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {isAdmin && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Department:</span>
              <button
                onClick={() => setSelectedDept("All")}
                className={cn("px-3 py-1.5 rounded-xl text-xs font-bold border transition-all",
                  selectedDept === "All" ? "bg-[#2563EB] text-white border-[#2563EB]" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                )}
              >
                All Departments
              </button>
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={cn("px-3 py-1.5 rounded-xl text-xs font-bold border transition-all",
                    selectedDept === dept ? "bg-[#2563EB] text-white border-[#2563EB]" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  )}
                >
                  {DEPARTMENT_LABELS[dept]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Queue List */}
        <div className="flex flex-col gap-4">
          {filtered.map((item) => {
            const severity = severityStyle(item.severity);
            return (
              <div
                key={item.id}
                className={cn("bg-white rounded-2xl border shadow-sm overflow-hidden transition-all",
                  item.severity === "critical" ? "border-red-200" : "border-border"
                )}
              >
                <div className={cn("h-[3px]", item.severity === "critical" ? "bg-red-500" : "bg-orange-400")} />

                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {item.thumbnailUrl || item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.thumbnailUrl ?? item.imageUrl} alt="" className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0" />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-slate-100 border border-slate-200 shrink-0" />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="font-mono text-xs font-bold text-slate-400">{item.id.slice(0, 8)}</span>
                            <span className={cn("px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border", severity.badgeClass)}>
                              {severity.label}
                            </span>
                            {item.safetyRisk && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-red-50 text-red-700 border border-red-200 flex items-center gap-1">
                                <ShieldAlert size={10} /> Safety Risk
                              </span>
                            )}
                          </div>
                          <h3 className="text-base font-bold text-primary leading-snug">{formatIssueLabel(item.yoloClass)}</h3>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-2xl font-black text-red-600 tabular-nums">{item.priorityScore.toFixed(0)}</div>
                          <div className="text-[9px] font-bold text-slate-400 uppercase">Priority Score</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2.5 my-2 bg-slate-50 rounded-xl px-3 border border-slate-100 text-xs">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 block uppercase">Department</span>
                          <span className="font-bold text-[#2563EB] flex items-center gap-1">
                            <Building2 size={12} /> {DEPARTMENT_LABELS[item.department as DepartmentType] ?? item.department}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 block uppercase">Reports Filed</span>
                          <span className="font-bold text-slate-800">{item.reportCount}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 block uppercase">First Reported</span>
                          <span className="font-bold text-slate-800 flex items-center gap-1">
                            <Clock size={12} /> {formatDistanceToNow(new Date(item.firstReportedAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-medium truncate">
                          <MapPin size={12} className="shrink-0" /> {item.addressText ?? "Location unavailable"}
                        </span>
                        <button
                          onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                          className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1 shrink-0"
                        >
                          {expandedId === item.id ? "Hide Details" : "View Details"}
                        </button>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedId === item.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-slate-100 space-y-3"
                      >
                        {item.severityReasoning && (
                          <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl text-xs">
                            <div className="font-bold text-purple-900 flex items-center gap-1.5 mb-1">
                              <Sparkles size={14} /> AI Severity Reasoning
                            </div>
                            <p className="text-purple-800 leading-relaxed font-medium">{item.severityReasoning}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 flex-wrap gap-2">
                          <div className="text-xs font-semibold text-slate-500">
                            {item.estimatedSize && <>Est. size: <strong className="text-slate-800">{item.estimatedSize}</strong></>}
                          </div>
                          <div className="flex items-center gap-2">
                            {item.status === "open" && (
                              <button
                                disabled={isPending && actingId === item.id}
                                onClick={() => handleStatusChange(item.id, "in_progress")}
                                className="px-4 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-lg text-xs shadow-sm transition-colors flex items-center gap-1 disabled:opacity-60"
                              >
                                {isPending && actingId === item.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                                Mark In Progress
                              </button>
                            )}
                            {item.status === "in_progress" && (
                              <button
                                disabled={isPending && actingId === item.id}
                                onClick={() => handleStatusChange(item.id, "resolved")}
                                className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-xs shadow-sm transition-colors flex items-center gap-1 disabled:opacity-60"
                              >
                                {isPending && actingId === item.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                                Mark Resolved
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-border">
              <CheckCircle2 size={40} className="mx-auto mb-2 opacity-50" />
              <p className="font-bold text-slate-600">No matching issues in the queue</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
