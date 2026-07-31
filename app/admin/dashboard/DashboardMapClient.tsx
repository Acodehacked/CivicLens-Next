"use client";

import dynamic from "next/dynamic";
import type { MapMarker } from "@/lib/data/analytics";

const DynamicDashboardMap = dynamic(() => import("../components/DashboardMap"), {
  ssr: false,
});

export default function DashboardMapClient({ markers }: { markers: MapMarker[] }) {
  return <DynamicDashboardMap markers={markers} />;
}
