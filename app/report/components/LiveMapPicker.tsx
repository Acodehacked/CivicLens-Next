"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Crosshair, MapPin, AlertCircle, CheckCircle2 } from "lucide-react";
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
        background:${color};width:28px;height:28px;
        border-radius:50% 50% 50% 0;transform:rotate(-45deg);
        border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.35);
        display:flex;align-items:center;justify-content:center;
      ">
        <div style="width:7px;height:7px;background:white;border-radius:50%;"></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -32],
  });

const bluePin = createPin("#2563EB");

const userLocationIcon = L.divIcon({
  className: "user-location-marker",
  html: `<div style="width:16px;height:16px;background-color:#3B82F6;border-radius:50%;border:3px solid white;box-shadow:0 0 10px rgba(59,130,246,0.5);animation:pulse 2s infinite;"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const DEFAULT_CENTER: [number, number] = [10.8505, 76.2711]; // Kerala, India

interface Location {
  lat: number;
  lng: number;
  accuracy: number;
}

function MapClickHandler({ onMove }: { onMove: (pos: L.LatLng) => void }) {
  useMapEvents({
    click(e) {
      onMove(e.latlng);
    },
  });
  return null;
}

export default function LiveMapPicker({
  onLocationConfirm,
}: {
  onLocationConfirm: (lat: number, lng: number) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [location, setLocation] = useState<Location | null>(null);
  const [userRealLocation, setUserRealLocation] = useState<[number, number] | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [mapRef, setMapRef] = useState<L.Map | null>(null);
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    setMounted(true);
    requestLocation();
  }, []);

  // Fly to live location as soon as BOTH the map and the coordinates are ready
  useEffect(() => {
    if (mapRef && userRealLocation) {
      mapRef.flyTo(userRealLocation, 17, { animate: true, duration: 1.2 });
    }
  }, [mapRef, userRealLocation]);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      useFallback();
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng, accuracy } = pos.coords;
        const loc = { lat, lng, accuracy };
        setLocation(loc);
        setUserRealLocation([lat, lng]);
        setIsLocating(false);
        onLocationConfirm(lat, lng);
        // flyTo is handled by the mapRef+userRealLocation useEffect above
      },
      (err) => {
        let msg = "Location access was denied.";
        if (err.code === err.TIMEOUT) msg = "Location request timed out.";
        if (err.code === err.POSITION_UNAVAILABLE) msg = "Location information unavailable.";
        setGeoError(msg + " Tap the marker to drag it to the correct location.");
        setIsLocating(false);
        useFallback();
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  };

  const useFallback = () => {
    const fallback = { lat: DEFAULT_CENTER[0], lng: DEFAULT_CENTER[1], accuracy: 500 };
    setLocation(fallback);
    onLocationConfirm(fallback.lat, fallback.lng);
  };

  const markerEventHandlers = useMemo(
    () => ({
      dragend() {
        const pos = markerRef.current?.getLatLng();
        if (pos) {
          setLocation((prev) => (prev ? { ...prev, lat: pos.lat, lng: pos.lng } : null));
          onLocationConfirm(pos.lat, pos.lng);
        }
      },
    }),
    [onLocationConfirm]
  );

  if (!mounted) {
    return (
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden h-[400px] flex flex-col">
        <div className="flex-1 bg-slate-100 animate-pulse" />
        <div className="h-14 bg-white border-t border-border flex items-center px-5 gap-3">
          <div className="w-8 h-8 bg-slate-100 rounded-xl animate-pulse" />
          <div className="flex flex-col gap-1.5">
            <div className="w-28 h-3 bg-slate-100 rounded animate-pulse" />
            <div className="w-40 h-3 bg-slate-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
      {/* Status bar above map */}
      {geoError && (
        <div className="px-5 py-3 bg-amber-50 border-b border-amber-100 flex items-start gap-3 text-sm text-amber-800">
          <AlertCircle size={16} className="shrink-0 mt-0.5 text-amber-500" />
          <span className="font-medium">{geoError}</span>
        </div>
      )}

      {/* Map */}
      <div className="relative h-[300px] sm:h-[360px]">
        <MapContainer
          center={location ? [location.lat, location.lng] : DEFAULT_CENTER}
          zoom={location ? 17 : 13}
          zoomControl={false}
          className="w-full h-full z-0 outline-none"
          ref={setMapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          <MapClickHandler
            onMove={(pos) => {
              setLocation((prev) => (prev ? { ...prev, lat: pos.lat, lng: pos.lng } : { lat: pos.lat, lng: pos.lng, accuracy: 20 }));
              onLocationConfirm(pos.lat, pos.lng);
            }}
          />

          {userRealLocation && (
            <Marker position={userRealLocation} icon={userLocationIcon} />
          )}

          {location && (
            <>
              <Marker
                position={[location.lat, location.lng]}
                icon={bluePin}
                draggable
                ref={markerRef}
                eventHandlers={markerEventHandlers}
              />
              {location.accuracy > 0 && (
                <Circle
                  center={[location.lat, location.lng]}
                  radius={Math.min(location.accuracy, 200)}
                  pathOptions={{
                    color: "#2563EB",
                    fillColor: "#2563EB",
                    fillOpacity: 0.08,
                    weight: 1.5,
                    dashArray: "4 3",
                  }}
                />
              )}
            </>
          )}

          {/* In-map Locate button */}
          <div className="absolute top-3 right-3 z-[1000]">
            <button
              onClick={requestLocation}
              title="Find my location"
              className={cn(
                "w-10 h-10 bg-white rounded-xl border border-border shadow-md flex items-center justify-center transition-all active:scale-95",
                isLocating ? "text-accent animate-pulse" : "text-primary hover:bg-slate-50"
              )}
            >
              <Crosshair size={18} />
            </button>
          </div>
        </MapContainer>
      </div>

      {/* Info footer */}
      <div className="px-5 py-4 border-t border-border flex items-center gap-4 flex-wrap">
        <div className={cn(
          "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
          location ? "bg-blue-50 text-accent" : "bg-slate-100 text-slate-400"
        )}>
          <MapPin size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-primary">
            {isLocating ? "Locating you..." : location ? "Location Confirmed" : "Waiting for GPS..."}
          </div>
          {location && (
            <div className="text-xs text-on-surface-muted flex items-center gap-2 mt-0.5 flex-wrap">
              <span>{location.lat.toFixed(5)}, {location.lng.toFixed(5)}</span>
              {location.accuracy < 100 && (
                <>
                  <span className="w-1 h-1 rounded-full bg-border shrink-0" />
                  <span className="text-green-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 size={12} /> ±{Math.round(location.accuracy)}m accuracy
                  </span>
                </>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={requestLocation}
            disabled={isLocating}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-border shadow-sm hover:bg-slate-50 active:scale-[0.97] disabled:opacity-50 transition-all text-primary whitespace-nowrap flex items-center gap-1"
          >
            <Crosshair size={13} />
            {isLocating ? "Locating..." : "Re-locate"}
          </button>
        </div>
      </div>

      {/* Instruction hint */}
      <div className="px-5 pb-4">
        <p className="text-xs text-on-surface-muted/60 bg-slate-50 rounded-lg px-3 py-2 border border-border/50">
          📍 Tap the map to move the pin, or drag it to the exact issue location.
        </p>
      </div>
    </div>
  );
}
