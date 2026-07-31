"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";

const depts = [
  { name: "Public Works", open: 42, res: 156, avg: "2.4d", score: 92 },
  { name: "Sanitation", open: 18, res: 210, avg: "1.1d", score: 96 },
  { name: "Traffic", open: 24, res: 84, avg: "3.2d", score: 85 },
];

export default function DepartmentPerformance() {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-border">
        <h3 className="font-bold text-primary">Department Performance</h3>
        <p className="text-[11px] font-semibold text-slate-400">Weekly resolution metrics</p>
      </div>

      <div className="flex flex-col p-2">
        {depts.map((dept, idx) => (
          <motion.div 
            key={dept.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-3 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Users size={12} />
                </div>
                <div className="text-sm font-bold text-primary">{dept.name}</div>
              </div>
              <div className="text-xs font-black text-green-600">{dept.score} <span className="text-[10px] text-slate-400 font-semibold">/ 100</span></div>
            </div>
            
            {/* Progress Bar (Resolved vs Total) */}
            <div className="w-full h-1.5 bg-slate-100 rounded-full mb-3 overflow-hidden flex">
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
        ))}
      </div>
    </div>
  );
}
