"use client";

import { MapPin, ChevronRight } from "lucide-react";
import Link from "next/link";

interface LocationRow {
  id: string;
  location: string;
  category: string;
  reports: number;
  severity: "Critical" | "High" | "Medium" | "Low";
  department: string;
  status: string;
}

const tableData: LocationRow[] = [
  {
    id: "LOC-01",
    location: "Ward 5 — MG Road School Crossing",
    category: "Pothole",
    reports: 34,
    severity: "Critical",
    department: "Road Maintenance",
    status: "Routed to Crew",
  },
  {
    id: "LOC-02",
    location: "Sector 4 — Park Street Dumpster",
    category: "Garbage Overflow",
    reports: 28,
    severity: "High",
    department: "Sanitation",
    status: "In Progress",
  },
  {
    id: "LOC-03",
    location: "North Underpass — Arterial Ring",
    category: "Waterlogging",
    reports: 19,
    severity: "High",
    department: "Drainage Board",
    status: "Inspecting",
  },
  {
    id: "LOC-04",
    location: "Hill Avenue — Lighting Grid B",
    category: "Streetlight",
    reports: 14,
    severity: "Medium",
    department: "Electricity Board",
    status: "Scheduled",
  },
  {
    id: "LOC-05",
    location: "South Avenue — Public Garden Gate",
    category: "Fallen Tree",
    reports: 9,
    severity: "Medium",
    department: "Parks & Property",
    status: "Assigned",
  },
];

const severityBadges = {
  Critical: "bg-red-50 text-red-600 border-red-200",
  High: "bg-amber-50 text-amber-600 border-amber-200",
  Medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Low: "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]",
};

export default function TopLocationsTable() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900" style={{ fontFamily: "var(--font-heading)" }}>
            Top Reported Locations
          </h2>
          <p className="text-xs text-slate-500" style={{ fontFamily: "var(--font-body)" }}>
            Infrastructure hot spots with highest cumulative complaint density
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
              <th className="py-3 px-3">Location</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3 text-center">Reports</th>
              <th className="py-3 px-3">Highest Severity</th>
              <th className="py-3 px-3">Department</th>
              <th className="py-3 px-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tableData.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="py-3 px-3 font-semibold text-slate-900">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#2563EB] shrink-0" />
                    <span>{row.location}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-slate-600 font-medium">{row.category}</td>
                <td className="py-3 px-3 text-center">
                  <span className="font-extrabold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded-full border border-[#BFDBFE]">
                    {row.reports}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-0.5 rounded-full font-bold border text-[10px] uppercase ${severityBadges[row.severity]}`}>
                    {row.severity}
                  </span>
                </td>
                <td className="py-3 px-3 text-slate-700 font-medium">{row.department}</td>
                <td className="py-3 px-3 text-right text-slate-500 font-medium">
                  {row.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
