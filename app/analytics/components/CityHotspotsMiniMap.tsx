"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { MapPin, ExternalLink, Flame, ShieldAlert } from "lucide-react";

// Dynamic import Leaflet map preview with SSR disabled
const DynamicMiniMap = dynamic(() => import("./DynamicMiniMapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-xs text-slate-400">
      Loading map preview...
    </div>
  ),
});

export default function CityHotspotsMiniMap() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col h-full" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <Flame size={14} className="text-amber-500" />
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Geospatial Triage</span>
          </div>
          <h2 className="text-base font-bold text-slate-900" style={{ fontFamily: "var(--font-heading)" }}>
            City Hotspots &amp; Risk Clusters
          </h2>
        </div>
        <Link
          href="/map"
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:text-[#1D4ED8] bg-[#EFF6FF] px-3 py-1.5 rounded-xl border border-[#BFDBFE] transition-colors"
        >
          <span>Open Community Map</span>
          <ExternalLink size={12} />
        </Link>
      </div>

      {/* Map Preview Canvas */}
      <div className="w-full h-52 rounded-xl overflow-hidden relative border border-slate-200">
        <DynamicMiniMap />
        
        {/* Hotspot legend overlay */}
        <div className="absolute bottom-2 left-2 z-[400] bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-slate-200 text-[10px] flex items-center gap-3 shadow-sm">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
            <span className="font-semibold text-slate-700">Ward 5 (High)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            <span className="font-semibold text-slate-700">Sector 4 (Med)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
