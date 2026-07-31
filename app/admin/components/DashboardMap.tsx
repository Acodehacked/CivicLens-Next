"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Maximize, RotateCcw, Crosshair } from "lucide-react";
import { cn } from "@/lib/utils/cn";

// Fix for default leaflet icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const createPin = (color: string) =>
  L.divIcon({
    className: "",
    html: `
      <div style="
        background:${color};width:24px;height:24px;
        border-radius:50% 50% 50% 0;transform:rotate(-45deg);
        border:2px solid white;box-shadow:0 4px 8px rgba(0,0,0,0.3);
        display:flex;align-items:center;justify-content:center;
      ">
        <div style="width:6px;height:6px;background:white;border-radius:50%;"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -28],
  });

const pins = {
  critical: createPin("#ef4444"),
  high: createPin("#f97316"),
  medium: createPin("#eab308"),
  low: createPin("#3b82f6"),
};

const userLocationIcon = L.divIcon({
  className: "user-location-marker",
  html: `<div style="width:16px;height:16px;background-color:#3B82F6;border-radius:50%;border:3px solid white;box-shadow:0 0 10px rgba(59,130,246,0.5);animation:pulse 2s infinite;"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// Generates random mock issues around a given center
const generateMockIssues = (lat: number, lng: number) => [
  { id: "REP-104", lat: lat + 0.002, lng: lng - 0.003, category: "Large Pothole", severity: "High", color: "high" },
  { id: "REP-105", lat: lat + 0.004, lng: lng - 0.005, category: "Fallen Tree", severity: "Critical", color: "critical" },
  { id: "REP-106", lat: lat - 0.002, lng: lng + 0.001, category: "Streetlight Out", severity: "Medium", color: "medium" },
  { id: "REP-107", lat: lat + 0.006, lng: lng + 0.002, category: "Water Leak", severity: "Low", color: "low" },
  { id: "REP-108", lat: lat - 0.003, lng: lng - 0.006, category: "Traffic Signal Down", severity: "Critical", color: "critical" },
];

const DEFAULT_CENTER: [number, number] = [10.8505, 76.2711]; // Kerala, India

export default function DashboardMap() {
  const [mounted, setMounted] = useState(false);
  const [mapRef, setMapRef] = useState<L.Map | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [issues, setIssues] = useState(generateMockIssues(DEFAULT_CENTER[0], DEFAULT_CENTER[1]));
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Request location on mount
    handleLocateMe();
  }, []);

  const handleLocateMe = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newCenter: [number, number] = [latitude, longitude];
        setMapCenter(newCenter);
        setUserLocation(newCenter);
        setIssues(generateMockIssues(latitude, longitude));
        
        if (mapRef) {
          mapRef.setView(newCenter, 14, { animate: true });
        }
        setIsLocating(false);
      },
      (err) => {
        console.warn("Geolocation denied or failed. Defaulting to Kerala.", err);
        // Fallback is already handled by default state
        if (mapRef) {
          mapRef.setView(DEFAULT_CENTER, 14, { animate: true });
        }
        setIsLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const resetView = () => {
    mapRef?.setView(mapCenter, 14, { animate: true });
  };

  if (!mounted) {
    return (
      <div className="bg-slate-100 rounded-2xl h-[400px] border border-border flex items-center justify-center animate-pulse">
        <span className="text-slate-400 font-medium">Loading Map Data...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col h-[450px] relative">
      {/* Map Header */}
      <div className="h-14 px-5 border-b border-border flex items-center justify-between shrink-0 bg-white z-10 relative">
        <div>
          <h3 className="font-bold text-primary">Live City Map</h3>
          <p className="text-[11px] font-semibold text-slate-400">Monitoring 2,543 active issues</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-red-50 rounded text-[10px] font-bold text-red-700 border border-red-100">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Critical (42)
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 bg-orange-50 rounded text-[10px] font-bold text-orange-700 border border-orange-100">
            <div className="w-2 h-2 rounded-full bg-orange-500" /> High (184)
          </div>
        </div>
      </div>

      {/* Map Instance */}
      <div className="flex-1 relative z-0">
        <MapContainer
          center={mapCenter}
          zoom={14}
          zoomControl={false}
          className="w-full h-full outline-none"
          ref={setMapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {/* Department Boundary Mock */}
          <Circle
            center={mapCenter}
            radius={800}
            pathOptions={{ color: "#3B82F6", fillColor: "#3B82F6", fillOpacity: 0.05, weight: 2, dashArray: "4 4" }}
          />
          
          {/* User Location */}
          {userLocation && (
            <Marker position={userLocation} icon={userLocationIcon}>
              <Popup className="rounded-xl">
                <div className="font-bold text-primary">Your Location</div>
              </Popup>
            </Marker>
          )}

          {/* Issue Markers */}
          {issues.map((issue) => (
            <Marker
              key={issue.id}
              position={[issue.lat, issue.lng]}
              icon={pins[issue.color as keyof typeof pins]}
            >
              <Popup className="custom-popup">
                <div className="p-1 min-w-[150px]">
                  <div className="text-[10px] font-bold text-slate-400 mb-1">{issue.id}</div>
                  <div className="font-bold text-primary mb-2">{issue.category}</div>
                  <div className={cn(
                    "inline-block px-2 py-0.5 rounded text-[10px] font-bold mb-2",
                    issue.color === "critical" ? "bg-red-100 text-red-700" :
                    issue.color === "high" ? "bg-orange-100 text-orange-700" :
                    issue.color === "medium" ? "bg-yellow-100 text-yellow-700" :
                    "bg-blue-100 text-blue-700"
                  )}>
                    {issue.severity} Priority
                  </div>
                  <button className="w-full py-1 bg-slate-100 rounded text-xs font-semibold text-primary hover:bg-slate-200 transition-colors">
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Map Controls */}
          <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
            <button 
              onClick={handleLocateMe} 
              className={cn(
                "w-8 h-8 bg-white rounded-lg shadow border border-slate-200 flex items-center justify-center transition-colors bg-opacity-90 backdrop-blur",
                isLocating ? "text-blue-500 animate-pulse" : "text-slate-500 hover:text-primary"
              )} 
              title="Locate Me"
            >
              <Crosshair size={16} />
            </button>
            <button onClick={resetView} className="w-8 h-8 bg-white rounded-lg shadow border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary transition-colors bg-opacity-90 backdrop-blur" title="Reset View">
              <RotateCcw size={16} />
            </button>
            <button className="w-8 h-8 bg-white rounded-lg shadow border border-slate-200 flex items-center justify-center text-slate-500 hover:text-primary transition-colors bg-opacity-90 backdrop-blur" title="Fullscreen">
              <Maximize size={16} />
            </button>
          </div>
        </MapContainer>
      </div>
    </div>
  );
}
