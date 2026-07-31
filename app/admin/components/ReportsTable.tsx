"use client";

import { Search, SlidersHorizontal, ChevronDown, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const mockReports = [
  {
    id: "REP-104",
    img: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=100&q=80",
    category: "Pothole",
    severity: "High",
    status: "Open",
    dept: "Road Maintenance Department",
    reporter: "Jane D.",
    time: "10m ago"
  },
  {
    id: "REP-105",
    img: "https://images.unsplash.com/photo-1594950893301-44755f190e22?auto=format&fit=crop&w=100&q=80",
    category: "Fallen Tree",
    severity: "Critical",
    status: "In Progress",
    dept: "Parks & Tree Maintenance Department",
    reporter: "Alex M.",
    time: "45m ago"
  },
  {
    id: "REP-108",
    img: "https://images.unsplash.com/photo-1541888047913-91ee71212c41?auto=format&fit=crop&w=100&q=80",
    category: "Flood",
    severity: "Critical",
    status: "In Progress",
    dept: "Disaster Management & Emergency Response Department",
    reporter: "Sarah T.",
    time: "1h ago"
  },
  {
    id: "REP-112",
    img: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=100&q=80",
    category: "Waterlogging",
    severity: "High",
    status: "Open",
    dept: "Drainage & Stormwater Department",
    reporter: "Mike R.",
    time: "2h ago"
  },
  {
    id: "REP-119",
    img: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=100&q=80",
    category: "Garbage",
    severity: "Medium",
    status: "Resolved",
    dept: "Sanitation & Waste Management Department",
    reporter: "Priya N.",
    time: "4h ago"
  },
];

export default function ReportsTable() {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col col-span-1 xl:col-span-2">
      {/* Table Header / Controls */}
      <div className="p-5 border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-primary">Recent Reports</h3>
          <p className="text-[11px] font-semibold text-slate-400">Live feed of AI-routed civic issues</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Search reports..." 
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button className="p-1.5 border border-slate-200 bg-white rounded-lg text-slate-500 hover:bg-slate-50 transition-colors">
            <SlidersHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-border/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="px-5 py-3 font-bold">Report Category</th>
              <th className="px-5 py-3 font-bold">Severity</th>
              <th className="px-5 py-3 font-bold">Status</th>
              <th className="px-5 py-3 font-bold">Assigned Department</th>
              <th className="px-5 py-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {mockReports.map((report) => (
              <tr key={report.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <img src={report.img} alt="" className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                    <div>
                      <div className="text-sm font-bold text-primary">{report.category}</div>
                      <div className="text-xs text-slate-400">{report.id} • {report.time}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className={cn(
                    "inline-flex px-2 py-0.5 rounded text-[10px] font-bold border",
                    report.severity === "Critical" ? "bg-red-50 text-red-700 border-red-100" :
                    report.severity === "High" ? "bg-orange-50 text-orange-700 border-orange-100" :
                    report.severity === "Medium" ? "bg-yellow-50 text-yellow-700 border-yellow-100" :
                    "bg-blue-50 text-blue-700 border-blue-100"
                  )}>
                    {report.severity}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      report.status === "Open" ? "bg-blue-500" :
                      report.status === "In Progress" ? "bg-orange-500 animate-pulse" :
                      "bg-green-500"
                    )} />
                    {report.status}
                  </div>
                </td>
                <td className="px-5 py-3 text-xs font-semibold text-[#2563EB]">
                  {report.dept}
                </td>
                <td className="px-5 py-3 text-right">
                  <button className="p-1.5 text-slate-400 hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer */}
      <div className="p-3 border-t border-border bg-slate-50/50 flex justify-center mt-auto">
        <button className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1">
          View All Reports <ChevronDown size={14} />
        </button>
      </div>
    </div>
  );
}
