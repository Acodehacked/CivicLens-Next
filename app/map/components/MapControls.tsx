"use client";

import { useMap } from "react-leaflet";
import { Plus, Minus, Maximize, Navigation, RotateCcw, Layers } from "lucide-react";
import { useState } from "react";

export default function MapControls({ onReset }: { onReset: () => void }) {
  const map = useMap();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleZoomIn = () => map.zoomIn();
  const handleZoomOut = () => map.zoomOut();
  
  const handleLocation = () => {
    map.locate().on("locationfound", function (e) {
      map.flyTo(e.latlng, 15);
    });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="absolute right-6 top-6 z-[1000] flex flex-col gap-4 pointer-events-none">
      
      {/* Zoom Controls */}
      <div className="flex flex-col bg-white/90 backdrop-blur-md border border-border shadow-md rounded-xl overflow-hidden pointer-events-auto">
        <button 
          onClick={handleZoomIn}
          className="w-10 h-10 flex items-center justify-center text-primary hover:bg-surface-muted hover:text-accent transition-colors active:bg-accent-light"
          title="Zoom In"
        >
          <Plus size={18} />
        </button>
        <div className="h-px w-full bg-border" />
        <button 
          onClick={handleZoomOut}
          className="w-10 h-10 flex items-center justify-center text-primary hover:bg-surface-muted hover:text-accent transition-colors active:bg-accent-light"
          title="Zoom Out"
        >
          <Minus size={18} />
        </button>
      </div>

      {/* Action Controls */}
      <div className="flex flex-col bg-white/90 backdrop-blur-md border border-border shadow-md rounded-xl overflow-hidden pointer-events-auto">
        <button 
          onClick={handleLocation}
          className="w-10 h-10 flex items-center justify-center text-primary hover:bg-surface-muted hover:text-accent transition-colors active:bg-accent-light"
          title="Current Location"
        >
          <Navigation size={18} />
        </button>
        <div className="h-px w-full bg-border" />
        <button 
          onClick={onReset}
          className="w-10 h-10 flex items-center justify-center text-primary hover:bg-surface-muted hover:text-accent transition-colors active:bg-accent-light"
          title="Reset View"
        >
          <RotateCcw size={18} />
        </button>
        <div className="h-px w-full bg-border" />
        <button 
          onClick={toggleFullscreen}
          className="w-10 h-10 flex items-center justify-center text-primary hover:bg-surface-muted hover:text-accent transition-colors active:bg-accent-light"
          title="Toggle Fullscreen"
        >
          <Maximize size={18} />
        </button>
      </div>

      {/* Layer Controls */}
      <div className="flex flex-col bg-white/90 backdrop-blur-md border border-border shadow-md rounded-xl overflow-hidden pointer-events-auto mt-2">
         <button 
          className="w-10 h-10 flex items-center justify-center text-primary hover:bg-surface-muted hover:text-accent transition-colors active:bg-accent-light"
          title="Map Layers"
        >
          <Layers size={18} />
        </button>
      </div>

    </div>
  );
}
