"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Camera, Cpu, ArrowRightLeft, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: Camera,
    title: "Snap",
    subtitle: "1. Citizen Report",
    description: "A user snaps a photo via our mobile web app. Location data is instantly attached with zero friction.",
    iconBg: "bg-gradient-to-br from-[#3B82F6] to-[#2563EB]",
    connector: "from-[#2563EB] to-[#1D4ED8]",
    number: "01",
  },
  {
    icon: Cpu,
    title: "Analyze",
    subtitle: "2. AI Analysis",
    description: "The image is parsed in milliseconds for issue type, severity, and checked against existing reports.",
    iconBg: "bg-gradient-to-br from-[#2563EB] to-[#1D4ED8]",
    connector: "from-[#1D4ED8] to-[#1E40AF]",
    number: "02",
  },
  {
    icon: ArrowRightLeft,
    title: "Merge",
    subtitle: "3. Prioritization",
    description: "Reports are automatically triaged, merged if duplicates exist, and assigned a priority score.",
    iconBg: "bg-gradient-to-br from-[#1E40AF] to-[#3B82F6]",
    connector: "from-[#3B82F6] to-[#2563EB]",
    number: "03",
  },
  {
    icon: CheckCircle2,
    title: "Resolve",
    subtitle: "4. Resolution",
    description: "Work orders are instantly routed to the correct department queue for rapid dispatch.",
    iconBg: "bg-gradient-to-br from-[#2563EB] to-[#1D4ED8]",
    connector: null,
    number: "04",
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" ref={ref} className="w-full py-24 md:py-32 px-6 bg-white border-y border-slate-100 overflow-hidden">
      <div className="max-w-[var(--container-max)] mx-auto relative">

        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span
            className="inline-block text-xs font-bold text-[#2563EB] uppercase tracking-widest mb-4 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100"
            style={{ fontFamily: "var(--font-body)" }}
          >
            How It Works
          </span>
          <h2
            className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            How CivicLens Works
          </h2>
          <p className="text-lg md:text-xl text-slate-500 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
            A seamless, automated workflow from the moment a citizen spots an issue to the moment your team resolves it.
          </p>
        </div>

        {/* Animated connector line (desktop) */}
        <div className="hidden lg:block absolute top-[336px] left-[calc(50%-540px)] w-[1080px] h-0.5 bg-slate-100 z-0 overflow-hidden rounded-full">
          <motion.div
            className="h-full bg-gradient-to-r from-[#60A5FA] via-[#2563EB] via-[#1E40AF] to-[#3B82F6]"
            initial={{ width: "0%" }}
            animate={isInView ? { width: "100%" } : { width: "0%" }}
            transition={{ duration: 1.8, ease: "easeInOut", delay: 0.3 }}
          />
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative z-10">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
              transition={{ delay: 0.2 + i * 0.18, duration: 0.65 }}
              className="flex flex-col items-center lg:items-start text-center lg:text-left bg-[#F8FAFC] rounded-3xl border border-slate-100 p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative"
            >
              {/* Connector node on desktop */}
              <div className="hidden lg:flex w-7 h-7 rounded-full bg-white border-4 border-slate-100 shadow-md items-center justify-center absolute -top-[55px] left-8 z-20">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${step.iconBg.replace("bg-gradient-to-br ", "")}`} />
              </div>

              {/* Step number */}
              <div
                className="absolute top-6 right-6 text-[11px] font-black text-slate-200 tracking-widest"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {step.number}
              </div>

              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl ${step.iconBg} flex items-center justify-center mb-6 shadow-lg`}>
                <step.icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-body)" }}>
                {step.subtitle}
              </p>
              <h3
                className="text-2xl font-extrabold text-slate-900 mb-3"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {step.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
