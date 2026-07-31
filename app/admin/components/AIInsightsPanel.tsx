"use client";

import { motion } from "framer-motion";
import { Sparkles, Brain, AlertTriangle, TrendingUp, ShieldAlert, CopyCheck } from "lucide-react";
import type { OverviewStats, DepartmentPerformanceRow } from "@/lib/data/analytics";
import { DEPARTMENT_LABELS } from "@/lib/constants/departments";

export default function AIInsightsPanel({
  stats,
  departments,
}: {
  stats: OverviewStats;
  departments: DepartmentPerformanceRow[];
}) {
  const resolutionRate = stats.total > 0 ? Math.round(((stats.resolved) / stats.total) * 100) : 0;

  const busiestDept = departments
    .filter((d) => d.pending > 0)
    .sort((a, b) => b.pending - a.pending)[0];

  return (
    <div className="w-full xl:w-[320px] shrink-0 flex flex-col gap-4">
      {/* Resolution Rate */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-2xl border border-border shadow-sm p-5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-bl-full -z-10" />

        <div className="flex items-center gap-2 mb-4">
          <Brain size={18} className="text-blue-600" />
          <h3 className="font-bold text-primary">Resolution Rate</h3>
        </div>

        <div className="flex items-end gap-3 mb-2">
          <div className="text-5xl font-black text-primary tracking-tighter">{resolutionRate}%</div>
          <div className="text-sm font-bold text-slate-500 mb-1">
            {stats.resolved} of {stats.total}
          </div>
        </div>
        <p className="text-xs font-semibold text-slate-500">
          Share of all reported issues that have been marked resolved.
        </p>
      </motion.div>

      {/* Real pipeline + backlog insights */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex-1"
      >
        <div className="h-12 border-b border-border/50 flex items-center px-4 bg-slate-50/50">
          <Sparkles size={16} className="text-accent mr-2" />
          <h3 className="font-bold text-primary text-sm">Detection Pipeline Insights</h3>
        </div>

        <div className="p-4 flex flex-col gap-4">
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <TrendingUp size={16} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1">Avg Detection Confidence</div>
              <p className="text-xs font-medium text-slate-700 leading-relaxed">
                {stats.total > 0
                  ? `${Math.round(stats.avgConfidence * 100)}% average YOLO confidence across ${stats.total} reports.`
                  : "No reports processed yet."}
              </p>
            </div>
          </div>

          {stats.safetyRiskCount > 0 && (
            <div className="p-3 bg-red-50 rounded-xl border border-red-100 flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <ShieldAlert size={16} />
              </div>
              <div>
                <div className="text-[11px] font-bold text-red-600 uppercase tracking-wider mb-1">Safety Risk Flagged</div>
                <p className="text-xs font-medium text-slate-700 leading-relaxed">
                  {stats.safetyRiskCount} report{stats.safetyRiskCount === 1 ? "" : "s"} flagged as an immediate safety hazard.
                </p>
              </div>
            </div>
          )}

          {stats.mergedCount > 0 && (
            <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <CopyCheck size={16} />
              </div>
              <div>
                <div className="text-[11px] font-bold text-purple-600 uppercase tracking-wider mb-1">Duplicates Corroborated</div>
                <p className="text-xs font-medium text-slate-700 leading-relaxed">
                  {stats.mergedCount} complaint{stats.mergedCount === 1 ? "" : "s"} confirmed by more than one citizen report.
                </p>
              </div>
            </div>
          )}

          {busiestDept && (
            <div className="p-3 bg-orange-50 rounded-xl border border-orange-100 flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <AlertTriangle size={16} />
              </div>
              <div>
                <div className="text-[11px] font-bold text-orange-600 uppercase tracking-wider mb-1">Highest Backlog</div>
                <p className="text-xs font-medium text-slate-700 leading-relaxed">
                  {DEPARTMENT_LABELS[busiestDept.name]} has {busiestDept.pending} open issue{busiestDept.pending === 1 ? "" : "s"} awaiting action.
                </p>
              </div>
            </div>
          )}

          {stats.total === 0 && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 font-medium">
              Insights will appear here once citizens start submitting reports.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
