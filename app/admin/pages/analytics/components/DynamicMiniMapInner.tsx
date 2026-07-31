"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const hotspots = [
  { id: 1, lat: 10.8505, lng: 76.2711, label: "Ward 5 — Potholes Cluster", count: 89, color: "#EF4444", radius: 18 },
  { id: 2, lat: 10.8550, lng: 76.2780, label: "Sector 4 — Garbage Overflow", count: 42, color: "#F59E0B", radius: 14 },
  { id: 3, lat: 10.8420, lng: 76.2650, label: "Arterial Road — Waterlogging", count: 35, color: "#3B82F6", radius: 12 },
  { id: 4, lat: 10.8600, lng: 76.2690, label: "Central Market — Streetlights", count: 24, color: "#3B82F6", radius: 10 },
];

export default function DynamicMiniMapInner() {
  return (
    <MapContainer
      center={[10.8505, 76.2711]}
      zoom={13}
      scrollWheelZoom={false}
      zoomControl={false}
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {hotspots.map((spot) => (
        <CircleMarker
          key={spot.id}
          center={[spot.lat, spot.lng]}
          radius={spot.radius}
          pathOptions={{
            color: spot.color,
            fillColor: spot.color,
            fillOpacity: 0.5,
            weight: 2,
          }}
        >
          <Popup>
            <div className="p-1 text-xs font-sans">
              <strong className="block text-slate-900 font-bold mb-0.5">{spot.label}</strong>
              <span className="text-slate-500">{spot.count} active reports</span>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
