"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ClipboardCheck, MapPin, Building2, CheckCircle2, XCircle, Loader2, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatDistanceToNow } from "date-fns";
import type { Complaint } from "@/db/schema";
import { DEPARTMENT_LABELS, type DepartmentType } from "@/lib/constants/departments";
import { severityStyle, formatIssueLabel } from "@/lib/constants/severity";
import { updateComplaintStatus } from "@/lib/actions/complaint-status";

export default function ConfirmationsQueue({ pending, isAdmin }: { pending: Complaint[]; isAdmin: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [actingId, setActingId] = useState<string | null>(null);
  const [actingAction, setActingAction] = useState<"in_progress" | "rejected" | null>(null);

  const act = (id: string, status: "in_progress" | "rejected") => {
    setActingId(id);
    setActingAction(status);
    startTransition(async () => {
      await updateComplaintStatus(id, status);
      setActingId(null);
      setActingAction(null);
      router.refresh();
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 bg-amber-500 rounded-xl flex items-center justify-center shadow-sm">
          <ClipboardCheck size={16} className="text-white" />
        </div>
        <h1 className="text-2xl font-black text-primary tracking-tight">Confirmations</h1>
        <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-700 text-xs font-bold">
          {pending.length} Awaiting Review
        </span>
      </div>
      <p className="text-sm text-slate-500 font-medium mb-6">
        New reports for {isAdmin ? "all departments" : "your department"} - confirm to start work, or reject if it's not a genuine issue.
      </p>

      <div className="flex flex-col gap-4">
        {pending.map((item) => {
          const severity = severityStyle(item.severity);
          const busy = isPending && actingId === item.id;
          return (
            <div key={item.id} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="p-5 flex items-start gap-4">
                {item.thumbnailUrl || item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.thumbnailUrl ?? item.imageUrl} alt="" className="w-24 h-24 rounded-xl object-cover border border-slate-200 shrink-0" />
                ) : (
                  <div className="w-24 h-24 rounded-xl bg-slate-100 border border-slate-200 shrink-0" />
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
                      <div className="text-xl font-black text-slate-700 tabular-nums">{item.priorityScore.toFixed(0)}</div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase">Priority</div>
                    </div>
                  </div>

                  {item.severityReasoning && (
                    <p className="text-xs text-slate-600 leading-relaxed mb-2">{item.severityReasoning}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-3">
                    <span className="flex items-center gap-1"><MapPin size={12} /> {item.addressText ?? "Location unavailable"}</span>
                    {isAdmin && (
                      <span className="flex items-center gap-1 text-[#2563EB] font-semibold">
                        <Building2 size={12} /> {DEPARTMENT_LABELS[item.department as DepartmentType] ?? item.department}
                      </span>
                    )}
                    <span>{item.reportCount} report{item.reportCount === 1 ? "" : "s"} filed</span>
                    <span>First seen {formatDistanceToNow(new Date(item.firstReportedAt), { addSuffix: true })}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={busy}
                      onClick={() => act(item.id, "in_progress")}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-xs shadow-sm transition-colors disabled:opacity-60"
                    >
                      {busy && actingAction === "in_progress" ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                      Confirm &amp; Start Work
                    </button>
                    <button
                      disabled={busy}
                      onClick={() => act(item.id, "rejected")}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-lg text-xs shadow-sm transition-colors disabled:opacity-60"
                    >
                      {busy && actingAction === "rejected" ? <Loader2 size={13} className="animate-spin" /> : <XCircle size={13} />}
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {pending.length === 0 && (
          <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-border">
            <CheckCircle2 size={40} className="mx-auto mb-2 opacity-50" />
            <p className="font-bold text-slate-600">Nothing waiting on confirmation</p>
          </div>
        )}
      </div>
    </div>
  );
}
