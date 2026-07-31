"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle2, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const benefitsList = [
  "Reduce average incident response time by up to 45%",
  "Eliminate duplicate dispatches for the same issue",
  "Provide citizens with real-time status updates",
  "Generate automated compliance reports instantly",
  "Optimize crew routing based on geographic clustering",
];

const mockTriageItems = [
  {
    title: "Large Fallen Tree on Main Rd",
    dept: "Parks & Tree Maintenance Department",
    img: "https://images.unsplash.com/photo-1594950893301-44755f190e22?auto=format&fit=crop&w=120&q=80",
    sev: "HIGH",
    sevColor: "bg-red-50 text-red-600 border-red-100",
    time: "10m ago",
  },
  {
    title: "Deep Pothole (Rim Damage)",
    dept: "Road Maintenance Department",
    img: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=120&q=80",
    sev: "HIGH",
    sevColor: "bg-orange-50 text-orange-600 border-orange-100",
    time: "45m ago",
  },
  {
    title: "Severe Flash Flood Risk",
    dept: "Disaster Management & Emergency Response Department",
    img: "https://images.unsplash.com/photo-1541888047913-91ee71212c41?auto=format&fit=crop&w=120&q=80",
    sev: "CRITICAL",
    sevColor: "bg-red-100 text-red-700 border-red-200 font-black",
    time: "1h ago",
  },
  {
    title: "Illegal Dump Dumpster Spill",
    dept: "Sanitation & Waste Management Department",
    img: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=120&q=80",
    sev: "MED",
    sevColor: "bg-amber-50 text-amber-600 border-amber-100",
    time: "2h ago",
  },
];

export default function Benefits() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="w-full py-16 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white border-b border-border/50 overflow-hidden">
      <div className="max-w-[var(--container-max)] mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-24 items-center">
          
          {/* Left: Product UI Showcase */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-2 lg:order-1 relative rounded-2xl sm:rounded-3xl bg-[#F8FAFC] border border-slate-200/80 p-3 sm:p-5 md:p-6 shadow-xl max-w-full overflow-hidden"
          >
            {/* Real Dashboard representation */}
            <div className="w-full bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col">
              {/* Header */}
              <div className="h-12 sm:h-14 border-b border-slate-100 flex items-center px-3 sm:px-4 justify-between bg-slate-50/80">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 pr-1">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    <ShieldCheck size={13} />
                  </div>
                  <span className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">Department Triage Queue</span>
                </div>
                <div className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-blue-50 text-[#2563EB] border border-blue-100 text-[9px] sm:text-[10px] font-bold flex items-center gap-1 shrink-0">
                  <Sparkles size={10} /> AI-Routed
                </div>
              </div>

              {/* List View with Real Data */}
              <div className="p-2.5 sm:p-3.5 flex flex-col gap-2">
                {mockTriageItems.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl border border-slate-100 hover:bg-slate-50/80 transition-colors gap-2">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-1">
                      <img src={item.img} alt="" className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg object-cover border border-slate-200 shrink-0" />
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-xs sm:text-sm truncate">{item.title}</div>
                        <div className="text-[9px] sm:text-[10px] text-[#2563EB] font-semibold truncate mt-0.5">{item.dept}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end shrink-0 gap-0.5">
                      <span className={`px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-extrabold border ${item.sevColor}`}>
                        {item.sev}
                      </span>
                      <span className="text-[8px] sm:text-[9px] text-slate-400 font-medium">{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <div className="order-1 lg:order-2 flex flex-col gap-6 sm:gap-8 max-w-full overflow-hidden">
            <div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4 sm:mb-6 leading-tight break-words">
                Empower your public works department.
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed font-medium break-words">
                By automating the triage process, CivicLens frees up your staff to do what they do best: improving the community. Say goodbye to manual ticket sorting and duplicate reports.
              </p>
            </div>

            <ul className="flex flex-col gap-3 sm:gap-4">
              {benefitsList.map((benefit, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  className="flex items-start gap-2.5 sm:gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#2563EB] shrink-0 mt-0.5" />
                  <span className="text-slate-800 text-xs sm:text-base font-semibold leading-normal break-words">{benefit}</span>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-2"
            >
              <Link href="/community-map" className="inline-flex items-center text-[#2563EB] font-bold text-xs sm:text-sm hover:text-[#1D4ED8] transition-colors">
                View Live Community Map <ArrowRight size={15} className="ml-1.5" />
              </Link>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
