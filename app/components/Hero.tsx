"use client";

import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, Sparkles, MapPin, AlertTriangle, CheckCircle2, TrendingUp, BarChart3, ShieldCheck, Zap, Layers, Globe, Eye } from "lucide-react";
import Link from "next/link";

/* ── Animation Variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as const },
  }),
};

// High quality real municipal officer & citizen avatars
const MUNICIPAL_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
];

export default function Hero() {
  return (
    <section
      className="relative z-10 w-full pt-32 pb-20 md:pt-40 md:pb-32 px-4 sm:px-6 flex flex-col justify-center items-center text-center overflow-hidden bg-[#F8FAFC]"
      aria-label="Hero"
    >
      {/* ── Background Mesh Glows ── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[90vw] h-[90vw] max-w-[1200px] max-h-[1200px] rounded-full bg-gradient-to-tr from-blue-400/20 via-indigo-400/15 to-transparent blur-[120px]" />
        <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-[100px]" />
      </div>

      {/* ── Content ── */}
      <div className="max-w-[var(--container-max)] mx-auto w-full flex flex-col items-center relative z-10">
        
        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-4xl sm:text-6xl lg:text-[76px] font-black text-slate-900 max-w-4xl tracking-tight leading-[1.06] mb-6 text-center"
        >
          Turning Civic Problems <br />
          <span className="bg-gradient-to-r from-[#2563EB] via-indigo-600 to-blue-500 bg-clip-text text-transparent">
            into Action
          </span>{" "}
          <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
            with AI
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed mb-8 sm:mb-10 px-2 font-medium"
        >
          AI-powered computer vision that detects, prioritizes, and routes civic issues for faster response and smarter community management.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto justify-center px-4"
        >
          <Link
            href="/report"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#2563EB] to-indigo-600 text-white rounded-full text-sm font-bold tracking-wide shadow-[0_10px_30px_rgba(37,99,235,0.3)] hover:shadow-[0_15px_35px_rgba(37,99,235,0.4)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
          >
            Report an Issue
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/community-map"
            className="w-full sm:w-auto px-8 py-4 bg-white text-slate-800 border border-slate-200/90 rounded-full text-sm font-bold tracking-wide shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
          >
            <PlayCircle className="w-4 h-4 text-[#2563EB]" />
            View Community Map
          </Link>
        </motion.div>

        {/* Trust Indicators (Real User Avatars) */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="mt-10 sm:mt-12 text-xs sm:text-sm font-medium text-slate-500 flex flex-wrap items-center justify-center gap-2 bg-white/60 backdrop-blur-md px-5 py-2.5 rounded-full border border-slate-200/60 shadow-sm"
        >
          <div className="flex -space-x-2.5 items-center">
            {MUNICIPAL_AVATARS.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt="Municipal Officer Avatar"
                className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm ring-1 ring-slate-100"
              />
            ))}
          </div>
          <span className="font-semibold text-slate-700 ml-1">Trusted by 50+ forward-thinking municipalities</span>
        </motion.div>

        {/* ── Public Civic Intelligence Preview Mockup ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={5}
          className="w-full max-w-5xl mt-14 sm:mt-20 md:mt-24"
        >
          {/* 1. DESKTOP VIEW (Public Platform Interactive Dashboard) - Visible on md+ */}
          <div className="hidden md:block relative rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)] bg-white border border-slate-200/80 overflow-hidden">
            {/* Title bar */}
            <div className="h-11 border-b border-slate-200/60 bg-slate-50/80 backdrop-blur-md flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              <div className="mx-auto text-[11px] font-bold text-slate-500 px-4 py-1 rounded-full bg-white border border-slate-200/80 shadow-sm flex items-center gap-1.5 font-mono">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> civiclens.app/community-intelligence
              </div>
            </div>

            {/* App UI Desktop */}
            <div className="w-full aspect-[16/9] bg-white flex">
              {/* Sidebar */}
              <div className="hidden md:flex w-64 bg-[#F8FAFC] border-r border-slate-200/60 flex-col p-5 gap-5 text-left shrink-0">
                <div className="flex items-center gap-2.5 px-1 py-1">
                  <div className="w-8 h-8 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    <Globe size={18} />
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-900 text-sm block leading-none">CivicLens</span>
                    <span className="text-[9px] font-bold text-[#2563EB] uppercase tracking-wider">Public Intelligence</span>
                  </div>
                </div>

                <div className="space-y-1.5 mt-2">
                  <div className="px-3.5 py-2.5 rounded-xl bg-[#2563EB] text-white font-bold text-xs flex items-center gap-2.5 shadow-sm">
                    <Layers size={14} /> Community Feed
                  </div>
                  <Link href="/community-map" className="px-3.5 py-2.5 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100 flex items-center gap-2.5 transition-colors">
                    <MapPin size={14} className="text-blue-500" /> Live Community Map
                  </Link>
                  <Link href="/report" className="px-3.5 py-2.5 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100 flex items-center gap-2.5 transition-colors">
                    <Sparkles size={14} className="text-purple-500" /> Report Issue
                  </Link>
                  <div className="px-3.5 py-2.5 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100 flex items-center gap-2.5 transition-colors">
                    <BarChart3 size={14} className="text-emerald-500" /> City Health
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-6 md:p-8 flex flex-col gap-5 bg-[#FAFAFA] text-left overflow-hidden">
                <div className="flex justify-between items-center w-full">
                  <div>
                    <h3 className="font-black text-slate-900 text-lg tracking-tight">Community Resolution Monitor</h3>
                    <p className="text-xs text-slate-500 font-medium">Transparent municipal progress & AI issue classification</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 shadow-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-500" /> Live Monitor
                    </div>
                    <Link href="/report" className="px-3.5 py-1.5 bg-[#2563EB] text-white rounded-xl text-xs font-bold shadow-sm hover:bg-[#1D4ED8] transition-colors flex items-center gap-1">
                      Report an Issue <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
                
                {/* ── Analytics Dashboard ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                  {/* LEFT: Reports This Week bar chart */}
                  <div className="col-span-1 md:col-span-2 bg-white border border-slate-200/70 rounded-2xl shadow-sm p-5 flex flex-col justify-between">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-0.5">Issues Triaged This Week</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-slate-900">248</span>
                          <span className="text-[10px] font-bold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded-full border border-[#BFDBFE]">↑ +12% resolved</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Top Category</p>
                        <p className="text-xs font-bold text-slate-800">Potholes</p>
                      </div>
                    </div>

                    {/* Bar chart */}
                    {(() => {
                      const categories = [
                        { label: "Potholes",     value: 89, pct: 89 },
                        { label: "Garbage",       value: 62, pct: 62 },
                        { label: "Waterlogging",  value: 47, pct: 47 },
                        { label: "Fallen Trees",  value: 34, pct: 34 },
                        { label: "Floods",        value: 16, pct: 16 },
                      ];
                      return (
                        <div className="flex-1 flex flex-col justify-end gap-2">
                          {categories.map((cat, i) => (
                            <div key={cat.label} className="flex items-center gap-3">
                              <p className="text-[10px] text-slate-500 w-24 shrink-0 text-right font-bold">{cat.label}</p>
                              <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-700 ${i === 0 ? "bg-[#2563EB]" : "bg-slate-300"}`}
                                  style={{ width: `${cat.pct}%` }}
                                />
                              </div>
                              <p className="text-[10px] font-bold text-slate-700 w-6 shrink-0">{cat.value}</p>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  {/* RIGHT: City Health Score */}
                  <div className="bg-white border border-slate-200/70 rounded-2xl shadow-sm p-5 flex flex-col justify-between">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">City Infrastructure Health</p>

                    <div className="flex items-center justify-center my-2">
                      <div className="relative w-24 h-24">
                        <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                          <circle cx="40" cy="40" r="32" fill="none" stroke="#F1F5F9" strokeWidth="7" />
                          <circle
                            cx="40" cy="40" r="32" fill="none"
                            stroke="#2563EB" strokeWidth="7"
                            strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 32 * 0.86} ${2 * Math.PI * 32}`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl font-black text-slate-900">86%</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-auto">
                      {[
                        { label: "Active Issues",  value: "101",  color: "text-amber-600" },
                        { label: "Resolved Today", value: "34",  color: "text-[#2563EB]" },
                        { label: "Critical",       value: "12",  color: "text-red-600" },
                        { label: "Avg Response",   value: "4.2h", color: "text-slate-700" },
                      ].map((m) => (
                        <div key={m.label} className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                          <p className={`text-xs font-black ${m.color}`}>{m.value}</p>
                          <p className="text-[9px] font-bold text-slate-400 mt-0.5 leading-tight">{m.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* BOTTOM: AI Insight card */}
                <div className="bg-blue-50/60 border border-blue-100 rounded-2xl px-5 py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="shrink-0 w-7 h-7 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      <Sparkles size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider mb-0.5">AI Engine Intelligence</p>
                      <p className="text-[11px] text-slate-700 leading-snug font-medium">
                        Most reports this week are <strong className="text-slate-900">potholes in Ward 5</strong>. Auto-routed to Road Maintenance Department.
                      </p>
                    </div>
                  </div>
                  <Link href="/community-map" className="shrink-0 text-[10px] font-bold text-white bg-[#2563EB] px-3.5 py-1.5 rounded-xl hover:bg-[#1D4ED8] transition-all shadow-sm flex items-center gap-1">
                    View Community Map →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 2. MOBILE VIEW (Simple Responsive Public Dashboard Card) - Visible on < md */}
          <div className="block md:hidden w-full max-w-sm mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.08)] overflow-hidden text-left p-4.5 space-y-4">
            {/* Mobile Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  <Globe size={14} />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs">Community Monitor</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Real-Time Progress</p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-green-50 text-green-700 font-extrabold text-[10px] rounded-full border border-green-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live Feed
              </span>
            </div>

            {/* Quick Action Button */}
            <Link href="/report" className="flex items-center justify-between p-3.5 bg-gradient-to-r from-[#2563EB] to-indigo-600 text-white rounded-2xl shadow-md">
              <div>
                <div className="text-xs font-bold">Report a Civic Issue</div>
                <div className="text-[10px] text-blue-100 font-medium">Auto-detected & routed to department</div>
              </div>
              <ArrowRight size={16} />
            </Link>

            {/* Reports & City Health Card */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-[9px] font-extrabold text-slate-400 uppercase">Issues Triaged</div>
                  <div className="text-xl font-black text-slate-900">248 <span className="text-[10px] font-bold text-[#2563EB] bg-blue-50 px-1.5 py-0.5 rounded">↑ +12%</span></div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] font-extrabold text-slate-400 uppercase">Health Score</div>
                  <div className="text-xl font-black text-[#2563EB]">86%</div>
                </div>
              </div>

              {/* Category Bars */}
              <div className="space-y-1.5 pt-1">
                {[
                  { label: "Potholes", pct: "89%" },
                  { label: "Garbage", pct: "62%" },
                  { label: "Waterlogging", pct: "47%" },
                ].map((cat) => (
                  <div key={cat.label} className="flex items-center gap-2 text-[10px]">
                    <span className="w-20 text-slate-500 font-bold shrink-0">{cat.label}</span>
                    <div className="flex-1 h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#2563EB] rounded-full" style={{ width: cat.pct }} />
                    </div>
                    <span className="font-bold text-slate-700 w-7 text-right">{cat.pct}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Intelligence Banner */}
            <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl text-[11px] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles size={14} className="text-[#2563EB] shrink-0" />
                <span className="text-blue-900 font-medium truncate">100% of issues auto-routed to official departments.</span>
              </div>
              <Link href="/community-map" className="text-[10px] font-bold text-[#2563EB] shrink-0 hover:underline">
                Map →
              </Link>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
