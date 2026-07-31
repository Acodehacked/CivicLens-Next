"use client";

import { Sparkles, MapPin, Copy } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { RecentEvent } from "@/lib/data/analytics";
import { DEPARTMENT_LABELS, type DepartmentType } from "@/lib/constants/departments";
import { formatIssueLabel } from "@/lib/constants/severity";

export default function RecentAIInsightsTimeline({ events }: { events: RecentEvent[] }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col h-full" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center border border-[#BFDBFE]">
          <Sparkles size={14} />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Recent Report Activity</h2>
          <p className="text-xs text-slate-500">Latest citizen submissions processed by the pipeline</p>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-sm text-slate-400 font-medium">No activity yet</div>
      ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
          {events.map((ev) => (
            <div key={ev.reportId} className="relative group">
              <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border flex items-center justify-center shadow-xs ${
                ev.isDuplicate ? "bg-purple-50 text-purple-600 border-purple-200" : "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]"
              }`}>
                {ev.isDuplicate ? <Copy size={10} /> : <MapPin size={10} />}
              </div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#2563EB] transition-colors">
                    {formatIssueLabel(ev.yoloClass)} {ev.isDuplicate ? "(duplicate merged)" : "reported"}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium shrink-0">
                    {formatDistanceToNow(new Date(ev.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {ev.addressText ?? "Location unavailable"}
                  {ev.department && ` — routed to ${DEPARTMENT_LABELS[ev.department as DepartmentType] ?? ev.department}`}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
