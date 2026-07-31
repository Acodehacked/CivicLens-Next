"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  HardHat, Trash2, Droplets, Trees, ShieldAlert, Search,
  CheckCircle2, Clock, AlertOctagon, Mail, BarChart3, ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import type { DepartmentPerformanceRow } from "@/lib/data/analytics";
import type { DepartmentType } from "@/lib/constants/departments";
import { DEPARTMENT_LABELS } from "@/lib/constants/departments";

// Fixed, documented routing rule (see db/schema.ts's departmentTypeEnum
// comment) - not editable data, just what the AI backend actually routes.
const DEPARTMENT_META: Record<DepartmentType, { icon: any; color: string; handles: string[] }> = {
  roads: { icon: HardHat, color: "blue", handles: ["Pothole", "Road Damage"] },
  sanitation: { icon: Trash2, color: "emerald", handles: ["Garbage", "Illegal Dumping"] },
  drainage: { icon: Droplets, color: "cyan", handles: ["Waterlogging", "Blocked Drain"] },
  parks: { icon: Trees, color: "green", handles: ["Fallen Tree", "Tree Hazard"] },
  disaster_management: { icon: ShieldAlert, color: "rose", handles: ["Flood", "Public Safety Hazard"] },
};

const COLOR_MAP: Record<string, { avatar: string; badge: string; bar: string; border: string }> = {
  blue:    { avatar: "from-blue-500 to-blue-700",     badge: "bg-blue-50 text-blue-700 border-blue-100",     bar: "bg-blue-500",    border: "border-blue-200" },
  emerald: { avatar: "from-emerald-500 to-teal-600",  badge: "bg-emerald-50 text-emerald-700 border-emerald-100", bar: "bg-emerald-500", border: "border-emerald-200" },
  cyan:    { avatar: "from-cyan-500 to-blue-500",     badge: "bg-cyan-50 text-cyan-700 border-cyan-100",     bar: "bg-cyan-500",    border: "border-cyan-200" },
  green:   { avatar: "from-green-500 to-emerald-600", badge: "bg-green-50 text-green-700 border-green-100",  bar: "bg-green-500",   border: "border-green-200" },
  rose:    { avatar: "from-rose-500 to-red-600",      badge: "bg-rose-50 text-rose-700 border-rose-100",     bar: "bg-rose-500",    border: "border-rose-200" },
};

function DeptCard({ dept, idx }: { dept: DepartmentPerformanceRow; idx: number }) {
  const [expanded, setExpanded] = useState(false);
  const meta = DEPARTMENT_META[dept.name];
  const c = COLOR_MAP[meta.color];
  const Icon = meta.icon;
  const resolvedPct = dept.assigned > 0 ? Math.round((dept.resolved / dept.assigned) * 100) : 0;

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
          <div className="flex items-start gap-3.5 mb-4">
            <div className={cn("w-12 h-12 rounded-2xl bg-gradient-to-br text-white flex items-center justify-center shrink-0 shadow-sm", c.avatar)}>
              <Icon size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-primary text-base leading-tight truncate">
                {DEPARTMENT_LABELS[dept.name]}
              </h3>
              {dept.contactEmail && (
                <a href={`mailto:${dept.contactEmail}`} className="text-xs text-slate-500 hover:text-[#2563EB] flex items-center gap-1 mt-0.5">
                  <Mail size={11} /> {dept.contactEmail}
                </a>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="bg-slate-50/80 rounded-xl p-2.5 text-center border border-border/50">
              <div className="text-base font-black text-slate-900">{dept.assigned}</div>
              <div className="text-[10px] font-semibold text-slate-400">Assigned</div>
            </div>
            <div className="bg-slate-50/80 rounded-xl p-2.5 text-center border border-border/50">
              <div className="text-base font-black text-green-600">{dept.resolved}</div>
              <div className="text-[10px] font-semibold text-slate-400">Resolved</div>
            </div>
            <div className="bg-slate-50/80 rounded-xl p-2.5 text-center border border-border/50">
              <div className="text-base font-black text-amber-600">{dept.pending}</div>
              <div className="text-[10px] font-semibold text-slate-400">Pending</div>
            </div>
            <div className="bg-slate-50/80 rounded-xl p-2.5 text-center border border-border/50">
              <div className="text-base font-black text-red-600">{dept.critical}</div>
              <div className="text-[10px] font-semibold text-slate-400">Critical</div>
            </div>
          </div>

          <div className="mb-2">
            <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1.5">
              <span>Resolution Rate</span>
              <span className="text-primary font-bold">{resolvedPct}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className={cn("h-full rounded-full transition-all", c.bar)} style={{ width: `${resolvedPct}%` }} />
            </div>
          </div>

          {dept.avgResolutionHours != null && (
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mt-2">
              <Clock size={11} /> Target resolution: <strong className="text-primary">{dept.avgResolutionHours}h</strong>
            </div>
          )}

          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-border/60 pt-4 mt-3 flex flex-col gap-3"
            >
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">AI-Routed Issue Types</div>
                <div className="flex flex-wrap gap-1.5">
                  {meta.handles.map((cat) => (
                    <span key={cat} className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold border", c.badge)}>{cat}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="px-5 py-3.5 bg-slate-50/80 border-t border-border/50 flex items-center justify-between gap-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[11px] font-semibold text-slate-500 hover:text-primary transition-colors flex items-center gap-1"
        >
          {expanded ? "Less Info" : "More Info"}
        </button>
        <Link
          href="/admin/issues"
          className="px-3 py-1.5 text-[11px] font-bold text-white bg-[#2563EB] rounded-lg hover:bg-[#1D4ED8] transition-all flex items-center gap-1 shadow-sm"
        >
          View Reports <ArrowRight size={11} />
        </Link>
      </div>
    </motion.div>
  );
}

export default function DepartmentsPage({ departments }: { departments: DepartmentPerformanceRow[] }) {
  const [search, setSearch] = useState("");

  const filtered = departments.filter(
    (d) =>
      DEPARTMENT_LABELS[d.name].toLowerCase().includes(search.toLowerCase()) ||
      DEPARTMENT_META[d.name].handles.some((c) => c.toLowerCase().includes(search.toLowerCase()))
  );

  const totalAssigned = departments.reduce((a, d) => a + d.assigned, 0);
  const totalResolved = departments.reduce((a, d) => a + d.resolved, 0);
  const totalPending = departments.reduce((a, d) => a + d.pending, 0);
  const totalCritical = departments.reduce((a, d) => a + d.critical, 0);

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 pb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-sm">
                <BarChart3 size={16} className="text-white" />
              </div>
              <h1 className="text-2xl font-black text-primary tracking-tight">Municipal Department Directory</h1>
              <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-700 text-xs font-bold">
                {departments.length} Official Departments
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Official municipal response departments aligned with AI vision classification and citizen reporting categories.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Reports Assigned", value: totalAssigned, icon: BarChart3, color: "text-blue-600" },
            { label: "Total Resolved", value: totalResolved, icon: CheckCircle2, color: "text-green-600" },
            { label: "Pending Workload", value: totalPending, icon: Clock, color: "text-amber-500" },
            { label: "Critical Escalations", value: totalCritical, icon: AlertOctagon, color: "text-red-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-border shadow-sm px-4 py-3 flex items-center gap-3">
              <s.icon size={20} className={cn("shrink-0", s.color)} />
              <div>
                <div className="text-lg font-black text-primary">{s.value}</div>
                <div className="text-[11px] font-semibold text-slate-400">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input
            type="text"
            placeholder="Search by department name or category (e.g. Potholes, Waterlogging, Floods)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded-xl text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((dept, idx) => (
            <DeptCard key={dept.name} dept={dept} idx={idx} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-border">
            <p className="font-bold text-slate-600">No departments match your search</p>
          </div>
        )}
      </div>
    </div>
  );
}
