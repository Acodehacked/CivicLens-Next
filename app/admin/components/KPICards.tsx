"use client";

import { motion } from "framer-motion";
import { AlertOctagon, CheckCircle2, Clock, Activity, FileWarning, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const kpiData = [
  {
    id: 1,
    label: "Total Reports",
    value: "2,543",
    change: "+12%",
    trend: "up",
    icon: FileWarning,
    color: "blue"
  },
  {
    id: 2,
    label: "Resolved Today",
    value: "184",
    change: "+5%",
    trend: "up",
    icon: CheckCircle2,
    color: "green"
  },
  {
    id: 3,
    label: "Critical Issues",
    value: "42",
    change: "-3%",
    trend: "down",
    icon: AlertOctagon,
    color: "red"
  },
  {
    id: 4,
    label: "Avg. Resolution Time",
    value: "3.2 days",
    change: "-1.5 days",
    trend: "down",
    icon: Clock,
    color: "orange"
  },
  {
    id: 5,
    label: "AI Detection Accuracy",
    value: "94.2%",
    change: "+2.1%",
    trend: "up",
    icon: Sparkles,
    color: "indigo"
  },
  {
    id: 6,
    label: "Citizen Satisfaction",
    value: "4.8/5",
    change: "+0.2",
    trend: "up",
    icon: Activity,
    color: "purple"
  }
];

const colorMap: Record<string, { bg: string, text: string, border: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
  green: { bg: "bg-green-50", text: "text-green-600", border: "border-green-100" },
  red: { bg: "bg-red-50", text: "text-red-600", border: "border-red-100" },
  orange: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-100" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100" },
  purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100" },
};

export default function KPICards() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
      {kpiData.map((kpi, idx) => {
        const colors = colorMap[kpi.color];
        return (
          <motion.div
            key={kpi.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            className="bg-white rounded-2xl border border-border p-4 shadow-sm hover:shadow-md transition-shadow cursor-default group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-105", colors.bg, colors.text, colors.border)}>
                <kpi.icon size={20} />
              </div>
              <div className={cn(
                "px-2 py-0.5 rounded text-[10px] font-bold border",
                kpi.trend === "up" && kpi.color !== "red" ? "bg-green-50 text-green-700 border-green-100" : 
                kpi.trend === "down" && kpi.color === "red" ? "bg-green-50 text-green-700 border-green-100" :
                kpi.trend === "down" && kpi.color === "orange" ? "bg-green-50 text-green-700 border-green-100" :
                "bg-red-50 text-red-700 border-red-100"
              )}>
                {kpi.change}
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-primary tracking-tight mb-0.5">{kpi.value}</div>
              <div className="text-xs font-semibold text-slate-500">{kpi.label}</div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
