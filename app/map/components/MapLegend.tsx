"use client";

import { AlertTriangle, Info } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { motion, AnimatePresence } from "framer-motion";

export default function MapLegend() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="absolute left-6 bottom-6 z-[1000] pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white/95 backdrop-blur-xl border border-border shadow-xl rounded-2xl p-5 pointer-events-auto mb-4 w-64"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-primary text-sm flex items-center gap-2">
                <Info size={16} className="text-accent" />
                Issue Priority
              </h3>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-sm" />
                <span className="text-sm font-semibold text-slate-700">Critical</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-orange-500 border-2 border-white shadow-sm" />
                <span className="text-sm font-semibold text-slate-700">High</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-white shadow-sm" />
                <span className="text-sm font-semibold text-slate-700">Medium</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-sm" />
                <span className="text-sm font-semibold text-slate-700">Low</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm" />
                <span className="text-sm font-semibold text-slate-700">Resolved</span>
                <span className="text-xs text-slate-400 ml-auto">Completed</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <AlertTriangle size={14} className="text-slate-400 shrink-0" />
                Map clusters indicate high density reporting zones.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "pointer-events-auto h-10 px-4 rounded-xl font-semibold text-sm shadow-md transition-all border flex items-center gap-2",
          isOpen ? "bg-white text-primary border-border hover:bg-surface-muted" : "bg-primary text-white border-transparent hover:bg-primary-hover"
        )}
      >
        <Info size={16} />
        {isOpen ? "Hide Legend" : "Show Legend"}
      </button>
    </div>
  );
}
