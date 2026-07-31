"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HardHat, Trash2, Droplets, Trees, ShieldAlert, Search, Users,
  CheckCircle2, Clock, AlertOctagon, TrendingUp, TrendingDown,
  Minus, Phone, Mail, MapPin, ChevronRight, BarChart3, RefreshCw,
  Download, Plus, Edit3, X, Save, ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";

export interface Department {
  id: number;
  name: string;
  shortName: string;
  color: string;
  icon: any;
  head: string;
  email: string;
  phone: string;
  location: string;
  open: number;
  resolved: number;
  critical: number;
  avgDays: number;
  score: number;
  trend: "up" | "down" | "flat";
  workload: "Low" | "Medium" | "High";
  status: "Active" | "Busy" | "Offline";
  categories: string[];
  description: string;
  slaHours: { critical: number; high: number; medium: number; low: number };
  staffCount: number;
  active: boolean;
}

export const OFFICIAL_DEPARTMENTS: Department[] = [
  {
    id: 1,
    name: "Road Maintenance Department",
    shortName: "RM",
    color: "blue",
    icon: HardHat,
    head: "Robert Chen",
    email: "roads@city.gov",
    phone: "555-0101",
    location: "Public Infrastructure Works Depot",
    open: 42,
    resolved: 156,
    critical: 5,
    avgDays: 2.4,
    score: 92,
    trend: "up",
    workload: "High",
    status: "Busy",
    categories: ["Potholes", "Road damage", "Road inspections"],
    description: "Handles potholes, road damage repair, and routine municipal road inspections.",
    slaHours: { critical: 4, high: 24, medium: 72, low: 168 },
    staffCount: 34,
    active: true,
  },
  {
    id: 2,
    name: "Sanitation & Waste Management Department",
    shortName: "SW",
    color: "emerald",
    icon: Trash2,
    head: "Priya Sharma",
    email: "sanitation@city.gov",
    phone: "555-0102",
    location: "Municipal Waste Depot B",
    open: 18,
    resolved: 210,
    critical: 2,
    avgDays: 1.1,
    score: 96,
    trend: "up",
    workload: "Low",
    status: "Active",
    categories: ["Garbage", "Illegal dumping", "Street cleaning"],
    description: "Handles garbage collection, clearing illegal dumping sites, and municipal street cleaning.",
    slaHours: { critical: 4, high: 12, medium: 48, low: 120 },
    staffCount: 48,
    active: true,
  },
  {
    id: 3,
    name: "Drainage & Stormwater Department",
    shortName: "DS",
    color: "cyan",
    icon: Droplets,
    head: "Maria Lopez",
    email: "drainage@city.gov",
    phone: "555-0104",
    location: "Water & Utilities Control Hub",
    open: 31,
    resolved: 120,
    critical: 6,
    avgDays: 2.8,
    score: 88,
    trend: "flat",
    workload: "Medium",
    status: "Active",
    categories: ["Waterlogging", "Blocked drains", "Stormwater infrastructure"],
    description: "Handles waterlogging remediation, unblocking urban drains, and maintaining stormwater infrastructure.",
    slaHours: { critical: 2, high: 12, medium: 48, low: 120 },
    staffCount: 29,
    active: true,
  },
  {
    id: 4,
    name: "Parks & Tree Maintenance Department",
    shortName: "PT",
    color: "green",
    icon: Trees,
    head: "David Kim",
    email: "parks@city.gov",
    phone: "555-0105",
    location: "Urban Forestry & Green Division",
    open: 15,
    resolved: 93,
    critical: 3,
    avgDays: 1.9,
    score: 94,
    trend: "up",
    workload: "Low",
    status: "Active",
    categories: ["Fallen Trees", "Tree removal", "Tree maintenance"],
    description: "Handles fallen trees during storms, emergency tree removals, and routine arboreal maintenance.",
    slaHours: { critical: 4, high: 24, medium: 96, low: 240 },
    staffCount: 22,
    active: true,
  },
  {
    id: 5,
    name: "Disaster Management & Emergency Response Department",
    shortName: "DM",
    color: "rose",
    icon: ShieldAlert,
    head: "Commander James Vance",
    email: "disaster@city.gov",
    phone: "555-0199",
    location: "City Emergency Operations Center (EOC)",
    open: 8,
    resolved: 74,
    critical: 4,
    avgDays: 0.8,
    score: 98,
    trend: "up",
    workload: "High",
    status: "Busy",
    categories: ["Floods", "Emergency response", "Public safety incidents"],
    description: "Handles major floods, high-urgency emergency responses, and multi-agency public safety hazards.",
    slaHours: { critical: 1, high: 4, medium: 12, low: 48 },
    staffCount: 50,
    active: true,
  },
];

const COLOR_MAP: Record<string, { avatar: string; badge: string; bar: string; border: string }> = {
  blue:    { avatar: "from-blue-500 to-blue-700",    badge: "bg-blue-50 text-blue-700 border-blue-100",     bar: "bg-blue-500",    border: "border-blue-200" },
  emerald: { avatar: "from-emerald-500 to-teal-600", badge: "bg-emerald-50 text-emerald-700 border-emerald-100", bar: "bg-emerald-500", border: "border-emerald-200" },
  cyan:    { avatar: "from-cyan-500 to-blue-500",    badge: "bg-cyan-50 text-cyan-700 border-cyan-100",     bar: "bg-cyan-500",    border: "border-cyan-200" },
  green:   { avatar: "from-green-500 to-emerald-600",badge: "bg-green-50 text-green-700 border-green-100",  bar: "bg-green-500",   border: "border-green-200" },
  rose:    { avatar: "from-rose-500 to-red-600",     badge: "bg-rose-50 text-rose-700 border-rose-100",     bar: "bg-rose-500",    border: "border-rose-200" },
};

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "up")   return <TrendingUp  size={12} className="text-green-500" />;
  if (trend === "down") return <TrendingDown size={12} className="text-red-400" />;
  return <Minus size={12} className="text-slate-400" />;
}

function DeptCard({ dept, idx, onEdit }: { dept: Department; idx: number; onEdit: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const c = COLOR_MAP[dept.color] ?? COLOR_MAP.blue;
  const totalAssigned = dept.resolved + dept.open;
  const resolvedPct = Math.round((dept.resolved / totalAssigned) * 100);
  const IconComponent = dept.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05, duration: 0.3 }}
      className={cn(
        "bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col justify-between",
        expanded ? c.border : "border-border"
      )}
    >
      <div>
        <div className={cn("h-[3px]", c.bar)} />
        <div className="p-5">
          {/* Header & Status */}
          <div className="flex items-start gap-3.5 mb-4">
            <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm", c.avatar)}>
              <IconComponent size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-primary text-base leading-tight truncate">{dept.name}</h3>
                <div className="flex items-center gap-1 shrink-0">
                  <TrendIcon trend={dept.trend} />
                  <span className="text-sm font-black text-slate-700">{dept.score}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">/100</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{dept.description}</p>
            </div>
          </div>

          {/* Workload & Status Badges */}
          <div className="flex items-center justify-between gap-2 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status:</span>
              <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1.5 border",
                dept.status === "Active" ? "bg-green-50 text-green-700 border-green-200" :
                dept.status === "Busy" ? "bg-amber-50 text-amber-700 border-amber-200" :
                "bg-slate-100 text-slate-600 border-slate-200"
              )}>
                <span className={cn("w-1.5 h-1.5 rounded-full",
                  dept.status === "Active" ? "bg-green-500" : dept.status === "Busy" ? "bg-amber-500 animate-pulse" : "bg-slate-400"
                )} />
                {dept.status}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Workload:</span>
              <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-extrabold border",
                dept.workload === "High" ? "bg-red-50 text-red-700 border-red-200" :
                dept.workload === "Medium" ? "bg-amber-50 text-amber-700 border-amber-200" :
                "bg-blue-50 text-blue-700 border-blue-200"
              )}>
                {dept.workload}
              </span>
            </div>
          </div>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="bg-slate-50/80 rounded-xl p-2.5 text-center border border-border/50">
              <div className="text-base font-black text-slate-900">{totalAssigned}</div>
              <div className="text-[10px] font-semibold text-slate-400">Assigned</div>
            </div>
            <div className="bg-slate-50/80 rounded-xl p-2.5 text-center border border-border/50">
              <div className="text-base font-black text-green-600">{dept.resolved}</div>
              <div className="text-[10px] font-semibold text-slate-400">Resolved</div>
            </div>
            <div className="bg-slate-50/80 rounded-xl p-2.5 text-center border border-border/50">
              <div className="text-base font-black text-amber-600">{dept.open}</div>
              <div className="text-[10px] font-semibold text-slate-400">Pending</div>
            </div>
            <div className="bg-slate-50/80 rounded-xl p-2.5 text-center border border-border/50">
              <div className="text-base font-black text-red-600">{dept.critical}</div>
              <div className="text-[10px] font-semibold text-slate-400">Critical</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1.5">
              <span>Resolution Rate</span>
              <span className="text-primary font-bold">{resolvedPct}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className={cn("h-full rounded-full transition-all", c.bar)} style={{ width: `${resolvedPct}%` }} />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mt-2 mb-2">
            <span className="flex items-center gap-1"><Clock size={11} /> Avg Resolution: <strong className="text-primary">{dept.avgDays} days</strong></span>
            <span className="flex items-center gap-1"><Users size={11} /> Head: <strong className="text-slate-700">{dept.head}</strong></span>
          </div>

          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-border/60 pt-4 mt-3 flex flex-col gap-3"
            >
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">AI-Mapped Issues Handled</div>
                <div className="flex flex-wrap gap-1.5">
                  {dept.categories.map(cat => (
                    <span key={cat} className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold border", c.badge)}>{cat}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1.5 text-[11px] text-slate-500">
                <div className="flex items-center gap-2"><Mail size={11} />{dept.email}</div>
                <div className="flex items-center gap-2"><Phone size={11} />{dept.phone}</div>
                <div className="flex items-center gap-2"><MapPin size={11} />{dept.location}</div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="px-5 py-3.5 bg-slate-50/80 border-t border-border/50 flex items-center justify-between gap-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[11px] font-semibold text-slate-500 hover:text-primary transition-colors flex items-center gap-1"
        >
          <ChevronRight size={12} className={cn("transition-transform", expanded && "rotate-90")} />
          {expanded ? "Less Info" : "More Info"}
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-all flex items-center gap-1"
          >
            <Edit3 size={11} /> Edit
          </button>
          <Link
            href={`/admin/priority-queue?dept=${encodeURIComponent(dept.name)}`}
            className="px-3 py-1.5 text-[11px] font-bold text-white bg-[#2563EB] rounded-lg hover:bg-[#1D4ED8] transition-all flex items-center gap-1 shadow-sm"
          >
            View Assigned Reports <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>(OFFICIAL_DEPARTMENTS);
  const [search, setSearch] = useState("");
  const [editTarget, setEditTarget] = useState<Department | null>(null);

  const filtered = departments.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.head.toLowerCase().includes(search.toLowerCase()) ||
    d.categories.some(c => c.toLowerCase().includes(search.toLowerCase()))
  );

  const totalAssigned = departments.reduce((a, d) => a + d.resolved + d.open, 0);
  const totalResolved = departments.reduce((a, d) => a + d.resolved, 0);
  const totalPending  = departments.reduce((a, d) => a + d.open, 0);
  const totalCritical = departments.reduce((a, d) => a + d.critical, 0);

  const handleSave = (updated: Department) =>
    setDepartments(prev => prev.map(d => d.id === updated.id ? updated : d));

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 pb-16">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-sm">
                <BarChart3 size={16} className="text-white" />
              </div>
              <h1 className="text-2xl font-black text-primary tracking-tight">Municipal Department Directory</h1>
              <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-700 text-xs font-bold">
                5 Official Departments
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Official municipal response departments aligned with AI vision classification and citizen reporting categories.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 border border-border bg-white rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
              <RefreshCw size={13} /> Refresh
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 border border-border bg-white rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
              <Download size={13} /> Export Report
            </button>
          </div>
        </div>

        {/* KPI Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Reports Assigned", value: totalAssigned, icon: BarChart3, color: "text-blue-600" },
            { label: "Total Resolved", value: totalResolved, icon: CheckCircle2, color: "text-green-600" },
            { label: "Pending Workload", value: totalPending, icon: Clock, color: "text-amber-500" },
            { label: "Critical Escalations", value: totalCritical, icon: AlertOctagon, color: "text-red-600" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl border border-border shadow-sm px-4 py-3 flex items-center gap-3">
              <s.icon size={20} className={cn("shrink-0", s.color)} />
              <div>
                <div className="text-lg font-black text-primary">{s.value}</div>
                <div className="text-[11px] font-semibold text-slate-400">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input
            type="text"
            placeholder="Search by department name, category (e.g. Potholes, Waterlogging, Floods)..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 shadow-sm"
          />
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((dept, idx) => (
            <DeptCard
              key={dept.id}
              dept={dept}
              idx={idx}
              onEdit={() => setEditTarget(dept)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
