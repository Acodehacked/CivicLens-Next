"use client";

import { AlertTriangle, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { motion } from "framer-motion";

const queue = [
  {
    id: "REP-105",
    category: "Fallen Tree on Main Rd",
    severity: "Critical",
    score: 98,
    dept: "Parks",
    time: "45m ago",
    img: "https://images.unsplash.com/photo-1594950893301-44755f190e22?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "REP-108",
    category: "Traffic Signal Down",
    severity: "Critical",
    score: 95,
    dept: "Traffic",
    time: "1h ago",
    img: "https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: "REP-104",
    category: "Large Pothole (Multi-car damage)",
    severity: "High",
    score: 88,
    dept: "Public Works",
    time: "10m ago",
    img: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=150&q=80"
  }
];

export default function PriorityQueue() {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle size={18} className="text-red-500" />
          <div>
            <h3 className="font-bold text-primary">Priority Queue</h3>
            <p className="text-[11px] font-semibold text-slate-400">Requires immediate attention</p>
          </div>
        </div>
        <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">
          3 Pending
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1 overflow-y-auto">
        {queue.map((item, idx) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-3 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col gap-3 relative overflow-hidden group cursor-pointer hover:border-red-200 transition-colors"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
            
            <div className="flex gap-3">
              <img src={item.img} alt="" className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <div className="text-sm font-bold text-primary truncate pr-2">{item.category}</div>
                  <div className="text-xs font-black text-red-600 shrink-0">{item.score}</div>
                </div>
                <div className="text-[10px] text-slate-400 mb-2">{item.id} • {item.dept}</div>
                <div className="flex items-center justify-between">
                  <div className={cn(
                    "px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border",
                    item.severity === "Critical" ? "bg-red-50 text-red-700 border-red-100" : "bg-orange-50 text-orange-700 border-orange-100"
                  )}>
                    {item.severity}
                  </div>
                  <div className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                    <Clock size={10} /> {item.time}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Hidden Action - visible on hover */}
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold shadow-sm hover:bg-primary-hover active:scale-95 transition-all">
                Assign
              </button>
              <button className="px-3 py-1.5 bg-white text-primary border border-border rounded-lg text-xs font-semibold shadow-sm hover:bg-slate-50 active:scale-95 transition-all">
                View
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="p-3 border-t border-border bg-slate-50/50 flex justify-center mt-auto">
        <button className="text-xs font-bold text-slate-500 hover:text-primary transition-colors flex items-center gap-1">
          Open Queue <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
