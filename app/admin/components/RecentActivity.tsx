"use client";

import { Circle, User, Building2, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const activities = [
  { id: 1, type: "citizen", text: "Jane D. reported a Pothole routed to Road Maintenance Department", time: "2m ago", icon: User, color: "blue" },
  { id: 2, type: "ai", text: "AI detected 12 duplicate reports for 'Fallen Tree' (Parks & Tree Maintenance)", time: "15m ago", icon: BrainCircuit, color: "purple" },
  { id: 3, type: "dept", text: "Sanitation & Waste Management Department resolved REP-089", time: "1h ago", icon: Building2, color: "green" },
  { id: 4, type: "citizen", text: "Mark S. reported Waterlogging in Downtown", time: "2h ago", icon: User, color: "blue" },
  { id: 5, type: "ai", text: "AI routed REP-108 (Flood) to Disaster Management & Emergency Response Department", time: "3h ago", icon: BrainCircuit, color: "red" },
];

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden p-5 flex flex-col h-full">
      <div className="mb-4">
        <h3 className="font-bold text-primary">Recent Activity</h3>
        <p className="text-[11px] font-semibold text-slate-400">System-wide event log</p>
      </div>

      <div className="relative flex-1">
        {/* Vertical Line */}
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-slate-200" />
        
        <div className="flex flex-col gap-4">
          {activities.map((act) => (
            <div key={act.id} className="flex gap-3 relative z-10">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm ring-1 ring-slate-100",
                act.color === "blue" ? "bg-blue-50 text-blue-600" :
                act.color === "purple" ? "bg-purple-50 text-purple-600" :
                act.color === "green" ? "bg-green-50 text-green-600" :
                "bg-red-50 text-red-600"
              )}>
                <act.icon size={12} />
              </div>
              <div className="pt-1 min-w-0">
                <p className="text-xs font-semibold text-primary leading-tight pr-2">{act.text}</p>
                <span className="text-[10px] font-medium text-slate-400">{act.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <button className="w-full mt-4 py-2 bg-slate-50 text-xs font-bold text-slate-600 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
        View Full Log
      </button>
    </div>
  );
}
