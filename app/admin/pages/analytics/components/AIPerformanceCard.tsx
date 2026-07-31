"use client";

import { BrainCircuit, Cpu, ShieldAlert, CopyCheck, Activity, Image as ImageIcon } from "lucide-react";
import type { OverviewStats } from "@/lib/data/analytics";

export default function AIPerformanceCard({
  stats,
  totalReportsSubmitted,
}: {
  stats: OverviewStats;
  totalReportsSubmitted: number;
}) {
  const metrics = [
    { label: "Avg Detection Confidence", value: `${Math.round(stats.avgConfidence * 100)}%`, icon: Cpu, desc: "Mean YOLO confidence across all complaints" },
    { label: "Avg Dedup Similarity", value: `${Math.round(stats.avgSimilarity * 100)}%`, icon: BrainCircuit, desc: "CLIP embedding similarity for corroborated reports" },
    { label: "Avg Priority Score", value: stats.avgPriority.toFixed(1), icon: Activity, desc: "Across all complaints in scope" },
    { label: "Safety Risk Flagged", value: stats.safetyRiskCount.toLocaleString(), icon: ShieldAlert, desc: "Complaints flagged as an immediate hazard" },
    { label: "Duplicates Corroborated", value: stats.mergedCount.toLocaleString(), icon: CopyCheck, desc: "Complaints confirmed by 2+ citizen reports" },
    { label: "Images Processed", value: totalReportsSubmitted.toLocaleString(), icon: ImageIcon, desc: "Total photos submitted through the pipeline" },
  ];

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col h-full" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
            <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider">Detection Pipeline</span>
          </div>
          <h2 className="text-base font-bold text-slate-900">Real Pipeline Metrics</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
        {metrics.map((item) => (
          <div
            key={item.label}
            className="p-3.5 rounded-xl bg-[#EFF6FF]/60 border border-[#BFDBFE]/60 flex items-start gap-3 hover:bg-[#EFF6FF] transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-white border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center shrink-0 shadow-sm">
              <item.icon size={16} />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-slate-500 block truncate">{item.label}</span>
              <span className="text-lg font-extrabold text-[#2563EB] block">{item.value}</span>
              <span className="text-[10px] text-slate-400 block truncate mt-0.5">{item.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
