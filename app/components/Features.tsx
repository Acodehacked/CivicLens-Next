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
    gradient: "from-blue-500/10 to-transparent",
  },
  {
    icon: TrendingUp,
    title: "Severity Analysis",
    description: "Assess risk levels dynamically based on object size, location context, and local weather data.",
    colSpan: 1,
    gradient: "from-emerald-500/10 to-transparent",
  },
  {
    icon: Filter,
    title: "Duplicate Detection",
    description: "Smart clustering groups multiple reports of the same incident, preventing redundant dispatch.",
    colSpan: 1,
    gradient: "from-purple-500/10 to-transparent",
  },
  {
    icon: BarChart3,
    title: "Priority Scoring",
    description: "Intelligent triaging assigns a 1-100 priority score to every incident, optimizing your routing.",
    colSpan: 2,
    gradient: "from-orange-500/10 to-transparent",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as const },
  }),
};

export default function Features() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" ref={ref} className="w-full py-24 md:py-32 px-6 bg-background">
      <div className="max-w-[var(--container-max)] mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-sm font-semibold text-accent uppercase tracking-widest mb-4">
            Core Capabilities
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-primary tracking-tight mb-6">
            Intelligence at the Edge of Infrastructure
          </h2>
          <p className="text-lg md:text-xl text-on-surface-muted leading-relaxed">
            CivicLens transforms municipal incident reporting. Identify, prioritize, and resolve infrastructure issues faster than ever before.
          </p>
        </div>

        {/* Premium Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(320px,_auto)]">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              custom={i}
              className={cn(
                "group relative overflow-hidden rounded-3xl bg-white border border-border/60 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col p-8 md:p-10",
                feat.colSpan === 2 ? "md:col-span-2" : "md:col-span-1"
              )}
            >
              {/* Subtle background gradient */}
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50 transition-opacity group-hover:opacity-100", feat.gradient)} />
              
              <div className="relative z-10 flex-1">
                <div className="w-12 h-12 rounded-xl bg-white border border-border/50 shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <feat.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">
                  {feat.title}
                </h3>
                <p className="text-lg text-on-surface-muted leading-relaxed max-w-md">
                  {feat.description}
                </p>
              </div>

              {/* Abstract decorative element bottom right */}
              <div className="absolute -bottom-8 -right-8 opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none">
                <feat.icon className="w-48 h-48 text-primary" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
