"use client";

import { motion } from "framer-motion";
import { HardHat, Trash2, Droplets, Trees, ShieldAlert } from "lucide-react";

const depts = [
  { name: "Road Maintenance Department", icon: HardHat, open: 42, res: 156, avg: "2.4d", score: 92, color: "text-blue-600 bg-blue-50" },
  { name: "Sanitation & Waste Management Department", icon: Trash2, open: 18, res: 210, avg: "1.1d", score: 96, color: "text-emerald-600 bg-emerald-50" },
  { name: "Drainage & Stormwater Department", icon: Droplets, open: 31, res: 120, avg: "2.8d", score: 88, color: "text-cyan-600 bg-cyan-50" },
  { name: "Parks & Tree Maintenance Department", icon: Trees, open: 15, res: 93, avg: "1.9d", score: 94, color: "text-green-600 bg-green-50" },
  { name: "Disaster Management & Emergency Response Department", icon: ShieldAlert, open: 8, res: 74, avg: "0.8d", score: 98, color: "text-rose-600 bg-rose-50" },
];

export default function DepartmentPerformance() {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-border">
        <h3 className="font-bold text-primary">Department Performance</h3>
        <p className="text-[11px] font-semibold text-slate-400">Resolution metrics by official department</p>
      </div>

      <div className="flex flex-col p-2 overflow-y-auto max-h-[420px]">
        {depts.map((dept, idx) => {
          const Icon = dept.icon;
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
                  <div className={`w-7 h-7 rounded-lg ${dept.color} flex items-center justify-center shrink-0`}>
                    <Icon size={14} />
                  </div>
                  <div className="text-xs font-bold text-primary truncate" title={dept.name}>
                    {dept.name}
                  </div>
                </div>
                <div className="text-xs font-black text-green-600 shrink-0">
                  {dept.score} <span className="text-[9px] text-slate-400 font-semibold">/ 100</span>
                </div>
              </div>
              
              {/* Progress Bar (Resolved vs Total) */}
              <div className="w-full h-1.5 bg-slate-100 rounded-full mb-2 overflow-hidden flex">
                <div 
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${(dept.res / (dept.res + dept.open)) * 100}%` }}
                />
                <div 
                  className="h-full bg-orange-400 rounded-r-full"
                  style={{ width: `${(dept.open / (dept.res + dept.open)) * 100}%` }}
                />
              </div>
              
              <div className="flex justify-between text-[10px] font-semibold">
                <div className="text-green-600">{dept.res} Resolved</div>
                <div className="text-orange-500">{dept.open} Open</div>
                <div className="text-slate-500">Avg {dept.avg}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
