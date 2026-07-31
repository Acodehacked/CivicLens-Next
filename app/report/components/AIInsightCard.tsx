"use client";

import { motion } from "framer-motion";
import { Sparkles, Loader2, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export default function AIInsightCard({ hasImage }: { hasImage: boolean }) {
  return (
    <aside className="w-80 lg:w-96 shrink-0 bg-white border-l border-border hidden md:flex flex-col h-full z-10 overflow-hidden">
      
      {/* Header */}
      <div className="h-16 flex items-center gap-2 px-6 border-b border-border/50 bg-surface-muted/30">
        <Sparkles className="w-5 h-5 text-accent" />
        <h2 className="font-bold text-primary tracking-tight">CivicLens AI Engine</h2>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC]">
        {!hasImage ? (
          /* Empty State */
          <div className="h-full flex flex-col items-center justify-center text-center px-4 animate-in fade-in duration-500">
            <div className="w-16 h-16 rounded-full bg-accent-light flex items-center justify-center text-accent mb-4">
              <Sparkles size={24} />
            </div>
            <h3 className="font-bold text-primary mb-2">Waiting for Upload</h3>
            <p className="text-sm text-on-surface-muted leading-relaxed">
              Upload an image to activate the AI engine. It will automatically detect issue type, severity, and route it to the correct department.
            </p>
          </div>
        ) : (
          /* Populated State */
          <div className="flex flex-col gap-4 animate-in slide-in-from-right-4 fade-in duration-500">
            
            {/* Status Header */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-success uppercase tracking-wider">Analysis Complete</span>
              <span className="text-xs font-bold text-accent px-2 py-0.5 bg-accent-light rounded-full">99.2% Conf</span>
            </div>

            {/* Insight Card 1: Classification */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white p-4 rounded-xl border border-border shadow-sm flex flex-col gap-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-on-surface-muted font-medium mb-1">Detected Category</div>
                  <div className="font-bold text-primary text-base">Pothole / Road Defect</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                  <AlertTriangle size={16} />
                </div>
              </div>
              
              <div className="h-px w-full bg-border-light my-1" />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] uppercase font-bold text-on-surface-muted tracking-wider mb-1">Severity</div>
                  <div className="text-sm font-bold text-error flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-error" />
                    High (84/100)
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-on-surface-muted tracking-wider mb-1">Est. Size</div>
                  <div className="text-sm font-semibold text-primary">~2.5 ft diameter</div>
                </div>
              </div>
            </motion.div>

            {/* Insight Card 2: Routing */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white p-4 rounded-xl border border-border shadow-sm flex flex-col gap-3"
            >
               <div className="text-xs text-on-surface-muted font-medium mb-1">Department Assignment</div>
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-lg bg-surface-muted flex items-center justify-center text-primary font-bold">
                   PW
                 </div>
                 <div>
                   <div className="font-bold text-primary text-sm">Public Works</div>
                   <div className="text-xs text-on-surface-muted">Road Maintenance Div.</div>
                 </div>
               </div>
            </motion.div>

            {/* Insight Card 3: Deduplication */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="bg-white p-4 rounded-xl border border-border shadow-sm flex flex-col gap-2"
            >
               <div className="flex items-center gap-2 text-primary font-bold text-sm mb-1">
                 <Info size={16} className="text-accent" />
                 Duplicate Check
               </div>
               <p className="text-xs text-on-surface-muted leading-relaxed">
                 No exact duplicates found within a 50m radius in the last 14 days. 1 related issue (resolved) on same street block.
               </p>
            </motion.div>

          </div>
        )}
      </div>
    </aside>
  );
}
