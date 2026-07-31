import { desc } from "drizzle-orm";
import { Radio, MapPin } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { db } from "@/db/client";
import { complaints } from "@/db/schema";
import { DEPARTMENT_LABELS, type DepartmentType } from "@/lib/constants/departments";
import { severityStyle, formatIssueLabel } from "@/lib/constants/severity";
import { cn } from "@/lib/utils/cn";

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

// Public transparency feed - every citizen's recent activity city-wide, not
// just the signed-in user's own reports (that's /my-reports). No login
// required, matching /report allowing anonymous submissions.
export default async function LivePage() {
  const recent = await db
    .select()
    .from(complaints)
    .orderBy(desc(complaints.lastReportedAt))
    .limit(50);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 bg-red-500 rounded-xl flex items-center justify-center shadow-sm">
          <Radio size={16} className="text-white" />
        </div>
        <h1 className="text-2xl font-black text-primary tracking-tight">Live Feed</h1>
      </div>
      <p className="text-sm text-slate-500 font-medium mb-6">
        Recent civic issues reported across the city, most recent first.
      </p>

      {recent.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-border">
          <Radio size={40} className="mx-auto mb-2 opacity-50" />
          <p className="font-bold text-slate-600">No reports yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {recent.map((item) => {
            const severity = severityStyle(item.severity);
            return (
              <div key={item.id} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden p-5 flex items-start gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumbnailUrl ?? item.imageUrl}
                  alt=""
                  className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={cn("px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border", severity.badgeClass)}>
                          {severity.label}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {formatDistanceToNow(new Date(item.lastReportedAt), { addSuffix: true })}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-primary leading-snug">{formatIssueLabel(item.yoloClass)}</h3>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                      <div className={cn("w-1.5 h-1.5 rounded-full", STATUS_DOT[item.status])} />
                      {STATUS_LABELS[item.status]}
                    </span>
                    <span className="text-[#2563EB] font-semibold">
                      {DEPARTMENT_LABELS[item.department as DepartmentType] ?? item.department}
                    </span>
                    {item.addressText && (
                      <span className="flex items-center gap-1"><MapPin size={12} /> {item.addressText}</span>
                    )}
                    {item.reportCount > 1 && <span>{item.reportCount} citizens reported this</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
