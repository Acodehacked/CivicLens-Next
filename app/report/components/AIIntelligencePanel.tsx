"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2, Building, ShieldAlert, ChevronDown, AlertTriangle, Copy, UploadCloud, ScanSearch, MapPin } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useState } from "react";
import type { ProcessReportResult, SimilarReportMatch } from "@/lib/api/civiclens";
import { DEPARTMENT_LABELS, type DepartmentType } from "@/lib/constants/departments";
import { severityStyle, formatIssueLabel } from "@/lib/constants/severity";

export type AIState = "IDLE" | "UPLOADING" | "ANALYZING" | "COMPLETE" | "ERROR";

function departmentLabel(department: string | null) {
  if (!department) return "Unassigned";
  return DEPARTMENT_LABELS[department as DepartmentType] ?? formatIssueLabel(department);
}

export default function AIIntelligencePanel({
  state,
  uploadProgress = 0,
  result,
  similarReports = [],
  error,
}: {
  state: AIState;
  uploadProgress?: number;
  result?: ProcessReportResult | null;
  similarReports?: SimilarReportMatch[];
  error?: string | null;
}) {
  const [mobileExpanded, setMobileExpanded] = useState(true);
  const isBusy = state === "UPLOADING" || state === "ANALYZING";

  const severity = severityStyle(result?.severity);

  const panelContent = (
    <AnimatePresence mode="wait">
      {/* IDLE STATE */}
      {state === "IDLE" && (
        <motion.div
          key="idle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="p-6 text-center flex flex-col items-center justify-center my-auto"
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-[#2563EB] mb-3 border border-blue-100 shadow-sm">
            <Sparkles size={24} />
          </div>
          <h3 className="font-bold text-primary text-base mb-1">Awaiting Submission</h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
            Once you submit your report, AI Vision will detect the issue, score its severity, and route it to the right department.
          </p>
        </motion.div>
      )}

      {/* UPLOADING STATE — real, byte-level progress */}
      {state === "UPLOADING" && (
        <motion.div
          key="uploading"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-5 flex flex-col gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shrink-0">
              <UploadCloud size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-primary">Uploading Photo</h3>
              <p className="text-xs text-slate-500">Sending your image to secure storage</p>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#2563EB] rounded-full"
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              />
            </div>
            <span className="text-xs font-bold text-[#2563EB] tabular-nums self-end">{uploadProgress}%</span>
          </div>
        </motion.div>
      )}

      {/* ANALYZING STATE — honest indeterminate wait, no fake per-stage timer */}
      {state === "ANALYZING" && (
        <motion.div
          key="analyzing"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-5 flex flex-col gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
              <ScanSearch size={18} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-primary">Analyzing with AI Vision</h3>
              <p className="text-xs text-slate-500">Running detection, severity scoring, and routing</p>
            </div>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full w-1/3 bg-purple-500 rounded-full"
              animate={{ x: ["-100%", "300%"] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            This calls the CivicLens detection model directly - it usually takes a few seconds.
          </p>
        </motion.div>
      )}

      {/* ERROR STATE */}
      {state === "ERROR" && (
        <motion.div
          key="error"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-5 flex flex-col gap-3"
        >
          <div className="bg-white p-4 rounded-xl border border-red-200 shadow-sm flex flex-col gap-2">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 border border-red-100">
              <AlertTriangle size={18} />
            </div>
            <h3 className="font-bold text-primary text-sm">Detection Failed</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {error ?? "Something went wrong processing your report. Please try again."}
            </p>
          </div>
        </motion.div>
      )}

      {/* COMPLETE STATE */}
      {state === "COMPLETE" && result && (
        <motion.div
          key="complete"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 sm:p-5 flex flex-col gap-3"
        >
          {/* Primary Insight */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Detected Issue</div>
                <div className="font-extrabold text-primary text-base sm:text-lg leading-tight">
                  {formatIssueLabel(result.yolo_class)}
                </div>
              </div>
              <div className={cn("px-2.5 py-1 rounded-lg text-xs font-black border", severity.badgeClass)}>
                {severity.label} Severity
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-100 flex flex-col">
                <span className="text-[10px] font-bold text-blue-600 uppercase">Priority Score</span>
                <span className="text-xl font-black text-blue-700 tracking-tighter">
                  {result.priority_score.toFixed(1)}
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Report Status</span>
                <span className="text-sm font-black text-slate-700">
                  {result.status === "merged" ? "Merged" : "New Report"}
                </span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2.5 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0"><Building size={14} /></div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Routed Department</div>
                <div className="font-semibold text-primary truncate">{departmentLabel(result.department)}</div>
              </div>
            </div>
            {result.status === "merged" && (
              <>
                <div className="h-px bg-slate-100 w-full" />
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0"><ShieldAlert size={14} /></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Corroborated Reports</div>
                    <div className="font-semibold text-primary truncate">
                      {result.report_count} {result.report_count === 1 ? "citizen has" : "citizens have"} reported this issue
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Similar Reports Nearby (from /similar-reports - supplementary) */}
          {similarReports.length > 0 && (
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin size={12} /> Similar Reports Nearby
              </div>
              {similarReports.slice(0, 4).map((match) => (
                <div key={match.id} className="flex items-center gap-2.5 text-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={match.image_url} alt="" className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-primary truncate">{formatIssueLabel(match.yolo_class)}</div>
                    <div className="text-[10px] text-slate-400">{Math.round(match.distance_meters)}m away</div>
                  </div>
                  <div className="text-[10px] font-bold text-purple-600 shrink-0">{Math.round(match.similarity * 100)}% match</div>
                </div>
              ))}
            </div>
          )}

          {/* Complaint ID */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Complaint ID</div>
              <div className="font-mono text-[11px] text-slate-600">{result.complaint_id}</div>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(result.complaint_id)}
              title="Copy complaint ID"
              className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-white transition-colors"
            >
              <Copy size={13} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Desktop Sidebar (lg+) */}
      <aside className="hidden lg:flex w-96 shrink-0 bg-white border-l border-border flex-col h-full z-20 overflow-y-auto shadow-none">
        <div className="h-16 flex items-center justify-between px-6 border-b border-border/50 bg-slate-50/50 backdrop-blur-xl shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Sparkles className={cn("w-5 h-5", isBusy ? "text-[#2563EB] animate-pulse" : "text-primary")} />
            <h2 className="font-bold text-primary tracking-tight text-base">AI Intelligence</h2>
          </div>
          {state === "COMPLETE" && (
            <div className="px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-[10px] font-extrabold uppercase flex items-center gap-1">
              <CheckCircle2 size={11} /> Complete
            </div>
          )}
          {state === "ERROR" && (
            <div className="px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-[10px] font-extrabold uppercase flex items-center gap-1">
              <AlertTriangle size={11} /> Failed
            </div>
          )}
        </div>
        <div className="flex-1 bg-[#F8FAFC]">
          {panelContent}
        </div>
      </aside>

      {/* Mobile Card / Accordion (< lg) */}
      <div className="block lg:hidden w-full bg-white border border-border rounded-2xl shadow-sm overflow-hidden mt-4 mb-4">
        <button
          onClick={() => setMobileExpanded(!mobileExpanded)}
          className="w-full h-14 px-4 flex items-center justify-between bg-slate-50 border-b border-slate-100 text-left"
        >
          <div className="flex items-center gap-2">
            <Sparkles className={cn("w-4 h-4", isBusy ? "text-[#2563EB] animate-pulse" : "text-primary")} />
            <span className="font-bold text-primary text-sm">AI Intelligence Insights</span>
          </div>
          <div className="flex items-center gap-2">
            {state === "COMPLETE" && (
              <span className="px-2 py-0.5 bg-green-50 text-green-700 font-extrabold text-[10px] rounded border border-green-100">
                Ready
              </span>
            )}
            {state === "ERROR" && (
              <span className="px-2 py-0.5 bg-red-50 text-red-700 font-extrabold text-[10px] rounded border border-red-100">
                Failed
              </span>
            )}
            <ChevronDown size={16} className={cn("text-slate-400 transition-transform", mobileExpanded && "rotate-180")} />
          </div>
        </button>

        {mobileExpanded && (
          <div className="bg-[#F8FAFC]">
            {panelContent}
          </div>
        )}
      </div>
    </>
  );
}
