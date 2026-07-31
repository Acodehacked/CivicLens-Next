"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="w-full py-24 md:py-32 px-6 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#2563EB]/5 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-primary tracking-tight mb-8">
            Ready to transform your community's infrastructure?
          </h2>
          <p className="text-xl text-on-surface-muted mb-12 max-w-2xl mx-auto">
            Join the growing network of municipalities using AI to build smarter, safer, and more responsive communities.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/report"
              className="w-full sm:w-auto px-8 py-4 bg-[#2563EB] text-white rounded-full text-base font-semibold shadow-lg shadow-[#2563EB]/20 hover:bg-[#1D4ED8] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
            >
              Report an Issue
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/map"
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border-2 border-slate-200 rounded-full text-base font-semibold shadow-sm hover:border-[#2563EB] hover:text-[#2563EB] hover:bg-[#EFF6FF]/50 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 flex items-center justify-center"
            >
              View Community Map
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
