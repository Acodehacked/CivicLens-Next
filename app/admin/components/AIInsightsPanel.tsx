"use client";

import { motion } from "framer-motion";
import { Sparkles, Brain, CloudRain, AlertTriangle, TrendingUp, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export default function AIInsightsPanel() {
  return (
    <div className="w-full xl:w-[320px] shrink-0 flex flex-col gap-4">
      {/* City Health Score */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-2xl border border-border shadow-sm p-5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-bl-full -z-10" />
        
        <div className="flex items-center gap-2 mb-4">
          <Brain size={18} className="text-blue-600" />
          <h3 className="font-bold text-primary">City Health Score</h3>
        </div>
        
        <div className="flex items-end gap-3 mb-2">
          <div className="text-5xl font-black text-primary tracking-tighter">84</div>
          <div className="text-sm font-bold text-green-600 mb-1 flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded-lg border border-green-100">
            <TrendingUp size={14} /> +2.4
          </div>
        </div>
        <p className="text-xs font-semibold text-slate-500">Overall civic infrastructure health based on AI analysis of 2,543 active reports.</p>
      </motion.div>

      {/* AI Alerts */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex-1"
      >
        <div className="h-12 border-b border-border/50 flex items-center px-4 bg-slate-50/50">
          <Sparkles size={16} className="text-accent mr-2" />
          <h3 className="font-bold text-primary text-sm">AI Insights & Alerts</h3>
        </div>

        <div className="p-4 flex flex-col gap-4">
          {/* Weather Alert */}
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <CloudRain size={16} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1">Forecast Alert</div>
              <p className="text-xs font-medium text-slate-700 leading-relaxed">
                Heavy rainfall expected in 24hrs. Flood-related reports in Ward 7 predicted to rise by 30%.
              </p>
            </div>
          </div>

          {/* Department Load */}
          <div className="p-3 bg-orange-50 rounded-xl border border-orange-100 flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <AlertTriangle size={16} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-orange-600 uppercase tracking-wider mb-1">Resource Warning</div>
              <p className="text-xs font-medium text-slate-700 leading-relaxed">
                Road Maintenance is currently operating at 115% capacity. Resolution times may degrade.
              </p>
            </div>
          </div>

          {/* Hotspots */}
          <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
              <Sparkles size={16} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-purple-600 uppercase tracking-wider mb-1">Pattern Detected</div>
              <p className="text-xs font-medium text-slate-700 leading-relaxed">
                Cluster of 12 street light outages reported in Downtown sector. High probability of grid failure.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
