"use client";

import { MapPin, Navigation, Crosshair } from "lucide-react";

export default function MapPicker() {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
      <div className="h-[250px] bg-blue-50/50 relative overflow-hidden flex items-center justify-center">
        {/* Mock Map Background pattern */}
        <div 
          className="absolute inset-0 opacity-10" 
          style={{ backgroundImage: 'radial-gradient(#2563EB 1px, transparent 1px)', backgroundSize: '20px 20px' }}
        />
        
        {/* Center Marker */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded shadow-md mb-1 animate-bounce">
            Detected
          </div>
          <MapPin size={32} className="text-accent drop-shadow-md" fill="currentColor" />
          <div className="w-8 h-2 bg-black/10 rounded-[100%] blur-[2px] mt-1" />
        </div>

        {/* Controls Overlay */}
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <button className="w-10 h-10 bg-white rounded-xl shadow-md border border-border flex items-center justify-center text-primary hover:bg-surface-muted transition-colors active:scale-95">
            <Crosshair size={18} />
          </button>
        </div>
      </div>
      
      <div className="p-5 flex items-center justify-between gap-4 bg-white border-t border-border/50">
        <div className="flex gap-4 items-center">
          <div className="w-10 h-10 rounded-xl bg-accent-light text-accent flex items-center justify-center shrink-0">
            <Navigation size={18} />
          </div>
          <div>
            <div className="text-sm font-bold text-primary">1248 Elm Street, Downtown</div>
            <div className="text-xs text-on-surface-muted flex gap-2 items-center mt-0.5">
              <span>Lat: 34.0522</span>
              <div className="w-1 h-1 rounded-full bg-border" />
              <span>Lng: -118.2437</span>
              <div className="w-1 h-1 rounded-full bg-border" />
              <span className="text-success font-semibold">High Confidence</span>
            </div>
          </div>
        </div>
        
        <button className="hidden sm:block px-4 py-2 bg-white border border-border rounded-lg text-xs font-semibold text-primary shadow-sm hover:bg-surface-muted active:scale-[0.98] transition-all whitespace-nowrap">
          Edit Location
        </button>
      </div>
    </div>
  );
}
