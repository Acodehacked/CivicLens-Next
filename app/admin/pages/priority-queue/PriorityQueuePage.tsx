"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle, Search, Filter, RefreshCw, Download, CheckCircle2,
  Clock, MapPin, Building2, User, Zap, Eye, ChevronDown, X,
  UserCheck, Ban, MessageSquare, ArrowUpDown, CheckSquare, Square,
  Send, ShieldAlert, Sparkles, BrainCircuit, Info
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useSearchParams } from "next/navigation";

// ─── Constants ────────────────────────────────────────────────────────────────
export const OFFICIAL_DEPT_NAMES = [
  "Road Maintenance Department",
  "Sanitation & Waste Management Department",
  "Drainage & Stormwater Department",
  "Parks & Tree Maintenance Department",
  "Disaster Management & Emergency Response Department",
] as const;

export type OfficialDepartment = typeof OFFICIAL_DEPT_NAMES[number];

export const AI_CATEGORY_MAPPING: Record<string, OfficialDepartment> = {
  Pothole: "Road Maintenance Department",
  "Road Damage": "Road Maintenance Department",
  Garbage: "Sanitation & Waste Management Department",
  "Illegal Dumping": "Sanitation & Waste Management Department",
  Waterlogging: "Drainage & Stormwater Department",
  "Blocked Drain": "Drainage & Stormwater Department",
  "Fallen Tree": "Parks & Tree Maintenance Department",
  "Tree Hazard": "Parks & Tree Maintenance Department",
  Flood: "Disaster Management & Emergency Response Department",
  "Public Safety Hazard": "Disaster Management & Emergency Response Department",
};

export interface PriorityReport {
  id: string;
  title: string;
  category: string;
  dept: OfficialDepartment;
  severity: "Critical" | "High" | "Medium" | "Low";
  score: number;
  aiConfidence: number;
  estimatedResolutionTime: string;
  aiReasoning: string;
  location: string;
  ward: string;
  reporter: string;
  reporterEmail: string;
  time: string;
  status: "Unassigned" | "Assigned" | "In Progress" | "Resolved" | "Rejected";
  assignedOfficer: string | null;
  description: string;
  img: string;
  adminNote: string;
}

const INITIAL_REPORTS: PriorityReport[] = [
  {
    id: "REP-105",
    title: "Large Fallen Tree Blocking Main Arterial Road",
    category: "Fallen Tree",
    dept: "Parks & Tree Maintenance Department",
    severity: "Critical",
    score: 98,
    aiConfidence: 96,
    estimatedResolutionTime: "2 Hours",
    aiReasoning: "YOLOv11 identified a multi-branch trunk blocking 2 lanes with high collision risk during peak commute hours.",
    location: "Main Rd & 4th Ave, Ward 4",
    ward: "Ward 4",
    reporter: "Alex M.",
    reporterEmail: "alex.m@example.com",
    time: "45m ago",
    status: "Unassigned",
    assignedOfficer: null,
    description: "Large oak tree collapsed across dual lanes blocking emergency vehicle passage.",
    img: "https://images.unsplash.com/photo-1594950893301-44755f190e22?auto=format&fit=crop&w=150&q=80",
    adminNote: "",
  },
  {
    id: "REP-108",
    title: "Flash Flood & Severe Street Waterlogging",
    category: "Flood",
    dept: "Disaster Management & Emergency Response Department",
    severity: "Critical",
    score: 95,
    aiConfidence: 99,
    estimatedResolutionTime: "1 Hour",
    aiReasoning: "Deep water accumulation (>30cm) detected by satellite vision; severe public safety emergency.",
    location: "Downtown Underpass, Ward 2",
    ward: "Ward 2",
    reporter: "Sarah T.",
    reporterEmail: "sarah.t@example.com",
    time: "1h ago",
    status: "Assigned",
    assignedOfficer: "Cmdr. Vance",
    description: "Flash flood submerging vehicles at low-lying underpass.",
    img: "https://images.unsplash.com/photo-1541888047913-91ee71212c41?auto=format&fit=crop&w=150&q=80",
    adminNote: "Emergency response vehicle dispatched.",
  },
  {
    id: "REP-104",
    title: "Deep Pothole Causing Vehicle Damage",
    category: "Pothole",
    dept: "Road Maintenance Department",
    severity: "High",
    score: 88,
    aiConfidence: 94,
    estimatedResolutionTime: "6 Hours",
    aiReasoning: "Computer vision classified rim-damaging asphalt crater (depth ~15cm) on heavy transit corridor.",
    location: "Elm St, Near Bus Stop 12",
    ward: "Ward 1",
    reporter: "Jane D.",
    reporterEmail: "jane.d@example.com",
    time: "2h ago",
    status: "In Progress",
    assignedOfficer: "Tech. R. Chen",
    description: "Pothole causing immediate tire blowout risk for commuters.",
    img: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=150&q=80",
    adminNote: "",
  },
  {
    id: "REP-112",
    title: "Severe Drainage Overflow & Waterlogging",
    category: "Waterlogging",
    dept: "Drainage & Stormwater Department",
    severity: "High",
    score: 82,
    aiConfidence: 91,
    estimatedResolutionTime: "4 Hours",
    aiReasoning: "Sub-surface main drain blockage causing localized street flooding and sidewalk overflow.",
    location: "Oak Lane, Ward 3",
    ward: "Ward 3",
    reporter: "Mike R.",
    reporterEmail: "mike.r@example.com",
    time: "2.5h ago",
    status: "Unassigned",
    assignedOfficer: null,
    description: "Stormwater drain backed up spilling murky water into commercial storefronts.",
    img: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=150&q=80",
    adminNote: "",
  },
  {
    id: "REP-119",
    title: "Overflowing Commercial Dumpster & Illegal Dumping",
    category: "Garbage",
    dept: "Sanitation & Waste Management Department",
    severity: "Medium",
    score: 64,
    aiConfidence: 89,
    estimatedResolutionTime: "12 Hours",
    aiReasoning: "Uncollected solid waste cluttering public walkway, hygiene hazard level medium.",
    location: "City Market Alley, Ward 5",
    ward: "Ward 5",
    reporter: "Priya N.",
    reporterEmail: "priya.n@example.com",
    time: "4h ago",
    status: "Unassigned",
    assignedOfficer: null,
    description: "Multiple garbage bags piled outside designated bin container.",
    img: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=150&q=80",
    adminNote: "",
  },
];

export default function PriorityQueuePage() {
  const searchParams = useSearchParams();
  const deptQuery = searchParams.get("dept");

  const [reports, setReports] = useState<PriorityReport[]>(INITIAL_REPORTS);
  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState<string>(deptQuery || "All");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (deptQuery) {
      setSelectedDept(deptQuery);
    }
  }, [deptQuery]);

  const filtered = reports.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = r.title.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) || r.category.toLowerCase().includes(q);
    const matchDept = selectedDept === "All" || r.dept === selectedDept;
    const matchSev = selectedSeverity === "All" || r.severity === selectedSeverity;
    const matchStat = selectedStatus === "All" || r.status === selectedStatus;
    return matchSearch && matchDept && matchSev && matchStat;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 pb-16">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-red-500 rounded-xl flex items-center justify-center shadow-sm">
                <AlertTriangle size={16} className="text-white" />
              </div>
              <h1 className="text-2xl font-black text-primary tracking-tight">AI Priority Queue</h1>
              <span className="px-2.5 py-0.5 rounded-md bg-red-100 text-red-700 text-xs font-bold">
                {reports.filter(r => r.status === "Unassigned").length} Pending Dispatch
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              AI-scored civic issues auto-routed to official municipal departments by issue classification.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 border border-border bg-white rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 shadow-sm">
              <RefreshCw size={13} /> Refresh
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 bg-[#2563EB] rounded-xl text-xs font-bold text-white shadow-sm hover:bg-[#1D4ED8]">
              <Download size={13} /> Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-border p-4 shadow-sm mb-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Search by Report ID, Title, Category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Filter Dept:</span>
            <button
              onClick={() => setSelectedDept("All")}
              className={cn("px-3 py-1.5 rounded-xl text-xs font-bold border transition-all",
                selectedDept === "All" ? "bg-[#2563EB] text-white border-[#2563EB]" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              )}
            >
              All Departments
            </button>
            {OFFICIAL_DEPT_NAMES.map(dept => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={cn("px-3 py-1.5 rounded-xl text-xs font-bold border transition-all truncate max-w-[220px]",
                  selectedDept === dept ? "bg-[#2563EB] text-white border-[#2563EB]" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                )}
                title={dept}
              >
                {dept.split(" ")[0]} {dept.split(" ")[1]}
              </button>
            ))}
          </div>
        </div>

        {/* Queue List */}
        <div className="flex flex-col gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={cn("bg-white rounded-2xl border shadow-sm overflow-hidden transition-all",
                item.severity === "Critical" ? "border-red-200" : "border-border"
              )}
            >
              <div className={cn("h-[3px]", item.severity === "Critical" ? "bg-red-500" : "bg-orange-400")} />

              <div className="p-5">
                <div className="flex items-start gap-4">
                  <img src={item.img} alt="" className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0" />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-mono text-xs font-bold text-slate-400">{item.id}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-purple-50 text-purple-700 border border-purple-100 flex items-center gap-1">
                            <Sparkles size={10} /> AI Category: {item.category}
                          </span>
                          <span className={cn("px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border",
                            item.severity === "Critical" ? "bg-red-50 text-red-700 border-red-200" : "bg-orange-50 text-orange-700 border-orange-200"
                          )}>
                            {item.severity}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-primary leading-snug">{item.title}</h3>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-2xl font-black text-red-600 tabular-nums">{item.score}</div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase">Priority Score</div>
                      </div>
                    </div>

                    {/* Report Metadata */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-2.5 my-2 bg-slate-50 rounded-xl px-3 border border-slate-100 text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Assigned Department</span>
                        <span className="font-bold text-[#2563EB] flex items-center gap-1">
                          <Building2 size={12} /> {item.dept}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">AI Confidence</span>
                        <span className="font-bold text-purple-700 flex items-center gap-1">
                          <BrainCircuit size={12} /> {item.aiConfidence}% Score
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Est. Resolution Time</span>
                        <span className="font-bold text-slate-800 flex items-center gap-1">
                          <Clock size={12} /> {item.estimatedResolutionTime}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-medium"><MapPin size={12} /> {item.location}</span>
                      <button
                        onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                        className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1"
                      >
                        {expandedId === item.id ? "Hide Details & AI Reasoning" : "View Details & AI Reasoning"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded AI Reasoning & Actions */}
                <AnimatePresence>
                  {expandedId === item.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-slate-100 space-y-3"
                    >
                      <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl text-xs">
                        <div className="font-bold text-purple-900 flex items-center gap-1.5 mb-1">
                          <BrainCircuit size={14} /> AI Decision Reasoning
                        </div>
                        <p className="text-purple-800 leading-relaxed font-medium">{item.aiReasoning}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="text-xs font-semibold text-slate-500">
                          Reporter: <strong className="text-slate-800">{item.reporter}</strong> ({item.reporterEmail})
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors">
                            Change Department
                          </button>
                          <button className="px-4 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-lg text-xs shadow-sm transition-colors flex items-center gap-1">
                            <Zap size={12} /> Confirm & Dispatch Crew
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-border">
              <CheckCircle2 size={40} className="mx-auto mb-2 opacity-50" />
              <p className="font-bold text-slate-600">No matching issues in queue</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
