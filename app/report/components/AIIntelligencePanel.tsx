"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2, AlertTriangle, Info, MapPin, Users, Building, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useEffect, useState } from "react";

export type AIState = "IDLE" | "PROCESSING" | "COMPLETE";

const stages = [
  "Uploading Image...",
  "Detecting Objects...",
  "Running AI Model...",
  "Calculating Severity...",
  "Checking Duplicate Reports...",
  "Finding Department...",
  "Generating Recommendations..."
];

export default function AIIntelligencePanel({ state }: { state: AIState }) {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    if (state === "PROCESSING") {
      setCurrentStage(0);
      const interval = setInterval(() => {
        setCurrentStage(prev => {
          if (prev < stages.length - 1) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 800); // 800ms per stage for the simulation
      return () => clearInterval(interval);
    }
  }, [state]);

  return (
    <aside className="w-full lg:w-96 shrink-0 bg-white border-l border-border flex flex-col h-full z-20 overflow-hidden shadow-xl lg:shadow-none fixed lg:relative bottom-0 lg:bottom-auto">
      
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-border/50 bg-slate-50/50 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className={cn("w-5 h-5", state === "PROCESSING" ? "text-accent animate-pulse" : "text-primary")} />
          <h2 className="font-bold text-primary tracking-tight">AI Intelligence</h2>
        </div>
        
        {state === "COMPLETE" && (
          <div className="px-2 py-0.5 rounded-full bg-success-bg border border-success/20 text-success text-[10px] font-bold uppercase flex items-center gap-1">
            <CheckCircle2 size={12} /> Complete
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
        <AnimatePresence mode="wait">
          
          {/* IDLE STATE */}
          {state === "IDLE" && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col items-center justify-center text-center p-8"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4 border border-border">
                <Sparkles size={24} />
              </div>
              <h3 className="font-bold text-primary mb-2">Awaiting Scan</h3>
              <p className="text-sm text-on-surface-muted leading-relaxed">
                Upload an image to activate the AI engine. It will detect the problem, estimate severity, determine priority, and route it to the responsible department.
              </p>
            </motion.div>
          )}

          {/* PROCESSING STATE */}
          {state === "PROCESSING" && (
            <motion.div 
              key="processing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6 flex flex-col gap-4"
            >
              <h3 className="text-sm font-bold text-primary mb-2">Analysis in Progress</h3>
              <div className="flex flex-col gap-3">
                {stages.map((stage, idx) => {
                  const isActive = idx === currentStage;
                  const isCompleted = idx < currentStage;
                  return (
                    <div key={stage} className="flex items-center gap-3">
                      <div className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300",
                        isCompleted ? "bg-accent border-accent text-white" : 
                        isActive ? "border-accent bg-accent-light" : "border-slate-200 bg-white"
                      )}>
                        {isCompleted && <CheckCircle2 size={12} strokeWidth={3} />}
                        {isActive && <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />}
                      </div>
                      <span className={cn(
                        "text-sm font-medium transition-all duration-300",
                        isCompleted ? "text-slate-400" : 
                        isActive ? "text-primary" : "text-slate-300"
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-5 flex flex-col gap-4 pb-24 lg:pb-5"
            >
              {/* Primary Insight */}
              <div className="bg-white p-4 rounded-xl border border-border shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Detected Issue</div>
                    <div className="font-bold text-primary text-lg leading-tight">Large Pothole</div>
                  </div>
                  <div className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold border border-blue-100 flex items-center gap-1">
                    98% Conf.
                  </div>
                </div>

                <div className="flex gap-2">
                   <div className="flex-1 bg-red-50 p-2 rounded-lg border border-red-100 flex flex-col">
                     <span className="text-[10px] font-bold text-red-600/70 uppercase">Severity</span>
                     <span className="text-xl font-black text-red-600 tracking-tighter">85<span className="text-sm font-bold text-red-400">/100</span></span>
                   </div>
                   <div className="flex-1 bg-orange-50 p-2 rounded-lg border border-orange-100 flex flex-col">
                     <span className="text-[10px] font-bold text-orange-600/70 uppercase">Priority</span>
                     <span className="text-base font-bold text-orange-600 mt-auto">High</span>
                   </div>
                </div>
              </div>

              {/* Secondary Details */}
              <div className="bg-white p-4 rounded-xl border border-border shadow-sm flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500"><MapPin size={16} /></div>
                  <div className="flex-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Estimated Size</div>
                    <div className="text-sm font-semibold text-primary">~2.5 ft diameter, 4 inches deep</div>
                  </div>
                </div>
                <div className="h-px bg-slate-100 w-full" />
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500"><ShieldAlert size={16} /></div>
                  <div className="flex-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Safety Risk</div>
                    <div className="text-sm font-semibold text-primary">High risk to cyclists & vehicles</div>
                  </div>
                </div>
                <div className="h-px bg-slate-100 w-full" />
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500"><Users size={16} /></div>
                  <div className="flex-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase">Affected Population</div>
                    <div className="text-sm font-semibold text-primary">Primary Roadway (Heavy Traffic)</div>
                  </div>
                </div>
              </div>

              {/* Routing & Duplicates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-xl border border-border shadow-sm flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mb-1">
                    <Info size={14} className="text-accent" /> Duplicates
                  </div>
                  <div className="text-sm font-bold text-primary">3 Reports</div>
                  <div className="text-[10px] text-slate-400">Within 50m radius</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-border shadow-sm flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mb-1">
                    <Building size={14} className="text-accent" /> Assigned
                  </div>
                  <div className="text-sm font-bold text-primary">Public Works</div>
                  <div className="text-[10px] text-slate-400">Road Maintenance</div>
                </div>
              </div>

              {/* AI Reasoning */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-blue-600" />
                  <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">AI Reasoning</span>
                </div>
                <p className="text-xs text-blue-900/80 leading-relaxed font-medium">
                  The uploaded image indicates a large pothole on a primary roadway. The damage is likely to affect heavy traffic. Three nearby duplicate reports increase its priority. Recommend immediate routing to the Road Maintenance Department.
                </p>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </aside>
  );
}
