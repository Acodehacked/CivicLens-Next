"use client";

import { motion } from "framer-motion";
import { HardHat, Trash2, Droplets, Zap, ShieldAlert, Trees } from "lucide-react";

interface DepartmentData {
  id: string;
  name: string;
  icon: any;
  assigned: number;
  resolved: number;
  pending: number;
  avgResponse: string;
  score: number;
}

const departments: DepartmentData[] = [
  {
    id: "roads",
    name: "Road Maintenance",
    icon: HardHat,
    assigned: 1081,
    resolved: 980,
    pending: 101,
    avgResponse: "3.8h",
    score: 91,
  },
  {
    id: "sanitation",
    name: "Sanitation",
    icon: Trash2,
    assigned: 711,
    resolved: 685,
    pending: 26,
    avgResponse: "2.4h",
    score: 96,
  },
  {
    id: "drainage",
    name: "Drainage Board",
    icon: Droplets,
    assigned: 512,
    resolved: 460,
    pending: 52,
    avgResponse: "4.5h",
    score: 90,
  },
  {
    id: "electricity",
    name: "Electricity Board",
    icon: Zap,
    assigned: 341,
    resolved: 325,
    pending: 16,
    avgResponse: "3.1h",
    score: 95,
  },
  {
    id: "traffic",
    name: "Traffic & Safety",
    icon: ShieldAlert,
    assigned: 120,
    resolved: 112,
    pending: 8,
    avgResponse: "2.9h",
    score: 93,
  },
  {
    id: "parks",
    name: "Parks & Property",
    icon: Trees,
    assigned: 80,
    resolved: 69,
    pending: 11,
    avgResponse: "5.2h",
    score: 86,
  },
];

export default function DepartmentPerformanceGrid() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-slate-900" style={{ fontFamily: "var(--font-heading)" }}>
            Department Performance
          </h2>
          <p className="text-xs text-slate-500" style={{ fontFamily: "var(--font-body)" }}>
            Workload distribution, efficiency scores, and response times across municipal departments
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept, idx) => (
          <motion.div
            key={dept.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.04 }}
            className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 hover:bg-white hover:border-[#BFDBFE] hover:shadow-md transition-all duration-200"
          >
            {/* Dept Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center border border-[#BFDBFE]">
                  <dept.icon size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900" style={{ fontFamily: "var(--font-heading)" }}>
                    {dept.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">Avg Response: {dept.avgResponse}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-[#2563EB]">{dept.score}%</span>
                <span className="block text-[9px] text-slate-400 font-medium uppercase">Score</span>
              </div>
            </div>

            {/* Metrics */}
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

            {/* Progress Bar */}
            <div>
              <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1">
                <span>Resolution Progress</span>
                <span className="font-bold text-slate-700">{Math.round((dept.resolved / dept.assigned) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#2563EB] rounded-full transition-all duration-500"
                  style={{ width: `${(dept.resolved / dept.assigned) * 100}%` }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
