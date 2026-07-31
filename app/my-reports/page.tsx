import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { ListChecks, MapPin, LogIn } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db/client";
import { reports, complaints } from "@/db/schema";
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

export default async function MyReportsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="p-6 sm:p-10 max-w-2xl mx-auto flex flex-col items-center text-center mt-16">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] mb-5">
          <LogIn size={28} />
        </div>
        <h1 className="text-xl font-black text-primary mb-2">Sign in to track your reports</h1>
        <p className="text-sm text-slate-500 mb-6 max-w-sm">
          Create an account or sign in to see the status of every civic issue you've reported.
        </p>
        <Link href="/login" className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-sm hover:bg-primary-hover transition-colors">
          Sign In
        </Link>
      </div>
    );
  }

  const rows = await db
    .select({
      reportId: reports.id,
      reportCreatedAt: reports.createdAt,
      reportImageUrl: reports.imageUrl,
      complaintId: complaints.id,
      yoloClass: complaints.yoloClass,
      severity: complaints.severity,
      department: complaints.department,
      status: complaints.status,
      priorityScore: complaints.priorityScore,
      reportCount: complaints.reportCount,
      addressText: complaints.addressText,
    })
    .from(reports)
    .leftJoin(complaints, eq(reports.complaintId, complaints.id))
    .where(eq(reports.reporterId, user.id))
    .orderBy(desc(reports.createdAt));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-sm">
          <ListChecks size={16} className="text-white" />
        </div>
        <h1 className="text-2xl font-black text-primary tracking-tight">My Reports</h1>
      </div>
      <p className="text-sm text-slate-500 font-medium mb-6">
        Every civic issue you've reported and where it stands.
      </p>

      {rows.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-border">
          <ListChecks size={40} className="mx-auto mb-2 opacity-50" />
          <p className="font-bold text-slate-600 mb-2">You haven't reported anything yet</p>
          <Link href="/report" className="text-sm font-semibold text-accent hover:text-accent-hover transition-colors">
            Report your first issue
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {rows.map((row) => {
            const severity = severityStyle(row.severity);
            return (
              <div key={row.reportId} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden p-5 flex items-start gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={row.reportImageUrl} alt="" className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        {row.status && (
                          <span className={cn("px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border", severity.badgeClass)}>
                            {severity.label}
                          </span>
                        )}
                        <span className="text-xs text-slate-400 font-medium">
                          Reported {formatDistanceToNow(new Date(row.reportCreatedAt), { addSuffix: true })}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-primary leading-snug">
                        {row.yoloClass ? formatIssueLabel(row.yoloClass) : "Report Submitted"}
                      </h3>
                    </div>
                  </div>

                  {row.status ? (
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                        <div className={cn("w-1.5 h-1.5 rounded-full", STATUS_DOT[row.status])} />
                        {STATUS_LABELS[row.status]}
                      </span>
                      {row.department && (
                        <span className="text-[#2563EB] font-semibold">
                          {DEPARTMENT_LABELS[row.department as DepartmentType] ?? row.department}
                        </span>
                      )}
                      {row.addressText && (
                        <span className="flex items-center gap-1"><MapPin size={12} /> {row.addressText}</span>
                      )}
                      {row.reportCount && row.reportCount > 1 && (
                        <span>{row.reportCount} citizens reported this</span>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">This report's complaint record is no longer available.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
