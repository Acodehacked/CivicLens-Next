"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: "2M+", label: "Reports Processed" },
  { value: "99.8%", label: "AI Accuracy" },
  { value: "3x", label: "Faster Resolution" },
  { value: "50+", label: "Cities Served" },
];

export default function Statistics() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="w-full py-20 bg-primary text-white overflow-hidden">
      <div className="max-w-[var(--container-max)] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x divide-white/10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="flex flex-col items-center text-center px-4"
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60">
                {stat.value}
              </div>
              <div className="text-sm md:text-base font-medium text-white/60 uppercase tracking-widest">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
