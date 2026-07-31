"use client";

import { MapPin } from "lucide-react";
import type { TopLocationRow } from "@/lib/data/analytics";

export default function TopLocationsTable({ locations }: { locations: TopLocationRow[] }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Top Reported Locations</h2>
          <p className="text-xs text-slate-500">Addresses with the highest cumulative complaint density</p>
        </div>
      </div>

      {locations.length === 0 ? (
        <div className="py-10 text-center text-sm text-slate-400 font-medium">No reports yet</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Location</th>
                <th className="py-3 px-3 text-center">Complaints</th>
                <th className="py-3 px-3 text-center">Total Reports</th>
                <th className="py-3 px-3 text-right">Max Priority Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {locations.map((row) => (
                <tr key={row.addressText} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-[#2563EB] shrink-0" />
                      <span>{row.addressText}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="font-extrabold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded-full border border-[#BFDBFE]">
                      {row.complaintCount}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center text-slate-700 font-semibold">{row.totalReports}</td>
                  <td className="py-3 px-3 text-right text-slate-700 font-semibold">{row.maxPriority.toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
