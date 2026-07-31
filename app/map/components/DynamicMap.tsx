"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import IssuePopup from "./IssuePopup";
import MapControls from "./MapControls";
import MapLegend from "./MapLegend";

// Fix for default leaflet icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom SVG Icons for different priorities
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: "custom-leaflet-icon",
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 6px;
          height: 6px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -28],
  });
};

const icons = {
  Critical: createCustomIcon("#EF4444"), // Red
  High: createCustomIcon("#F97316"), // Orange
  Medium: createCustomIcon("#EAB308"), // Yellow
  Resolved: createCustomIcon("#22C55E"), // Green
};

const userLocationIcon = L.divIcon({
  className: "user-location-marker",
  html: `<div style="width:16px;height:16px;background-color:#3B82F6;border-radius:50%;border:3px solid white;box-shadow:0 0 10px rgba(59,130,246,0.5);animation:pulse 2s infinite;"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// Generates random mock issues around a given center
const generateMockIssues = (lat: number, lng: number) => [
  { id: "CVL-8894", title: "Large Pothole on Main St", lat: lat + 0.002, lng: lng - 0.003, category: "Pothole", priority: "Critical", confidence: 98, severity: 85, department: "Public Works", status: "Open", timeReported: "2h ago" },
  { id: "CVL-8895", title: "Broken Streetlight", lat: lat + 0.003, lng: lng + 0.004, category: "Streetlight", priority: "Medium", confidence: 92, severity: 45, department: "Power & Light", status: "Assigned", timeReported: "4h ago" },
  { id: "CVL-8896", title: "Water Leak near Park", lat: lat - 0.001, lng: lng - 0.005, category: "Water Leak", priority: "High", confidence: 89, severity: 72, department: "Water Dept", status: "Open", timeReported: "1h ago" },
  { id: "CVL-8897", title: "Cleared Fallen Tree", lat: lat + 0.005, lng: lng + 0.001, category: "Fallen Tree", priority: "Resolved", confidence: 99, severity: 10, department: "Parks & Rec", status: "Resolved", timeReported: "1d ago" },
  { id: "CVL-8898", title: "Traffic Signal Out", lat: lat - 0.004, lng: lng + 0.005, category: "Traffic Hazard", priority: "Critical", confidence: 95, severity: 92, department: "Transportation", status: "Open", timeReported: "30m ago" },
  { id: "CVL-8899", title: "Illegal Dumping", lat: lat - 0.002, lng: lng - 0.001, category: "Garbage", priority: "Medium", confidence: 88, severity: 35, department: "Sanitation", status: "Open", timeReported: "5h ago" },
];

const DEFAULT_CENTER: [number, number] = [10.8505, 76.2711]; // Kerala, India

// Component to handle auto-fitting bounds and exposed controls
function MapEffectController({ triggerReset, issues }: { triggerReset: number, issues: any[] }) {
  const map = useMap();
  
  useEffect(() => {
    if (issues.length > 0) {
      const bounds = L.latLngBounds(issues.map(issue => [issue.lat, issue.lng]));
      map.fitBounds(bounds, { padding: [50, 50], animate: true, duration: 1 });
    }
  }, [map, triggerReset, issues]);
  
  return null;
}

export default function DynamicMap({ resetKey }: { resetKey: number }) {
  const [mounted, setMounted] = useState(false);
  const [mapRef, setMapRef] = useState<L.Map | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [issues, setIssues] = useState(generateMockIssues(DEFAULT_CENTER[0], DEFAULT_CENTER[1]));

  useEffect(() => {
    setMounted(true);
    // Request location on mount
    handleLocateMe();
  }, []);

  const handleLocateMe = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newCenter: [number, number] = [latitude, longitude];
        setMapCenter(newCenter);
        setUserLocation(newCenter);
        setIssues(generateMockIssues(latitude, longitude));
        
        if (mapRef) {
          mapRef.setView(newCenter, 13, { animate: true });
        }
      },
      (err) => {
        console.warn("Geolocation denied or failed. Defaulting to Kerala.", err);
        if (mapRef) {
          mapRef.setView(DEFAULT_CENTER, 13, { animate: true });
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  if (!mounted) return null;

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer 
        center={mapCenter} 
        zoom={13} 
        zoomControl={false} // We will build custom zoom controls
        className="w-full h-full z-0 outline-none"
        ref={setMapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" // CartoDB Voyager is a clean, modern light theme
        />
        
        <MapEffectController triggerReset={resetKey} issues={issues} />
        
        {userLocation && (
          <Marker position={userLocation} icon={userLocationIcon}>
            <Popup className="rounded-xl">
              <div className="font-bold text-primary">Your Location</div>
            </Popup>
          </Marker>
        )}

        <MarkerClusterGroup
          chunkedLoading
          showCoverageOnHover={false}
          maxClusterRadius={50}
          spiderfyOnMaxZoom={true}
        >
          {issues.map((issue) => (
            <Marker 
              key={issue.id} 
              position={[issue.lat, issue.lng]} 
              icon={icons[issue.priority as keyof typeof icons]}
            >
              <Popup className="custom-popup" closeButton={false} minWidth={300} maxWidth={300} autoPanPadding={[50, 50]}>
                <IssuePopup {...issue} priority={issue.priority as any} />
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>

        <MapControls onReset={() => mapRef?.setView(mapCenter, 13)} />
        <MapLegend />
      </MapContainer>
      
      {/* Override leaflet popup default styles to match our custom component exactly */}
      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          padding: 0;
          overflow: hidden;
          border-radius: 0.5rem;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        }
        .leaflet-popup-content {
          margin: 0;
          width: 300px !important;
        }
        .leaflet-popup-tip-container {
          display: none;
        }
      `}</style>
    </div>
  );
}
