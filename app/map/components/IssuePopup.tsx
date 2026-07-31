"use client";

import { AlertTriangle, Clock, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";

interface IssuePopupProps {
  id: string;
  title: string;
  category: string;
  priority: "Critical" | "High" | "Medium" | "Resolved";
  confidence: number;
  severity: number;
  department: string;
  status: string;
  timeReported: string;
  imageUrl?: string;
}

const priorityConfig = {
  Critical: { color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
  High: { color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
  Medium: { color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" },
  Resolved: { color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
};

export default function IssuePopup({ 
  id, title, category, priority, confidence, severity, department, status, timeReported, imageUrl 
}: IssuePopupProps) {
  
  const config = priorityConfig[priority];

  return (
    <div className="w-[300px] flex flex-col font-sans -m-1">
      {/* Header Image Area */}
      <div className="w-full h-32 bg-slate-100 rounded-t-lg relative overflow-hidden flex items-center justify-center border-b border-border">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400">
            <span className="text-[10px] uppercase tracking-wider font-bold">No Image Provided</span>
          </div>
        )}
        
        {/* Floating Priority Badge */}
        <div className={cn("absolute top-3 right-3 px-2 py-1 rounded shadow-sm text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md", config.bg, config.color, config.border)}>
          {priority}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 flex flex-col gap-3 bg-white rounded-b-lg">
        
        <div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            {id} • {category}
          </div>
          <h3 className="font-bold text-slate-900 text-sm leading-tight">{title}</h3>
        </div>

        {/* AI Stats Row */}
        <div className="flex gap-2">
          <div className="flex-1 bg-slate-50 border border-slate-100 rounded-md p-2 flex flex-col items-center text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase">AI Conf.</span>
            <span className="text-xs font-bold text-blue-600">{confidence}%</span>
          </div>
          <div className="flex-1 bg-slate-50 border border-slate-100 rounded-md p-2 flex flex-col items-center text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase">Severity</span>
            <span className="text-xs font-bold text-slate-900">{severity}/100</span>
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex flex-col gap-1.5 mt-1">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <AlertTriangle size={14} className="text-slate-400" />
            <span className="font-semibold text-slate-900">{department}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-600">
             <div className="flex items-center gap-2">
                <Clock size={14} className="text-slate-400" />
                <span>{status}</span>
             </div>
             <span className="text-[10px] font-medium">{timeReported}</span>
          </div>
        </div>

        {/* Action Buttons: Connect to Report Page */}
        <div className="flex gap-2 mt-2">
          <button className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-md text-xs font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-1">
            Details
            <ChevronRight size={14} />
          </button>
          <Link
            href="/report"
            className="flex-1 py-2 bg-[#2563EB] text-white rounded-md text-xs font-bold hover:bg-[#1D4ED8] transition-colors flex items-center justify-center gap-1 text-center"
          >
            <Plus size={14} />
            Report Issue
          </Link>
        </div>
      </div>
    </div>
  );
}
