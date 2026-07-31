"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatDistanceToNow } from "date-fns";
import type { Complaint } from "@/db/schema";
import { DEPARTMENT_LABELS, type DepartmentType } from "@/lib/constants/departments";
import { severityStyle, formatIssueLabel } from "@/lib/constants/severity";

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

export default function ReportsTable({ reports }: { reports: Complaint[] }) {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col col-span-1 xl:col-span-2">
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-bold text-primary">Recent Reports</h3>
          <p className="text-[11px] font-semibold text-slate-400">Latest AI-routed civic issues</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-border/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="px-5 py-3 font-bold">Report Category</th>
              <th className="px-5 py-3 font-bold">Severity</th>
              <th className="px-5 py-3 font-bold">Status</th>
              <th className="px-5 py-3 font-bold">Assigned Department</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {reports.map((report) => {
              const severity = severityStyle(report.severity);
              return (
                <tr key={report.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={report.thumbnailUrl ?? report.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                      <div>
                        <div className="text-sm font-bold text-primary">{formatIssueLabel(report.yoloClass)}</div>
                        <div className="text-xs text-slate-400">
                          {report.id.slice(0, 8)} • {formatDistanceToNow(new Date(report.lastReportedAt), { addSuffix: true })}
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
                      <div className={cn("w-1.5 h-1.5 rounded-full", STATUS_DOT[report.status])} />
                      {STATUS_LABELS[report.status]}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs font-semibold text-[#2563EB]">
                    {DEPARTMENT_LABELS[report.department as DepartmentType] ?? report.department}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {reports.length === 0 && (
          <div className="p-10 text-center text-sm font-medium text-slate-400">No reports yet.</div>
        )}
      </div>

      <div className="p-3 border-t border-border bg-slate-50/50 flex justify-center mt-auto">
        <Link href="/admin/issues" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1">
          View All Reports <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}
