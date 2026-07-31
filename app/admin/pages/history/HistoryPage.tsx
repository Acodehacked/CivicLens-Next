"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  History, Search, Calendar, Download, RefreshCw, CheckCircle2,
  Clock, AlertTriangle, Building2, User, Eye, FileText,
  BrainCircuit, X, Filter, Shield, Edit3, ArrowUpDown
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

type LogStatus = "Resolved" | "In Progress" | "Escalated" | "Rejected";
type LogSeverity = "Critical" | "High" | "Medium" | "Low";
type Actor = "Admin" | "AI System" | "Department Staff";

interface HistoryLog {
  id: string;
  title: string;
  category: string;
  action: string;
  actor: string;
  actorType: Actor;
  time: string;
  timestamp: string;
  severity: LogSeverity;
  aiScore: number;
  status: LogStatus;
  duration: string;
  img: string;
  details: string;
  ward: string;
  reporterEmail: string;
}

const HISTORY_LOGS: HistoryLog[] = [
  {
    id: "REP-105", title: "Fallen Tree on Main Rd", category: "Parks & Tree Maintenance Department",
    action: "Resolved & Closed", actor: "Parks Crew #4", actorType: "Department Staff",
    time: "Today at 2:15 PM", timestamp: "2026-07-31 14:15", severity: "Critical", aiScore: 98,
    status: "Resolved", duration: "1h 45m",
    img: "https://images.unsplash.com/photo-1594950893301-44755f190e22?auto=format&fit=crop&w=150&q=80",
    details: "Tree cleared from roadway, public passage restored safely.",
    ward: "Ward 4", reporterEmail: "alex.m@example.com"
  },
  {
    id: "REP-108", title: "Flash Flood & Waterlogging", category: "Disaster Management & Emergency Response Department",
    action: "Dispatched Emergency Rescue Unit", actor: "AI Auto-Dispatcher", actorType: "AI System",
    time: "Today at 1:30 PM", timestamp: "2026-07-31 13:30", severity: "Critical", aiScore: 95,
    status: "In Progress", duration: "2h 30m",
    img: "https://images.unsplash.com/photo-1541888047913-91ee71212c41?auto=format&fit=crop&w=150&q=80",
    details: "High priority flood emergency unit deployed to drain underpass.",
    ward: "Ward 2", reporterEmail: "sarah.t@example.com"
  },
  {
    id: "REP-104", title: "Pothole — Multi-Car Damage", category: "Road Maintenance Department",
    action: "AI Auto-Categorized & Prioritized", actor: "CivicLens AI Vision", actorType: "AI System",
    time: "Today at 11:40 AM", timestamp: "2026-07-31 11:40", severity: "High", aiScore: 88,
    status: "In Progress", duration: "4h 20m",
    img: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=150&q=80",
    details: "Crater patch crew assigned for afternoon repair window.",
    ward: "Ward 1", reporterEmail: "jane.d@example.com"
  },
  {
    id: "REP-099", title: "Main Drain Overflow & Waterlogging", category: "Drainage & Stormwater Department",
    action: "Marked Resolved", actor: "Drainage Unit 2", actorType: "Department Staff",
    time: "Yesterday at 6:10 PM", timestamp: "2026-07-30 18:10", severity: "Medium", aiScore: 74,
    status: "Resolved", duration: "3h 10m",
    img: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=150&q=80",
    details: "Blocked stormwater conduit cleared with hydro-jet equipment.",
    ward: "Ward 3", reporterEmail: "mike.r@example.com"
  },
  {
    id: "REP-089", title: "Illegal Dump Site in Market Alley", category: "Sanitation & Waste Management Department",
    action: "Cleared & Sanitized", actor: "Sanitation Heavy Unit", actorType: "Department Staff",
    time: "Jul 29 at 3:45 PM", timestamp: "2026-07-29 15:45", severity: "High", aiScore: 81,
    status: "Resolved", duration: "5h 40m",
    img: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=150&q=80",
    details: "Bulk waste removed, location sanitized.",
    ward: "Ward 5", reporterEmail: "priya.n@example.com"
  },
];

const SEVERITY_BADGE: Record<LogSeverity, string> = {
  Critical: "bg-red-50 text-red-700 border-red-200",
  High: "bg-orange-50 text-orange-700 border-orange-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  Low: "bg-blue-50 text-blue-700 border-blue-200",
};
const STATUS_BADGE: Record<LogStatus, { label: string; style: string }> = {
  Resolved: { label: "Resolved", style: "bg-green-50 text-green-700 border-green-200" },
  "In Progress": { label: "In Progress", style: "bg-blue-50 text-blue-700 border-blue-200" },
  Escalated: { label: "Escalated", style: "bg-red-50 text-red-700 border-red-200" },
  Rejected: { label: "Rejected", style: "bg-slate-100 text-slate-600 border-slate-200" },
};
const ACTOR_BADGE: Record<Actor, string> = {
  "Admin": "bg-purple-50 text-purple-700 border-purple-100",
  "AI System": "bg-indigo-50 text-indigo-700 border-indigo-100",
  "Department Staff": "bg-teal-50 text-teal-700 border-teal-100",
};

export default function HistoryPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [actorFilter, setActorFilter] = useState("All");
  const [selectedLog, setSelectedLog] = useState<HistoryLog | null>(null);

  const filteredLogs = HISTORY_LOGS.filter(log => {
    const matchSearch =
      log.title.toLowerCase().includes(search.toLowerCase()) ||
      log.id.toLowerCase().includes(search.toLowerCase()) ||
      log.category.toLowerCase().includes(search.toLowerCase()) ||
      log.actor.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || log.status === statusFilter;
    const matchActor = actorFilter === "All" || log.actorType === actorFilter;
    return matchSearch && matchStatus && matchActor;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 pb-20">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-sm">
                <History size={16} className="text-white" />
              </div>
              <h1 className="text-2xl font-black text-primary tracking-tight">Audit & Activity Log</h1>
              <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-700 text-xs font-bold">
                {HISTORY_LOGS.length} Entries
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Immutable chain-of-custody log of every admin action, AI decision, and official department event.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3.5 py-2 border border-border bg-white rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
              <RefreshCw size={13} /> Refresh
            </button>
            <button className="flex items-center gap-1.5 px-3.5 py-2 border border-border bg-white rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
              <Download size={13} /> Export CSV
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Handled", val: "2,543", sub: "+12% this month", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Avg Resolution", val: "2.4 Days", sub: "−18% response time", icon: Clock, color: "text-green-600", bg: "bg-green-50" },
            { label: "AI Auto-Routed", val: "94.2%", sub: "2,395 issues", icon: BrainCircuit, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Admin Overrides", val: "38", sub: "This month", icon: Shield, color: "text-orange-600", bg: "bg-orange-50" },
          ].map(card => (
            <div key={card.label} className="bg-white rounded-2xl border border-border p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", card.bg, card.color)}>
                  <card.icon size={16} />
                </div>
                <span className="text-[10px] font-bold text-slate-400">{card.sub}</span>
              </div>
              <div className="text-xl font-black text-primary tracking-tight">{card.val}</div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">{card.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search by report ID, title, category, or actor…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 shadow-sm"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-5">
          <span className="text-[11px] font-bold text-slate-400 self-center">Status:</span>
          {["All", "Resolved", "In Progress", "Escalated", "Rejected"].map(st => (
            <button key={st} onClick={() => setStatusFilter(st)}
              className={cn("px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-sm",
                statusFilter === st ? "bg-[#2563EB] text-white border-[#2563EB]" : "bg-white text-slate-600 border-border hover:bg-slate-50"
              )}>
              {st}
            </button>
          ))}
          <span className="text-[11px] font-bold text-slate-400 self-center ml-3">Actor:</span>
          {["All", "Admin", "AI System", "Department Staff"].map(a => (
            <button key={a} onClick={() => setActorFilter(a)}
              className={cn("px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-sm",
                actorFilter === a ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-500 border-border hover:bg-slate-50"
              )}>
              {a}
            </button>
          ))}
        </div>

        {/* Log Table */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
            <h3 className="font-bold text-primary text-base flex items-center gap-2">
              <ArrowUpDown size={15} className="text-slate-400" />
              Audit Trail — {filteredLogs.length} entries
            </h3>
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <Calendar size={13} /> Immutable record
            </span>
          </div>

          <div className="divide-y divide-border/60">
            {filteredLogs.length > 0 ? filteredLogs.map((log, idx) => {
              const sevStyle = SEVERITY_BADGE[log.severity];
              const statStyle = STATUS_BADGE[log.status];
              const actorStyle = ACTOR_BADGE[log.actorType];
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <img src={log.img} alt="" className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 shadow-sm" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-mono text-xs font-bold text-slate-400">{log.id}</span>
                        <span className="font-bold text-primary text-sm truncate">{log.title}</span>
                        <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider", sevStyle)}>{log.severity}</span>
                        <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold border", statStyle.style)}>{statStyle.label}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-medium flex-wrap">
                        <span className="flex items-center gap-1 text-blue-600 font-semibold"><Building2 size={12} />{log.category}</span>
                        <span>•</span>
                        <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1", actorStyle)}>
                          {log.actorType === "Admin" ? <Shield size={10} /> : log.actorType === "AI System" ? <BrainCircuit size={10} /> : <User size={10} />}
                          {log.actor}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-400"><Clock size={12} />{log.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1 font-medium">{log.action}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    <div className="text-right hidden md:block">
                      <div className="text-xs font-bold text-primary">Score {log.aiScore}</div>
                      <div className="text-[10px] text-slate-400 font-medium">Duration: {log.duration}</div>
                    </div>
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors flex items-center gap-1"
                    >
                      <Eye size={13} /> Full Record
                    </button>
                  </div>
                </motion.div>
              );
            }) : (
              <div className="p-12 text-center text-slate-400">
                <History size={36} className="mx-auto mb-2 opacity-50" />
                <p className="font-semibold text-slate-600">No audit logs found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-border shadow-2xl max-w-lg w-full overflow-hidden"
            >
              <div className="p-5 border-b border-border flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-400">{selectedLog.id}</span>
                  <h3 className="font-bold text-primary text-base">{selectedLog.title}</h3>
                </div>
                <button onClick={() => setSelectedLog(null)} className="w-7 h-7 rounded-lg text-slate-400 hover:bg-slate-200 flex items-center justify-center font-bold">
                  <X size={15} />
                </button>
              </div>
              <div className="p-5 space-y-4 text-sm">
                <img src={selectedLog.img} alt="" className="w-full h-40 rounded-xl object-cover border border-slate-200" />
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {[
                    { label: "Assigned Department", val: selectedLog.category },
                    { label: "Executed By", val: selectedLog.actor },
                    { label: "Actor Type", val: selectedLog.actorType },
                    { label: "Timestamp", val: selectedLog.timestamp },
                    { label: "Ward / Zone", val: selectedLog.ward },
                    { label: "AI Score", val: `${selectedLog.aiScore}/100` },
                    { label: "Duration", val: selectedLog.duration },
                    { label: "Reporter", val: selectedLog.reporterEmail },
                  ].map(row => (
                    <div key={row.label} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-slate-400 font-semibold block mb-0.5">{row.label}</span>
                      <span className="font-bold text-primary">{row.val}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="font-bold text-primary text-xs uppercase tracking-wider mb-1">Action Summary</h4>
                  <p className="text-xs text-slate-600 leading-relaxed bg-blue-50/60 border border-blue-100 p-3 rounded-xl">{selectedLog.details}</p>
                </div>
              </div>
              <div className="p-4 border-t border-border bg-slate-50 flex justify-end">
                <button onClick={() => setSelectedLog(null)} className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors">
                  Close Record
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
