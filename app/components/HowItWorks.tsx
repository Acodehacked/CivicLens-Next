"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Camera, Cpu, ArrowRightLeft, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: Camera,
    title: "1. Citizen Report",
    description: "A user snaps a photo via our mobile web app. Location data is instantly attached with zero friction.",
  },
  {
    icon: Cpu,
    title: "2. AI Analysis",
    description: "The image is parsed in milliseconds for issue type, severity, and checked against existing reports.",
  },
  {
    icon: ArrowRightLeft,
    title: "3. Prioritization",
    description: "Reports are automatically triaged, merged if duplicates exist, and assigned a priority score.",
  },
  {
    icon: CheckCircle2,
    title: "4. Resolution",
    description: "Work orders are instantly routed to the correct department queue for rapid dispatch.",
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" ref={ref} className="w-full py-24 md:py-32 px-6 bg-surface-muted border-y border-border/50 overflow-hidden">
      <div className="max-w-[var(--container-max)] mx-auto relative">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-primary tracking-tight mb-6">
            How CivicLens Works
          </h2>
          <p className="text-lg md:text-xl text-on-surface-muted leading-relaxed">
            A seamless, automated workflow from the moment a citizen spots an issue to the moment your team resolves it.
          </p>
        </div>

        {/* Timeline Desktop Line */}
        <div className="hidden lg:block absolute top-[280px] left-0 w-full h-0.5 bg-border-light z-0">
          <motion.div 
            className="h-full bg-accent"
            initial={{ width: "0%" }}
            animate={isInView ? { width: "100%" } : { width: "0%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative z-10">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="flex flex-col items-center lg:items-start text-center lg:text-left bg-white lg:bg-transparent p-8 lg:p-0 rounded-2xl border border-border/50 lg:border-none shadow-sm lg:shadow-none relative"
            >
              {/* Connector Node */}
              <div className="hidden lg:flex w-6 h-6 rounded-full bg-surface-muted border-4 border-white shadow-sm items-center justify-center absolute -top-[52px] left-8 z-10">
                <div className="w-2 h-2 rounded-full bg-accent" />
              </div>

              <div className="w-16 h-16 rounded-2xl bg-white border border-border/50 shadow-sm flex items-center justify-center mb-6 text-primary">
                <step.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">{step.title}</h3>
              <p className="text-base text-on-surface-muted leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
