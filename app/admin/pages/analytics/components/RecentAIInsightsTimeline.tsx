"use client";

import { Sparkles, TrendingUp, AlertTriangle, CopyCheck, CloudRain } from "lucide-react";

const timelineEvents = [
  {
    id: 1,
    time: "10 mins ago",
    title: "Garbage complaints increased by 18%",
    desc: "AI detected localized volume surge in Sector 4. Recommended extra sanitation crew dispatch.",
    icon: TrendingUp,
    iconBg: "bg-amber-50 text-amber-600 border-amber-200",
  },
  {
    id: 2,
    time: "35 mins ago",
    title: "Flood risk predicted in Ward 4",
    desc: "Weather integration model projects +30% waterlogging risk tomorrow. Pre-deploying drainage teams.",
    icon: CloudRain,
    iconBg: "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]",
  },
  {
    id: 3,
    time: "1 hour ago",
    title: "Road Maintenance workload exceeded 90%",
    desc: "Active queue reached 101 tickets. Auto-prioritizing arterial road defects over minor street patches.",
    icon: AlertTriangle,
    iconBg: "bg-orange-50 text-orange-600 border-orange-200",
  },
  {
    id: 4,
    time: "2 hours ago",
    title: "14 duplicate reports merged successfully",
    desc: "YOLOv11 & embedding similarity identified 14 citizen photos of MG Road pothole cluster as 1 ticket.",
    icon: CopyCheck,
    iconBg: "bg-blue-50 text-[#2563EB] border-blue-200",
  },
];

export default function RecentAIInsightsTimeline() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col h-full" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center border border-[#BFDBFE]">
          <Sparkles size={14} />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900" style={{ fontFamily: "var(--font-heading)" }}>
            Recent AI Insights
          </h2>
          <p className="text-xs text-slate-500" style={{ fontFamily: "var(--font-body)" }}>
            Automated intelligence logs and predictive alerts
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
        {timelineEvents.map((ev) => (
          <div key={ev.id} className="relative group">
            {/* Timeline Node Dot */}
            <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full border flex items-center justify-center shadow-xs ${ev.iconBg}`}>
              <ev.icon size={10} />
            </div>

            {/* Event Details */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#2563EB] transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                  {ev.title}
                </h4>
                <span className="text-[10px] text-slate-400 font-medium shrink-0">{ev.time}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                {ev.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
