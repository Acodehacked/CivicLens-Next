"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BrainCircuit, Check, ScanSearch, Activity } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const capabilities = [
  {
    icon: ScanSearch,
    title: "Intelligent Image Analysis",
    description: "Our neural networks instantly classify infrastructure anomalies, filtering out noise and non-actionable reports.",
  },
  {
    icon: BrainCircuit,
    title: "Smart Prioritization Engine",
    description: "Assigns dynamic urgency scores based on risk factors, asset types, and historical data patterns.",
  },
  {
    icon: Activity,
    title: "Real-time Monitoring",
    description: "Track incident density across city districts with predictive heatmaps to dispatch crews proactively.",
  }
];

export default function AICapabilities() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="w-full py-24 md:py-32 px-6 bg-background overflow-hidden">
      <div className="max-w-[var(--container-max)] mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Content */}
          <div className="flex flex-col gap-8">
            <div>
              <p className="text-sm font-semibold text-accent uppercase tracking-widest mb-4">
                Powered by CivicAI
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-primary tracking-tight mb-6">
                Not just data collection. Data comprehension.
              </h2>
              <p className="text-lg md:text-xl text-on-surface-muted leading-relaxed mb-8">
                CivicLens doesn't just log tickets. It understands them. Our purpose-built AI pipeline does the heavy lifting of triaging, so your team can focus on fixing.
              </p>
            </div>

            <div className="flex flex-col gap-8">
              {capabilities.map((cap, i) => (
                <motion.div 
                  key={cap.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="flex gap-4"
                >
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-accent-light text-accent flex items-center justify-center">
                    <cap.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-primary mb-2">{cap.title}</h4>
                    <p className="text-on-surface-muted leading-relaxed">{cap.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: UI Showcase */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative lg:h-[600px] w-full rounded-3xl bg-surface-muted border border-border/50 p-6 shadow-2xl flex items-center justify-center"
          >
            {/* Abstract UI representation of AI scanning */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/[0.02] rounded-3xl pointer-events-none" />
            
            <div className="w-full max-w-sm flex flex-col gap-4 relative z-10">
              {/* Scan Card */}
              <div className="bg-white p-4 rounded-2xl shadow-md border border-border/60 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-purple-500" />
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-semibold text-on-surface-muted uppercase">Analysis Complete</span>
                  <Check className="w-4 h-4 text-success" />
                </div>
                <div className="h-32 bg-border-light rounded-xl mb-4 relative overflow-hidden">
                   {/* Scanning laser effect */}
                   <div className="absolute top-0 left-0 w-full h-0.5 bg-accent shadow-[0_0_8px_2px_rgba(37,99,235,0.5)] animate-[float_3s_ease-in-out_infinite]" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Confidence Score</span>
                    <span className="text-sm font-bold text-accent">99.2%</span>
                  </div>
                  <div className="w-full h-2 bg-border-light rounded-full overflow-hidden">
                    <div className="h-full bg-accent w-[99.2%]" />
                  </div>
                </div>
              </div>

              {/* Data tags */}
              <div className="flex flex-wrap gap-2">
                {["Pothole", "High Severity", "Arterial Road", "Merged: 3"].map((tag, i) => (
                  <span key={i} className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-lg border",
                    i === 1 ? "bg-error-bg text-error border-error/20" : "bg-white text-on-surface-muted border-border"
                  )}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
