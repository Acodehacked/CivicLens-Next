"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Loader2, Map as MapIcon, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";

// Dynamically import the Leaflet map component with SSR disabled
const DynamicMap = dynamic(() => import("@/app/map/components/DynamicMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#F8FAFC]">
      <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-border flex items-center justify-center text-primary mb-4 relative overflow-hidden">
        <MapIcon size={24} className="opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
        <Loader2 className="absolute inset-0 m-auto text-[#2563EB] animate-spin" size={24} />
      </div>
      <h3 className="text-lg font-bold text-primary mb-2">Loading Map Engine...</h3>
      <p className="text-sm text-on-surface-muted max-w-sm text-center">
        Fetching real-time civic issues and interactive map layers.
      </p>
    </div>
  ),
});

export default function CommunityMapPage() {
  const [resetKey, setResetKey] = useState(0);

  return (
    <div className="flex flex-col h-screen w-full bg-[#F8FAFC] overflow-hidden">
      
      {/* Public Navbar */}
      <Navbar />

      {/* Top Map Action Sub-Bar */}
      <div className="mt-16 h-12 bg-white/90 backdrop-blur-xl border-b border-border shadow-sm shrink-0 px-6 flex items-center justify-between z-20 relative">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-800 text-xs sm:text-sm tracking-tight flex items-center gap-2">
            <MapIcon size={16} className="text-[#2563EB]" />
            Live Citizen Map
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-xs text-slate-500 hidden sm:inline font-medium">
            Explore reported civic issues near you
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#BFDBFE]">
            <div className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" />
            <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider">Live Updates</span>
          </div>
          <button 
            onClick={() => setResetKey(prev => prev + 1)}
            className="text-xs font-semibold px-3 py-1 rounded-lg bg-white border border-border shadow-sm hover:bg-slate-50 transition-colors text-slate-700"
          >
            Reset View
          </button>
          <Link
            href="/report"
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-1 rounded-lg bg-[#2563EB] text-white shadow-sm hover:bg-[#1D4ED8] transition-colors active:scale-[0.98]"
          >
            <Plus size={14} />
            <span>Report Issue</span>
          </Link>
        </div>
      </div>

      {/* Main Map Area */}
      <div className="flex-1 relative z-0">
        <DynamicMap resetKey={resetKey} />

        {/* Floating Quick Action Button */}
        <div className="absolute bottom-6 left-6 z-[1000] pointer-events-auto">
          <Link
            href="/report"
            className="flex items-center gap-2 bg-[#2563EB] text-white px-4 py-2.5 rounded-full text-xs font-bold shadow-lg hover:bg-[#1D4ED8] active:scale-[0.98] transition-all border border-white/20"
          >
            <Plus size={16} />
            <span>Report New Issue</span>
          </Link>
        </div>
      </div>

    </div>
  );
}
