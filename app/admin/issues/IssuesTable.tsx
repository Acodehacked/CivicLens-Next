"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, Building2, Loader2, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatDistanceToNow } from "date-fns";
import type { Complaint } from "@/db/schema";
import { DEPARTMENT_LABELS, type DepartmentType } from "@/lib/constants/departments";
import { severityStyle, formatIssueLabel } from "@/lib/constants/severity";
import { updateComplaintStatus } from "@/lib/actions/complaint-status";

const STATUS_OPTIONS = ["All", "open", "in_progress", "resolved", "rejected", "duplicate"] as const;

const STATUS_LABELS: Record<string, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  rejected: "Rejected",
  duplicate: "Duplicate",
};

const STATUS_DOT: Record<string, string> = {
  open: "bg-blue-500",
  in_progress: "bg-orange-500 animate-pulse",
  resolved: "bg-green-500",
  rejected: "bg-slate-400",
  duplicate: "bg-purple-400",
};

export default function IssuesTable({ issues, isAdmin }: { issues: Complaint[]; isAdmin: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [actingId, setActingId] = useState<string | null>(null);

  const filtered = issues.filter((issue) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (issue.yoloClass ?? "").toLowerCase().includes(q) ||
      (issue.addressText ?? "").toLowerCase().includes(q) ||
      issue.id.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || issue.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const setStatus = (id: string, status: "in_progress" | "resolved" | "rejected") => {
    setActingId(id);
    startTransition(async () => {
      await updateComplaintStatus(id, status);
      setActingId(null);
      router.refresh();
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-sm">
          <ListChecks size={16} className="text-white" />
        </div>
        <h1 className="text-2xl font-black text-primary tracking-tight">
          {isAdmin ? "All Issues" : "Your Department's Issues"}
        </h1>
      </div>
      <p className="text-sm text-slate-500 font-medium mb-6">
        {isAdmin ? "Every complaint across all departments." : "Complaints routed to your department."}
      </p>

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
        <div className="flex flex-wrap items-center gap-2">
          {STATUS_OPTIONS.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold border transition-all",
                statusFilter === status ? "bg-[#2563EB] text-white border-[#2563EB]" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              )}
            >
              {status === "All" ? "All Statuses" : STATUS_LABELS[status]}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-border/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-3 font-bold">Issue</th>
                <th className="px-5 py-3 font-bold">Severity</th>
                <th className="px-5 py-3 font-bold">Status</th>
                {isAdmin && <th className="px-5 py-3 font-bold">Department</th>}
                <th className="px-5 py-3 font-bold">Reports</th>
                <th className="px-5 py-3 font-bold">Priority</th>
                <th className="px-5 py-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filtered.map((issue) => {
                const severity = severityStyle(issue.severity);
                return (
                  <tr key={issue.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {issue.thumbnailUrl || issue.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={issue.thumbnailUrl ?? issue.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200" />
                        )}
                        <div>
                          <div className="text-sm font-bold text-primary">{formatIssueLabel(issue.yoloClass)}</div>
                          <div className="text-xs text-slate-400">
                            {issue.id.slice(0, 8)} • {formatDistanceToNow(new Date(issue.lastReportedAt), { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className={cn("inline-flex px-2 py-0.5 rounded text-[10px] font-bold border", severity.badgeClass)}>
                        {severity.label}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                        <div className={cn("w-1.5 h-1.5 rounded-full", STATUS_DOT[issue.status])} />
                        {STATUS_LABELS[issue.status]}
                      </div>
                    </td>
                    {isAdmin && (
                      <td className="px-5 py-3 text-xs font-semibold text-[#2563EB]">
                        <span className="flex items-center gap-1">
                          <Building2 size={12} /> {DEPARTMENT_LABELS[issue.department as DepartmentType] ?? issue.department}
                        </span>
                      </td>
                    )}
                    <td className="px-5 py-3 text-sm font-bold text-slate-700">{issue.reportCount}</td>
                    <td className="px-5 py-3 text-sm font-bold text-slate-700">{issue.priorityScore.toFixed(0)}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {issue.status === "open" && (
                          <button
                            disabled={isPending && actingId === issue.id}
                            onClick={() => setStatus(issue.id, "in_progress")}
                            className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-[11px] font-bold hover:bg-blue-100 transition-colors disabled:opacity-60 flex items-center gap-1"
                          >
                            {isPending && actingId === issue.id && <Loader2 size={11} className="animate-spin" />}
                            Start
                          </button>
                        )}
                        {issue.status === "in_progress" && (
                          <button
                            disabled={isPending && actingId === issue.id}
                            onClick={() => setStatus(issue.id, "resolved")}
                            className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-100 rounded-lg text-[11px] font-bold hover:bg-green-100 transition-colors disabled:opacity-60 flex items-center gap-1"
                          >
                            {isPending && actingId === issue.id && <Loader2 size={11} className="animate-spin" />}
                            Resolve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-12 text-center text-slate-400">
            <p className="font-bold text-slate-600">No issues match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
