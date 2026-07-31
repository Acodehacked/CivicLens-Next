"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Eye, TrendingUp, Filter, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const features = [
  {
    icon: Eye,
    title: "Computer Vision Detection",
    description: "Automatically identify issue types (potholes, graffiti, lights) from photos with 98% accuracy.",
    colSpan: 2,
    iconBg: "bg-gradient-to-br from-blue-500/15 to-blue-600/5",
    iconColor: "text-blue-600",
    accentGlow: "group-hover:shadow-[0_20px_60px_rgba(37,99,235,0.12)]",
    badge: "Vision AI",
    badgeColor: "bg-blue-50 text-blue-600 border-blue-100",
    cardGrad: "from-blue-500/5 via-transparent to-transparent",
  },
  {
    icon: TrendingUp,
    title: "Severity Analysis",
    description: "Assess risk levels dynamically based on object size, location context, and local weather data.",
    colSpan: 1,
    iconBg: "bg-gradient-to-br from-blue-500/15 to-blue-600/5",
    iconColor: "text-blue-600",
    accentGlow: "group-hover:shadow-[0_20px_60px_rgba(37,99,235,0.12)]",
    badge: "Safety AI",
    badgeColor: "bg-blue-50 text-blue-600 border-blue-100",
    cardGrad: "from-blue-500/5 via-transparent to-transparent",
  },
  {
    icon: Filter,
    title: "Duplicate Detection",
    description: "AI detects potentially related reports and flags them for administrator verification before further action is taken.",
    colSpan: 1,
    iconBg: "bg-gradient-to-br from-violet-500/15 to-violet-600/5",
    iconColor: "text-violet-600",
    accentGlow: "group-hover:shadow-[0_20px_60px_rgba(139,92,246,0.12)]",
    badge: "Dedup",
    badgeColor: "bg-violet-50 text-violet-600 border-violet-100",
    cardGrad: "from-violet-500/5 via-transparent to-transparent",
  },
  {
    icon: BarChart3,
    title: "Priority Scoring",
    description: "Intelligent triaging assigns a 1-100 priority score to every incident, optimizing your routing.",
    colSpan: 2,
    iconBg: "bg-gradient-to-br from-amber-500/15 to-orange-500/5",
    iconColor: "text-amber-600",
    accentGlow: "group-hover:shadow-[0_20px_60px_rgba(245,158,11,0.12)]",
    badge: "Triage",
    badgeColor: "bg-amber-50 text-amber-600 border-amber-100",
    cardGrad: "from-amber-500/5 via-transparent to-transparent",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.65, ease: [0.21, 0.47, 0.32, 0.98] as const },
  }),
};

export default function Features() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" ref={ref} className="w-full py-24 md:py-32 px-6 bg-[#F8FAFC]">
      <div className="max-w-[var(--container-max)] mx-auto">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span
            className="inline-block text-xs font-bold text-[#2563EB] uppercase tracking-widest mb-4 px-3 py-1.5 bg-[#EFF6FF] rounded-full border border-[#2563EB]/20"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Core Capabilities
          </span>
          <h2
            className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Intelligence at the Edge of Infrastructure
          </h2>
          <p className="text-lg md:text-xl text-slate-500 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
            CivicLens transforms municipal incident reporting. Identify, prioritize, and resolve infrastructure issues faster than ever before.
          </p>
        </div>

        {/* Premium Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,_auto)]">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={i}
              className={cn(
                "group relative overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-sm transition-all duration-500 flex flex-col p-8 md:p-10 cursor-default",
                feat.colSpan === 2 ? "md:col-span-2" : "md:col-span-1",
                feat.accentGlow,
                "hover:-translate-y-1"
              )}
              style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.04)" }}
            >
              {/* Subtle background gradient on hover */}
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", feat.cardGrad)} />

              <div className="relative z-10 flex-1">
                <div className="flex items-start justify-between mb-8">
                  {/* Duotone icon container */}
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300",
                    feat.iconBg
                  )}>
                    <feat.icon className={cn("w-7 h-7", feat.iconColor)} />
                  </div>
                  {/* Capability badge */}
                  <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border", feat.badgeColor)} style={{ fontFamily: "var(--font-body)" }}>
                    {feat.badge}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                  {feat.title}
                </h3>
                <p className="text-base text-slate-500 leading-relaxed max-w-md" style={{ fontFamily: "var(--font-body)" }}>
                  {feat.description}
                </p>
              </div>

              {/* Large faint decorative icon */}
              <div className="absolute -bottom-6 -right-6 opacity-[0.04] group-hover:opacity-[0.07] transition-opacity duration-500 pointer-events-none">
                <feat.icon className="w-40 h-40 text-slate-900" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
