"use client";

import Link from "next/link";
import { MapPin, Copy } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatDistanceToNow } from "date-fns";
import type { RecentEvent } from "@/lib/data/analytics";
import { DEPARTMENT_LABELS, type DepartmentType } from "@/lib/constants/departments";
import { formatIssueLabel } from "@/lib/constants/severity";

export default function RecentActivity({ events }: { events: RecentEvent[] }) {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden p-5 flex flex-col h-full">
      <div className="mb-4">
        <h3 className="font-bold text-primary">Recent Activity</h3>
        <p className="text-[11px] font-semibold text-slate-400">Latest citizen report submissions</p>
      </div>

      <div className="relative flex-1">
        {events.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center text-sm text-slate-400 font-medium py-8">
            No activity yet.
          </div>
        ) : (
          <>
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-slate-200" />
            <div className="flex flex-col gap-4">
              {events.map((ev) => (
                <div key={ev.reportId} className="flex gap-3 relative z-10">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm ring-1 ring-slate-100",
                    ev.isDuplicate ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"
                  )}>
                    {ev.isDuplicate ? <Copy size={12} /> : <MapPin size={12} />}
                  </div>
                  <div className="pt-1 min-w-0">
                    <p className="text-xs font-semibold text-primary leading-tight pr-2">
                      {ev.isDuplicate
                        ? `Duplicate report merged for ${formatIssueLabel(ev.yoloClass)}`
                        : `${formatIssueLabel(ev.yoloClass)} reported${ev.department ? ` — routed to ${DEPARTMENT_LABELS[ev.department as DepartmentType] ?? ev.department}` : ""}`}
                    </p>
                    <span className="text-[10px] font-medium text-slate-400">
                      {formatDistanceToNow(new Date(ev.createdAt), { addSuffix: true })}
                      {ev.addressText ? ` • ${ev.addressText}` : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Link href="/admin/issues" className="w-full mt-4 py-2 bg-slate-50 text-xs font-bold text-slate-600 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors text-center">
        View Full Log
      </Link>
    </div>
  );
}
