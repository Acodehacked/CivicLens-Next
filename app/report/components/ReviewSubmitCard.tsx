"use client";

import { CheckCircle2, MapPin, Building, FileText, Sparkles, AlertTriangle, Loader2, UploadCloud } from "lucide-react";
import type { ProcessReportResult, SimilarReportMatch } from "@/lib/api/civiclens";
import type { AIState } from "./AIIntelligencePanel";
import { DEPARTMENT_LABELS, type DepartmentType } from "@/lib/constants/departments";
import { severityStyle, formatIssueLabel } from "@/lib/constants/severity";
import { cn } from "@/lib/utils/cn";

function departmentLabel(department: string | null) {
  if (!department) return "Unassigned";
  return DEPARTMENT_LABELS[department as DepartmentType] ?? formatIssueLabel(department);
}

export default function ReviewSubmitCard({
  previewUrl,
  locationCoords,
  result,
  similarReports = [],
  isSubmitting,
  aiState,
  uploadProgress = 0,
  submitError,
}: {
  previewUrl?: string | null;
  locationCoords?: { lat: number; lng: number } | null;
  result?: ProcessReportResult | null;
  similarReports?: SimilarReportMatch[];
  isSubmitting?: boolean;
  aiState?: AIState;
  uploadProgress?: number;
  submitError?: string | null;
}) {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden p-4 sm:p-6 mb-24 lg:mb-6">
      <h3 className="font-bold text-primary text-base sm:text-lg mb-4 sm:mb-6 flex items-center gap-2">
        <CheckCircle2 className="text-green-600" size={20} />
        Review Your Submission
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Left Column: photo + location */}
        <div className="space-y-4">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FileText size={13} /> Photo Evidence
            </div>
            <div className="rounded-xl border border-slate-100 overflow-hidden bg-slate-50 h-40">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="Report evidence" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                  No photo attached
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MapPin size={13} /> Location Coordinates
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="font-bold text-primary font-mono text-xs sm:text-sm">
                {locationCoords
                  ? `${locationCoords.lat.toFixed(5)}, ${locationCoords.lng.toFixed(5)}`
                  : "Not set"}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: status */}
        <div className="space-y-4">
          {submitError && (
            <div className="p-3.5 bg-red-50 rounded-xl border border-red-100 flex items-start gap-2.5 text-xs font-semibold text-red-700">
              <AlertTriangle size={15} className="shrink-0 mt-0.5" />
              {submitError}
            </div>
          )}

          {isSubmitting && aiState === "UPLOADING" && (
            <div className="flex flex-col gap-2 p-3.5 bg-blue-50 rounded-xl border border-blue-100 text-xs font-semibold text-blue-700">
              <div className="flex items-center gap-2.5">
                <UploadCloud size={15} className="shrink-0" />
                Uploading photo… {uploadProgress}%
              </div>
              <div className="h-1.5 w-full bg-blue-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {isSubmitting && aiState === "ANALYZING" && (
            <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-100 flex items-center gap-2.5 text-xs font-semibold text-purple-700">
              <Loader2 size={15} className="shrink-0 animate-spin" />
              Running AI detection and severity scoring…
            </div>
          )}

          {!isSubmitting && !result && !submitError && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs font-semibold text-slate-600">
              AI will detect the issue type, assess severity, and route it to the correct department once you submit.
            </div>
          )}

          {result && (
            <>
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Sparkles size={13} /> AI Classification
                </div>
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="font-bold text-primary text-sm sm:text-base">
                    {formatIssueLabel(result.yolo_class)}
                  </div>
                  <div className={cn("px-2.5 py-1 font-extrabold rounded-lg text-xs border", severityStyle(result.severity).badgeClass)}>
                    {severityStyle(result.severity).label}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Building size={13} /> Official Routing Destination
                </div>
                <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100">
                  <div className="font-bold text-[#2563EB] text-sm sm:text-base">{departmentLabel(result.department)}</div>
                </div>
              </div>

              <div className="p-3.5 bg-green-50/60 rounded-xl border border-green-100 text-xs font-semibold text-green-800">
                {result.status === "merged"
                  ? `Merged with an existing report — ${result.report_count} citizens have now reported this issue.`
                  : "New report created and dispatched to the department above."}
              </div>

              {similarReports.length > 0 && (
                <div>
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <MapPin size={13} /> Similar Reports Nearby
                  </div>
                  <div className="flex flex-col gap-2">
                    {similarReports.slice(0, 3).map((match) => (
                      <div key={match.id} className="flex items-center gap-2.5 p-2 bg-slate-50 rounded-xl border border-slate-100 text-xs">
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
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
