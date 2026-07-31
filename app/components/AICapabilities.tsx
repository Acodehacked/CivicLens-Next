"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BrainCircuit, Check, ScanSearch, Activity, MapPin, ArrowRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const capabilities = [
  {
    icon: ScanSearch,
    title: "Intelligent Image Analysis",
    description: "Our neural networks instantly classify infrastructure anomalies, filtering out noise and non-actionable reports.",
    iconBg: "bg-gradient-to-br from-blue-500/15 to-blue-600/5",
    iconColor: "text-blue-600",
  },
  {
    icon: BrainCircuit,
    title: "Smart Prioritization Engine",
    description: "Assigns dynamic urgency scores based on risk factors, asset types, and historical data patterns.",
    iconBg: "bg-gradient-to-br from-blue-600/15 to-indigo-600/5",
    iconColor: "text-[#2563EB]",
  },
  {
    icon: Activity,
    title: "Real-time Monitoring",
    description: "Track incident density across city districts with predictive heatmaps to dispatch crews proactively.",
    iconBg: "bg-gradient-to-br from-blue-400/15 to-blue-500/5",
    iconColor: "text-[#2563EB]",
  },
];

/* ── Finished AI Data Panel ── */
function AIDataPanel() {
  return (
    <div className="relative rounded-3xl bg-[#F8FAFC] border border-slate-200/80 p-5 shadow-xl" style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.07)" }}>
      {/* Glass header */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl p-4 mb-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#60A5FA] to-[#2563EB] flex items-center justify-center text-white font-bold">
            <ScanSearch className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] font-extrabold text-slate-900">CivicAI Scanner</div>
            <div className="text-[9px] font-semibold text-slate-400">Analysis Complete</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#EFF6FF] rounded-full border border-[#2563EB]/20">
          <Check className="w-3 h-3 text-[#2563EB]" />
          <span className="text-[9px] font-bold text-[#2563EB]">Processed</span>
        </div>
      </div>

      {/* Real photo with AI bounding box */}
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 border border-slate-200/70 shadow-sm">
        <img
          src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80"
          alt="Pothole AI Detection"
          className="w-full h-full object-cover"
        />

        {/* AI bounding box overlay */}
        <div className="absolute top-[35%] left-[25%] w-[50%] h-[38%] border-2 border-[#2563EB] rounded-2xl bg-blue-500/15 shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center">
          {/* Label */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex justify-center whitespace-nowrap">
            <span className="text-[9px] font-black text-white bg-[#2563EB] px-2.5 py-0.5 rounded-full shadow-md">Pothole · 99.2%</span>
          </div>
          {/* Corner handles */}
          <div className="w-2.5 h-2.5 border-t-2 border-l-2 border-white absolute top-1 left-1" />
          <div className="w-2.5 h-2.5 border-t-2 border-r-2 border-white absolute top-1 right-1" />
          <div className="w-2.5 h-2.5 border-b-2 border-l-2 border-white absolute bottom-1 left-1" />
          <div className="w-2.5 h-2.5 border-b-2 border-r-2 border-white absolute bottom-1 right-1" />
        </div>

        {/* Location pin overlay */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/60 shadow-sm">
          <MapPin className="w-3 h-3 text-[#2563EB]" />
          <span className="text-[9px] font-bold text-slate-800">MG Road, Zone 4</span>
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Confidence */}
        <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-slate-400">Confidence</span>
            <span className="text-[11px] font-black text-[#2563EB]">99.2%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#2563EB] rounded-full" style={{ width: "99.2%" }} />
          </div>
        </div>
        {/* Severity */}
        <div className="bg-white rounded-2xl p-3 border border-red-100 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-slate-400">Severity</span>
            <span className="text-[11px] font-black text-red-500">High</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 rounded-full" style={{ width: "88%" }} />
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { label: "Pothole", style: "bg-slate-100 text-slate-700 border-slate-200" },
          { label: "High Severity", style: "bg-red-50 text-red-600 border-red-100" },
          { label: "Arterial Road", style: "bg-blue-50 text-blue-600 border-blue-100" },
          { label: "Merged: ×3 reports", style: "bg-purple-50 text-purple-600 border-purple-100" },
        ].map((tag) => (
          <span
            key={tag.label}
            className={cn("px-2.5 py-1 text-[10px] font-bold rounded-full border", tag.style)}
          >
            {tag.label}
          </span>
        ))}
      </div>

      {/* Department routing card */}
      <div className="bg-[#EFF6FF] border border-[#2563EB]/15 rounded-2xl p-3.5 flex items-center justify-between shadow-sm">
        <div>
          <div className="text-[9px] font-extrabold text-slate-400 mb-0.5 uppercase tracking-widest">Routed to</div>
          <div className="text-xs sm:text-[13px] font-black text-[#2563EB]">Road Maintenance Department</div>
          <div className="text-[9px] text-slate-500 font-semibold mt-0.5">Priority Score: <strong className="text-slate-900">94 / 100</strong></div>
        </div>
        <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center shadow-md shrink-0">
          <ArrowRight className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function AICapabilities() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="w-full py-24 md:py-32 px-6 bg-[#F8FAFC] overflow-hidden">
      <div className="max-w-[var(--container-max)] mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: Content */}
          <div className="flex flex-col gap-8">
            <div>
              <span
                className="inline-block text-xs font-bold text-[#2563EB] uppercase tracking-widest mb-4 px-3 py-1.5 bg-[#EFF6FF] rounded-full border border-[#2563EB]/20"
              >
                Computer Vision Pipeline
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary tracking-tight leading-tight">
                Automated triage powered by municipal AI.
              </h2>
            </div>

            <div className="flex flex-col gap-6">
              {capabilities.map((cap, i) => {
                const IconComponent = cap.icon;
                return (
                  <motion.div
                    key={cap.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.15, duration: 0.5 }}
                    className="flex gap-4 p-4 rounded-2xl hover:bg-white transition-colors duration-200 border border-transparent hover:border-slate-200/60"
                  >
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", cap.iconBg)}>
                      <IconComponent className={cn("w-6 h-6", cap.iconColor)} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-primary mb-1">{cap.title}</h3>
                      <p className="text-sm text-on-surface-muted leading-relaxed">{cap.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right: AI Data Panel Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <AIDataPanel />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
