"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2, MapPin, Users, Building, ShieldAlert, Info, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useEffect, useState } from "react";

export type AIState = "IDLE" | "PROCESSING" | "COMPLETE";

const stages = [
  "Uploading Image...",
  "Detecting Objects...",
  "Running AI Model...",
  "Calculating Severity...",
  "Checking Duplicate Reports...",
  "Routing to Official Department...",
  "Generating Recommendations..."
];

export default function AIIntelligencePanel({ state }: { state: AIState }) {
  const [currentStage, setCurrentStage] = useState(0);
  const [mobileExpanded, setMobileExpanded] = useState(true);

  useEffect(() => {
    if (state === "PROCESSING") {
      setCurrentStage(0);
      const interval = setInterval(() => {
        setCurrentStage(prev => {
          if (prev < stages.length - 1) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 800);
      return () => clearInterval(interval);
    }
  }, [state]);

  const panelContent = (
    <AnimatePresence mode="wait">
      {/* IDLE STATE */}
      {state === "IDLE" && (
        <motion.div 
          key="idle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="p-6 text-center flex flex-col items-center justify-center my-auto"
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-[#2563EB] mb-3 border border-blue-100 shadow-sm">
            <Sparkles size={24} />
          </div>
          <h3 className="font-bold text-primary text-base mb-1">Awaiting Image Scan</h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
            Upload or capture an image to trigger real-time AI classification, severity scoring, and department routing.
          </p>
        </motion.div>
      )}

      {/* PROCESSING STATE */}
      {state === "PROCESSING" && (
        <motion.div 
          key="processing"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-5 flex flex-col gap-3"
        >
          <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-1">AI Pipeline Analysis</h3>
          <div className="flex flex-col gap-2.5">
            {stages.map((stage, idx) => {
              const isActive = idx === currentStage;
              const isCompleted = idx < currentStage;
              return (
                <div key={stage} className="flex items-center gap-3">
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 text-[10px]",
                    isCompleted ? "bg-[#2563EB] border-[#2563EB] text-white font-bold" : 
                    isActive ? "border-[#2563EB] bg-blue-50 text-[#2563EB]" : "border-slate-200 bg-white"
                  )}>
                    {isCompleted ? <CheckCircle2 size={12} strokeWidth={3} /> :
                     isActive ? <div className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" /> : null}
                  </div>
                  <span className={cn(
                    "text-xs font-medium transition-all duration-300",
                    isCompleted ? "text-slate-400 line-through" : 
                    isActive ? "text-primary font-bold" : "text-slate-300"
                  )}>
                    {stage}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* COMPLETE STATE */}
      {state === "COMPLETE" && (
        <motion.div 
          key="complete"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 sm:p-5 flex flex-col gap-3"
        >
          {/* Primary Insight */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Detected Issue</div>
                <div className="font-extrabold text-primary text-base sm:text-lg leading-tight">Pothole Hazard</div>
              </div>
              <div className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-black border border-purple-100 flex items-center gap-1">
                <Sparkles size={11} /> 98% Conf.
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-red-50 p-2.5 rounded-lg border border-red-100 flex flex-col">
                <span className="text-[10px] font-bold text-red-600 uppercase">Severity Score</span>
                <span className="text-xl font-black text-red-600 tracking-tighter">85<span className="text-xs font-bold text-red-400">/100</span></span>
              </div>
              <div className="bg-orange-50 p-2.5 rounded-lg border border-orange-100 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-orange-600 uppercase">Priority</span>
                <span className="text-sm font-black text-orange-600">High Priority</span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2.5 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0"><MapPin size={14} /></div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Estimated Impact</div>
                <div className="font-semibold text-primary truncate">~2.5 ft crater, 4 inch depth</div>
              </div>
            </div>
            <div className="h-px bg-slate-100 w-full" />
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-500 shrink-0"><ShieldAlert size={14} /></div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Safety Hazard</div>
                <div className="font-semibold text-primary truncate">High risk for 2-wheelers & vehicles</div>
              </div>
            </div>
          </div>

          {/* Official Routing */}
          <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-100 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Routed Department</div>
              <div className="font-extrabold text-[#2563EB] text-xs sm:text-sm">Road Maintenance Department</div>
            </div>
            <div className="px-2 py-0.5 bg-blue-100 text-[#2563EB] text-[10px] font-bold rounded">
              Auto
            </div>
          </div>

          {/* AI Reasoning */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-3.5 rounded-xl border border-purple-100 text-xs">
            <div className="flex items-center gap-1.5 mb-1 text-purple-900 font-bold">
              <Sparkles size={13} className="text-purple-600" />
              <span className="uppercase tracking-wider text-[10px]">AI Reasoning</span>
            </div>
            <p className="text-purple-900/80 leading-relaxed text-[11px] font-medium">
              Image exhibits deep asphalt fracturing along high-density traffic lane. Automatically mapped to Road Maintenance Department for urgent patching squad dispatch.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Desktop Sidebar (lg+) */}
      <aside className="hidden lg:flex w-96 shrink-0 bg-white border-l border-border flex-col h-full z-20 overflow-y-auto shadow-none">
        <div className="h-16 flex items-center justify-between px-6 border-b border-border/50 bg-slate-50/50 backdrop-blur-xl shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Sparkles className={cn("w-5 h-5", state === "PROCESSING" ? "text-[#2563EB] animate-pulse" : "text-primary")} />
            <h2 className="font-bold text-primary tracking-tight text-base">AI Intelligence</h2>
          </div>
          {state === "COMPLETE" && (
            <div className="px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-[10px] font-extrabold uppercase flex items-center gap-1">
              <CheckCircle2 size={11} /> Complete
            </div>
          )}
        </div>
        <div className="flex-1 bg-[#F8FAFC]">
          {panelContent}
        </div>
      </aside>

      {/* Mobile Card / Accordion (< lg) */}
      <div className="block lg:hidden w-full bg-white border border-border rounded-2xl shadow-sm overflow-hidden mt-4 mb-4">
        <button
          onClick={() => setMobileExpanded(!mobileExpanded)}
          className="w-full h-14 px-4 flex items-center justify-between bg-slate-50 border-b border-slate-100 text-left"
        >
          <div className="flex items-center gap-2">
            <Sparkles className={cn("w-4 h-4", state === "PROCESSING" ? "text-[#2563EB] animate-pulse" : "text-primary")} />
            <span className="font-bold text-primary text-sm">AI Intelligence Insights</span>
          </div>
          <div className="flex items-center gap-2">
            {state === "COMPLETE" && (
              <span className="px-2 py-0.5 bg-green-50 text-green-700 font-extrabold text-[10px] rounded border border-green-100">
                Ready
              </span>
            )}
            <ChevronDown size={16} className={cn("text-slate-400 transition-transform", mobileExpanded && "rotate-180")} />
          </div>
        </button>

        {mobileExpanded && (
          <div className="bg-[#F8FAFC]">
            {panelContent}
          </div>
        )}
      </div>
    </>
  );
}
