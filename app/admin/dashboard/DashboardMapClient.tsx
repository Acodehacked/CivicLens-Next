"use client";

import dynamic from "next/dynamic";

const DynamicDashboardMap = dynamic(() => import("../components/DashboardMap"), {
  ssr: false,
});

export default function DashboardMapClient() {
  return <DynamicDashboardMap />;
}
