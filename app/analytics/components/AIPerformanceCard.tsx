"use client";

import { BrainCircuit, Cpu, Sparkles, CheckCircle2, Zap, Image as ImageIcon } from "lucide-react";

const aiMetrics = [
  { label: "YOLOv11 Detection Accuracy", value: "98.6%", icon: Cpu, desc: "Road damage & defect classification" },
  { label: "Gemini Reasoning Accuracy", value: "99.4%", icon: Sparkles, desc: "Contextual safety risk evaluation" },
  { label: "Average AI Confidence", value: "99.2%", icon: CheckCircle2, desc: "Multi-model confidence threshold" },
  { label: "Duplicate Merging Precision", value: "97.8%", icon: BrainCircuit, desc: "Embedding & geolocation similarity" },
  { label: "Average Processing Time", value: "140ms", icon: Zap, desc: "End-to-end inference speed" },
  { label: "Images Processed Today", value: "1,280", icon: ImageIcon, desc: "Photos ingested and prioritized" },
];

export default function AIPerformanceCard() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col h-full" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
            <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider">AI Core V2.0</span>
          </div>
          <h2 className="text-base font-bold text-slate-900" style={{ fontFamily: "var(--font-heading)" }}>
            AI Pipeline Performance
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
        {aiMetrics.map((item) => (
          <div
            key={item.label}
            className="p-3.5 rounded-xl bg-[#EFF6FF]/60 border border-[#BFDBFE]/60 flex items-start gap-3 hover:bg-[#EFF6FF] transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-white border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center shrink-0 shadow-sm">
              <item.icon size={16} />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-slate-500 block truncate">{item.label}</span>
              <span className="text-lg font-extrabold text-[#2563EB] block" style={{ fontFamily: "var(--font-heading)" }}>
                {item.value}
              </span>
              <span className="text-[10px] text-slate-400 block truncate mt-0.5">{item.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
