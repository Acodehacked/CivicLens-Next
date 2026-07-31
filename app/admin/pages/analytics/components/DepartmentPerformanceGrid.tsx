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

export default function DepartmentPerformanceGrid({ departments }: { departments: DepartmentPerformanceRow[] }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-slate-900">Department Performance Analytics</h2>
          <p className="text-xs text-slate-500">
            Workload distribution and resolution efficiency across all {departments.length} official municipal departments
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept, idx) => {
          const Icon = ICONS[dept.name];
          const resolvedPct = dept.assigned > 0 ? Math.round((dept.resolved / dept.assigned) * 100) : 0;
          return (
            <motion.div
              key={dept.name}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 hover:bg-white hover:border-[#BFDBFE] hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center border border-[#BFDBFE] shrink-0">
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-slate-900 truncate" title={DEPARTMENT_LABELS[dept.name]}>
                      {DEPARTMENT_LABELS[dept.name]}
                    </h3>
                    {dept.avgResolutionHours != null && (
                      <p className="text-[10px] text-slate-400 font-medium">Target: {dept.avgResolutionHours}h</p>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-extrabold text-[#2563EB]">{resolvedPct}%</span>
                  <span className="block text-[9px] text-slate-400 font-medium uppercase">Resolved</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 mb-3 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Assigned</span>
                  <span className="text-xs font-extrabold text-slate-800">{dept.assigned}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Resolved</span>
                  <span className="text-xs font-extrabold text-[#2563EB]">{dept.resolved}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Pending</span>
                  <span className="text-xs font-extrabold text-amber-600">{dept.pending}</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1">
                  <span>Resolution Progress</span>
                  <span className="font-bold text-slate-700">{resolvedPct}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#2563EB] rounded-full transition-all duration-500" style={{ width: `${resolvedPct}%` }} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
