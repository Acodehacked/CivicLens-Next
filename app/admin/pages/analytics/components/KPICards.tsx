"use client";

import { motion } from "framer-motion";
import { FileText, AlertCircle, CheckCircle2, AlertTriangle, Sparkles, CopyCheck } from "lucide-react";
import type { OverviewStats, TrendComparison } from "@/lib/data/analytics";

function TrendBadge({ trend }: { trend: TrendComparison }) {
  if (trend.pctChange === null) {
    return <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">no prior data</span>;
  }
  const isUp = trend.pctChange >= 0;
  return (
    <span className="text-[11px] font-bold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded-full border border-[#BFDBFE]">
      {isUp ? "+" : ""}{trend.pctChange.toFixed(0)}%
    </span>
  );
}

export default function KPICards({ stats, trend }: { stats: OverviewStats; trend: TrendComparison }) {
  const cards = [
    { id: "total", title: "Total Reports", value: stats.total.toLocaleString(), icon: FileText, showTrend: true },
    { id: "open", title: "Open Issues", value: stats.open.toLocaleString(), icon: AlertCircle, showTrend: false },
    { id: "resolved", title: "Resolved", value: stats.resolved.toLocaleString(), icon: CheckCircle2, showTrend: false },
    { id: "critical", title: "Critical Issues", value: stats.critical.toLocaleString(), icon: AlertTriangle, showTrend: false },
    { id: "confidence", title: "Avg Detection Confidence", value: `${Math.round(stats.avgConfidence * 100)}%`, icon: Sparkles, showTrend: false },
    { id: "merged", title: "Duplicates Corroborated", value: stats.mergedCount.toLocaleString(), icon: CopyCheck, showTrend: false },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: index * 0.05 }}
          className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group cursor-default"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center group-hover:scale-105 transition-transform">
                <item.icon size={16} />
              </div>
              <span className="text-xs font-semibold text-slate-500 truncate">{item.title}</span>
            </div>
          </div>

          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{item.value}</span>
            {item.showTrend && <TrendBadge trend={trend} />}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
