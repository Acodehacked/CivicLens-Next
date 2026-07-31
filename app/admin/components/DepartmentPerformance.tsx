"use client";

import { motion } from "framer-motion";
import { HardHat, Trash2, Droplets, Trees, ShieldAlert } from "lucide-react";
import type { DepartmentPerformanceRow } from "@/lib/data/analytics";
import type { DepartmentType } from "@/lib/constants/departments";
import { DEPARTMENT_LABELS } from "@/lib/constants/departments";

const ICONS: Record<DepartmentType, any> = {
  roads: HardHat,
  sanitation: Trash2,
  drainage: Droplets,
  parks: Trees,
  disaster_management: ShieldAlert,
};

const COLORS: Record<DepartmentType, string> = {
  roads: "text-blue-600 bg-blue-50",
  sanitation: "text-emerald-600 bg-emerald-50",
  drainage: "text-cyan-600 bg-cyan-50",
  parks: "text-green-600 bg-green-50",
  disaster_management: "text-rose-600 bg-rose-50",
};

export default function DepartmentPerformance({ departments }: { departments: DepartmentPerformanceRow[] }) {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-border">
        <h3 className="font-bold text-primary">Department Performance</h3>
        <p className="text-[11px] font-semibold text-slate-400">Resolution metrics by official department</p>
      </div>

      <div className="flex flex-col p-2 overflow-y-auto max-h-[420px]">
        {departments.map((dept, idx) => {
          const Icon = ICONS[dept.name];
          const total = dept.resolved + dept.pending;
          const resolvedPct = total > 0 ? (dept.resolved / total) * 100 : 0;
          const pendingPct = total > 0 ? (dept.pending / total) * 100 : 0;
          return (
            <motion.div
              key={dept.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="p-3 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <div className={`w-7 h-7 rounded-lg ${COLORS[dept.name]} flex items-center justify-center shrink-0`}>
                    <Icon size={14} />
                  </div>
                  <div className="text-xs font-bold text-primary truncate" title={DEPARTMENT_LABELS[dept.name]}>
                    {DEPARTMENT_LABELS[dept.name]}
                  </div>
                </div>
                <div className="text-xs font-black text-slate-700 shrink-0">
                  {dept.assigned} <span className="text-[9px] text-slate-400 font-semibold">total</span>
                </div>
              </div>

              <div className="w-full h-1.5 bg-slate-100 rounded-full mb-2 overflow-hidden flex">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${resolvedPct}%` }} />
                <div className="h-full bg-orange-400 rounded-r-full" style={{ width: `${pendingPct}%` }} />
              </div>

              <div className="flex justify-between text-[10px] font-semibold">
                <div className="text-green-600">{dept.resolved} Resolved</div>
                <div className="text-orange-500">{dept.pending} Open</div>
                {dept.avgResolutionHours != null && (
                  <div className="text-slate-500">Target {dept.avgResolutionHours}h</div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
