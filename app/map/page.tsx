"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Loader2, Map as MapIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

// Dynamically import the map component with SSR disabled
const DynamicMap = dynamic(() => import("./components/DynamicMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#F8FAFC]">
      <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-border flex items-center justify-center text-primary mb-4 relative overflow-hidden">
        <MapIcon size={24} className="opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
        <Loader2 className="absolute inset-0 m-auto text-accent animate-spin" size={24} />
      </div>
      <h3 className="text-lg font-bold text-primary mb-2">Loading Map Data...</h3>
      <p className="text-sm text-on-surface-muted max-w-sm text-center">
        Fetching live civic intelligence data and optimizing geospatial layers.
      </p>
    </div>
  ),
});

export default function MapPage() {
  const [resetKey, setResetKey] = useState(0);

  return (
    <div className="flex flex-col h-screen w-full bg-[#F8FAFC] overflow-hidden">
      
      {/* Top Utility Bar */}
      <div className="h-14 bg-white/95 backdrop-blur-xl border-b border-border shadow-sm shrink-0 px-6 flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className="w-8 h-8 rounded-lg bg-surface-muted flex items-center justify-center text-primary hover:bg-border-light hover:text-accent transition-colors"
          >
            <ArrowLeft size={16} />
          </Link>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary text-white flex items-center justify-center font-bold text-xs">C</div>
            <span className="font-bold text-primary tracking-tight">Community Map</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 border border-success/20">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] font-bold text-success uppercase tracking-wider">Live Sync</span>
          </div>
          <button 
            onClick={() => setResetKey(prev => prev + 1)}
            className="text-xs font-semibold px-4 py-1.5 rounded-lg bg-white border border-border shadow-sm hover:bg-surface-muted transition-colors text-primary"
          >
            Fit Bounds
          </button>
        </div>
      </div>

      {/* Main Map Area */}
      <div className="flex-1 relative z-0">
        <DynamicMap resetKey={resetKey} />
      </div>
    </div>
  );
}
