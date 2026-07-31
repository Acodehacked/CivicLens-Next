"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { MapMarker } from "@/lib/data/analytics";
import { formatIssueLabel } from "@/lib/constants/severity";

const SEVERITY_COLOR: Record<string, string> = {
  critical: "#EF4444",
  high: "#F97316",
  medium: "#EAB308",
  low: "#3B82F6",
};

const DEFAULT_CENTER: [number, number] = [10.8505, 76.2711];

export default function DynamicMiniMapInner({ markers }: { markers: MapMarker[] }) {
  const center: [number, number] = markers.length > 0 ? [markers[0].lat, markers[0].lng] : DEFAULT_CENTER;

  return (
    <MapContainer center={center} zoom={12} scrollWheelZoom={false} zoomControl={false} className="w-full h-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker) => (
        <CircleMarker
          key={marker.id}
          center={[marker.lat, marker.lng]}
          radius={marker.severity === "critical" ? 10 : marker.severity === "high" ? 8 : 6}
          pathOptions={{
            color: SEVERITY_COLOR[marker.severity] ?? SEVERITY_COLOR.low,
            fillColor: SEVERITY_COLOR[marker.severity] ?? SEVERITY_COLOR.low,
            fillOpacity: 0.5,
            weight: 2,
          }}
        >
          <Popup>
            <div className="p-1 text-xs font-sans">
              <strong className="block text-slate-900 font-bold mb-0.5">{formatIssueLabel(marker.yoloClass)}</strong>
              <span className="text-slate-500 capitalize">{marker.severity} severity</span>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
