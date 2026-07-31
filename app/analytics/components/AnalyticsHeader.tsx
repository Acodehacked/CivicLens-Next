"use client";

import { useState } from "react";
import { RefreshCw, Download, Calendar, Clock, FileSpreadsheet, FileText, Check } from "lucide-react";
import { format } from "date-fns";

export default function AnalyticsHeader({
  onRefresh,
  isRefreshing,
}: {
  onRefresh: () => void;
  isRefreshing: boolean;
}) {
  const [exportOpen, setExportOpen] = useState(false);
  const [exportedFormat, setExportedFormat] = useState<string | null>(null);

  const currentDate = format(new Date(), "MMM dd, yyyy");

  const handleExport = (type: "CSV" | "PDF") => {
    setExportedFormat(type);
    setExportOpen(false);
    setTimeout(() => setExportedFormat(null), 3000);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] text-xs font-bold uppercase tracking-wider">
            City Intelligence
          </span>
          <span className="text-xs text-slate-400 font-medium">Real-Time Data</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
          Analytics
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl mt-1 leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
          Monitor city-wide civic issues, reporting trends, AI performance, and department efficiency through real-time insights.
        </p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 shrink-0 flex-wrap">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 shadow-sm">
          <Calendar size={14} className="text-[#2563EB]" />
          <span className="font-semibold">{currentDate}</span>
          <span className="text-slate-300">|</span>
          <Clock size={14} className="text-slate-400" />
          <span className="text-slate-500">Updated 2m ago</span>
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm active:scale-95 disabled:opacity-50"
          title="Refresh analytics data"
          aria-label="Refresh data"
        >
          <RefreshCw size={14} className={isRefreshing ? "animate-spin text-[#2563EB]" : "text-slate-500"} />
          <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
        </button>

        {/* Export Dropdown */}
        <div className="relative">
          <button
            onClick={() => setExportOpen(!exportOpen)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-semibold shadow-sm hover:bg-[#1D4ED8] transition-all active:scale-95"
            aria-expanded={exportOpen}
            aria-label="Export analytics report"
          >
            {exportedFormat ? (
              <>
                <Check size={14} />
                <span>Exported {exportedFormat}</span>
              </>
            ) : (
              <>
                <Download size={14} />
                <span>Export</span>
              </>
            )}
          </button>

          {exportOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1.5 animate-in fade-in zoom-in-95">
              <button
                onClick={() => handleExport("CSV")}
                className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-[#EFF6FF] hover:text-[#2563EB] flex items-center gap-2 transition-colors"
              >
                <FileSpreadsheet size={14} className="text-slate-400" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => handleExport("PDF")}
                className="w-full px-3.5 py-2 text-left text-xs font-medium text-slate-700 hover:bg-[#EFF6FF] hover:text-[#2563EB] flex items-center gap-2 transition-colors"
              >
                <FileText size={14} className="text-slate-400" />
                <span>Export PDF Report</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
