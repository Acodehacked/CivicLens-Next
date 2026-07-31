"use client";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import CivicLensLogo from "@/app/components/CivicLensLogo";
import { motion } from "framer-motion";
import { Eye, ShieldCheck, Users, Sparkles, HeartHandshake, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 max-w-[var(--container-max)] mx-auto px-6 w-full">
        
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-xs font-bold text-[#2563EB] mb-4">
            <Sparkles size={14} /> Driven by AI • Empowering Communities
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6">
            Building Smarter, Cleaner, and More Responsive Cities Together.
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            CivicLens bridges the gap between citizens and local government. Using advanced computer vision and transparent workflows, we make reporting civic issues effortless and resolution accountable.
          </p>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            {
              title: "Instant AI Vision Detection",
              desc: "Citizens capture a photo. AI instantly identifies potholes, fallen trees, broken streetlights, or waste, rating urgency in seconds.",
              icon: Eye,
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              title: "Direct Municipal Dispatch",
              desc: "No call centers or endless paperwork. Issues are auto-routed straight to responsible department teams for fast resolution.",
              icon: ShieldCheck,
              color: "text-indigo-600",
              bg: "bg-indigo-50",
            },
            {
              title: "Transparent Community Tracking",
              desc: "Track your report's status in real-time on our interactive Community Map. See when repair crews are dispatched.",
              icon: Users,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
          ].map((pillar, idx) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-14 h-14 rounded-2xl ${pillar.bg} ${pillar.color} flex items-center justify-center mb-6`}>
                <pillar.icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{pillar.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{pillar.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Mission Statement Box */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl mb-20 relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <h2 className="text-2xl sm:text-3xl font-black mb-4">Our Commitment to Privacy & Trust</h2>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed mb-6">
              Your location data is strictly utilized for routing service crews to reported locations. We respect your anonymity, ensure open data governance, and prioritize community safety above all.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-bold text-white">
              <span className="flex items-center gap-1.5 bg-white/10 px-3.5 py-2 rounded-xl backdrop-blur-md">
                <CheckCircle2 size={16} className="text-blue-300" /> Anonymized Map Data
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3.5 py-2 rounded-xl backdrop-blur-md">
                <CheckCircle2 size={16} className="text-blue-300" /> Open Resolution Metrics
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3.5 py-2 rounded-xl backdrop-blur-md">
                <CheckCircle2 size={16} className="text-blue-300" /> 100% Free for Citizens
              </span>
            </div>
          </div>
        </div>

        {/* CTA Box */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center max-w-3xl mx-auto shadow-sm">
          <CivicLensLogo size={40} className="mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Ready to improve your neighborhood?</h2>
          <p className="text-slate-600 text-sm mb-6 max-w-md mx-auto">
            Report a pothole, broken streetlight, or garbage issue in under 30 seconds.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/report"
              className="px-6 py-3 bg-[#2563EB] text-white rounded-full font-bold text-sm hover:bg-[#1d4ed8] transition-colors shadow-md flex items-center gap-2"
            >
              Report an Issue Now <ArrowRight size={16} />
            </Link>
            <Link
              href="/community-map"
              className="px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-full font-bold text-sm hover:bg-slate-50 transition-colors"
            >
              Explore Community Map
            </Link>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
