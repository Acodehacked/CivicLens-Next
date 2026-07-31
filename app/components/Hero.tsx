"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, PlayCircle } from "lucide-react";
import Link from "next/link";

/* ── Animation Variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as const }, // Custom premium ease
  }),
};

export default function Hero() {
  return (
    <section
      className="relative z-10 w-full pt-32 pb-20 md:pt-40 md:pb-32 px-6 flex flex-col justify-center items-center text-center overflow-hidden bg-background"
      aria-label="Hero"
    >
      {/* ── Subtle Background Mesh / Glow ── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[80vw] h-[80vw] max-w-[1200px] max-h-[1200px] rounded-full bg-accent-light opacity-50 blur-[100px]" />
      </div>

      {/* ── Content ── */}
      <div className="max-w-[var(--container-max)] mx-auto w-full flex flex-col items-center relative z-10">
        
        {/* Announcement Badge */}
        {/* <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="inline-flex items-center gap-2 bg-surface border border-border rounded-full px-4 py-1.5 shadow-sm hover:shadow-md transition-shadow cursor-pointer mb-8"
        >
          <Sparkles className="w-4 h-4 text-accent" aria-hidden="true" />
          <span className="text-xs font-semibold text-primary tracking-wide">
            Civic Intelligence Platform v2.0 is live
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-on-surface-muted" />
        </motion.div> */}

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-5xl sm:text-6xl lg:text-[72px] font-bold text-primary max-w-4xl tracking-tight leading-[1.05] mb-6"
        >
          AI-Powered{" "}
          <span className="text-accent bg-clip-text">
            Civic Intelligence
          </span>
          <br className="hidden md:block" /> for Better Cities
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="text-lg md:text-xl text-on-surface-muted max-w-2xl leading-relaxed mb-10"
        >
          CivicLens transforms municipal incident reporting. Identify, prioritize, and resolve infrastructure issues faster than ever before with our advanced computer vision engine.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
        >
          <Link
            href="/report"
            className="w-full sm:w-auto px-8 py-3.5 bg-primary text-white rounded-full text-sm font-semibold tracking-wide shadow-lg shadow-primary/10 hover:bg-primary-hover hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
          >
            Report an Issue
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/map"
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-primary border border-border rounded-full text-sm font-semibold tracking-wide shadow-sm hover:bg-surface-muted hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
          >
            <PlayCircle className="w-4 h-4 text-on-surface-muted" />
            View Community Map
          </Link>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="mt-12 text-sm font-medium text-on-surface-muted flex items-center gap-2"
        >
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-border-light flex items-center justify-center text-[10px] text-on-surface-muted font-bold z-[4-i] relative">
                CITY
              </div>
            ))}
          </div>
          <span className="ml-2">Trusted by 50+ forward-thinking municipalities</span>
        </motion.div>

        {/* ── Dashboard Preview Mockup ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={5}
          className="w-full max-w-5xl mt-20 md:mt-24"
        >
          {/* Mac window styling container */}
          <div className="relative rounded-2xl shadow-2xl bg-white border border-border/60 overflow-hidden">
            {/* Title bar */}
            <div className="h-10 border-b border-border/40 bg-surface-muted flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              <div className="mx-auto text-[11px] font-medium text-on-surface-muted px-4 py-1 rounded bg-white border border-border shadow-sm flex items-center gap-1">
                <span className="text-success">●</span> civiclens.app/dashboard
              </div>
            </div>

            {/* App UI */}
            <div className="w-full aspect-[16/9] bg-surface flex">
              {/* Sidebar */}
              <div className="hidden md:flex w-64 bg-surface-muted border-r border-border/40 flex-col p-4 gap-4">
                <div className="h-8 rounded-md bg-border-light w-full" />
                <div className="space-y-2 mt-4">
                  <div className="h-6 rounded bg-border-light w-3/4" />
                  <div className="h-6 rounded bg-accent/10 w-full border border-accent/20" />
                  <div className="h-6 rounded bg-border-light w-5/6" />
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-6 md:p-8 flex flex-col gap-6 bg-[#fafafa]">
                <div className="flex justify-between items-center w-full">
                  <div className="w-48 h-8 bg-border-light rounded-md" />
                  <div className="flex gap-2">
                    <div className="w-24 h-8 bg-border-light rounded-md" />
                    <div className="w-32 h-8 bg-primary rounded-md" />
                  </div>
                </div>
                
                {/* Dashboard Widgets */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="col-span-1 md:col-span-2 h-64 bg-white border border-border/50 rounded-xl shadow-sm p-4 flex flex-col">
                    <div className="w-32 h-4 bg-border-light rounded mb-4" />
                    {/* Fake Chart */}
                    <div className="flex-1 flex items-end gap-2 px-2">
                      {[40, 70, 45, 90, 65, 85, 100, 60].map((h, i) => (
                        <div key={i} className="flex-1 bg-accent/20 rounded-t-sm relative group cursor-pointer hover:bg-accent transition-colors" style={{ height: `${h}%` }}>
                          {i === 6 && <div className="absolute top-0 left-0 w-full h-full bg-accent rounded-t-sm" />}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="h-64 bg-white border border-border/50 rounded-xl shadow-sm p-4 flex flex-col gap-4">
                    <div className="w-24 h-4 bg-border-light rounded" />
                    <div className="flex-1 rounded-lg bg-surface-muted flex items-center justify-center border border-border/40 border-dashed">
                       <div className="w-20 h-20 rounded-full border-4 border-accent/20 border-t-accent animate-[spin-slow_4s_linear_infinite]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
