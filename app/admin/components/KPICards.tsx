"use client";

import { motion } from "framer-motion";
import { AlertOctagon, CheckCircle2, Clock, Activity, FileWarning, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type DashboardStats = {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  critical: number;
  avgPriority: number;
};

const colorMap: Record<string, { bg: string, text: string, border: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
  green: { bg: "bg-green-50", text: "text-green-600", border: "border-green-100" },
  red: { bg: "bg-red-50", text: "text-red-600", border: "border-red-100" },
  orange: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-100" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100" },
  purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100" },
};

export default function KPICards({ stats }: { stats: DashboardStats }) {
  const kpiData = [
    { id: 1, label: "Total Reports", value: stats.total.toLocaleString(), icon: FileWarning, color: "blue" },
    { id: 2, label: "Open Issues", value: stats.open.toLocaleString(), icon: Clock, color: "orange" },
    { id: 3, label: "In Progress", value: stats.inProgress.toLocaleString(), icon: Loader2, color: "indigo" },
    { id: 4, label: "Resolved", value: stats.resolved.toLocaleString(), icon: CheckCircle2, color: "green" },
    { id: 5, label: "Critical Severity", value: stats.critical.toLocaleString(), icon: AlertOctagon, color: "red" },
    { id: 6, label: "Avg Priority Score", value: stats.avgPriority.toFixed(1), icon: Activity, color: "purple" },
  ];

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
