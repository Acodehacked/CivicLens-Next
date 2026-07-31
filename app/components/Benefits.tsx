"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const benefitsList = [
  "Reduce average incident response time by up to 45%",
  "Eliminate duplicate dispatches for the same issue",
  "Provide citizens with real-time status updates",
  "Generate automated compliance reports instantly",
  "Optimize crew routing based on geographic clustering",
];

export default function Benefits() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="w-full py-24 md:py-32 px-6 bg-white border-b border-border/50">
      <div className="max-w-[var(--container-max)] mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left: Product UI Showcase */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-2 lg:order-1 relative rounded-3xl bg-surface-muted border border-border/50 p-4 md:p-8 shadow-xl"
          >
            {/* Minimalist Dashboard representation */}
            <div className="w-full h-[400px] bg-white rounded-xl shadow-sm border border-border/60 overflow-hidden flex flex-col">
              {/* Header */}
              <div className="h-12 border-b border-border/50 flex items-center px-4 justify-between bg-surface-muted/50">
                <div className="flex gap-2">
                  <div className="w-20 h-4 bg-border rounded-full" />
                  <div className="w-16 h-4 bg-border-light rounded-full" />
                </div>
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <div className="w-4 h-4 bg-accent rounded-full" />
                </div>
              </div>
              {/* List View */}
              <div className="flex-1 p-4 flex flex-col gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border/40 hover:bg-surface-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-border-light" />
                      <div className="flex flex-col gap-1.5">
                        <div className="w-32 h-3 bg-border rounded-full" />
                        <div className="w-24 h-2 bg-border-light rounded-full" />
                      </div>
                    </div>
                    <div className={`w-16 h-5 rounded-full ${i === 0 ? 'bg-error-bg text-error' : i === 1 ? 'bg-orange-100 text-orange-600' : 'bg-success-bg text-success'} flex items-center justify-center text-[10px] font-bold`}>
                      {i === 0 ? 'HIGH' : i === 1 ? 'MED' : 'LOW'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <div className="order-1 lg:order-2 flex flex-col gap-8">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary tracking-tight mb-6 leading-tight">
                Empower your public works department.
              </h2>
              <p className="text-lg text-on-surface-muted leading-relaxed">
                By automating the triage process, CivicLens frees up your staff to do what they do best: improving the community. Say goodbye to manual ticket sorting and duplicate reports.
              </p>
            </div>

            <ul className="flex flex-col gap-4">
              {benefitsList.map((benefit, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2 className="w-6 h-6 text-accent shrink-0" />
                  <span className="text-primary font-medium">{benefit}</span>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-4"
            >
              <a href="#" className="inline-flex items-center text-accent font-semibold hover:text-accent-hover transition-colors">
                Read the case study <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
