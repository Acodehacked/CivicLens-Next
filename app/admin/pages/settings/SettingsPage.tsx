"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings, User, Bell, ShieldCheck, Key, Save, CheckCircle2,
  Building2, BrainCircuit, Lock, UserPlus, Trash2, Edit3,
  ToggleLeft, ToggleRight, RefreshCw, Copy, Eye, EyeOff,
  Mail, Phone, Globe, AlertTriangle, Users
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

type Tab = "profile" | "staff" | "ai" | "alerts" | "security";

interface StaffMember {
  id: number;
  name: string;
  email: string;
  role: "SuperAdmin" | "Operator" | "ReadOnly";
  dept: string;
  active: boolean;
  lastLogin: string;
}

const INITIAL_STAFF: StaffMember[] = [
  { id: 1, name: "Jane Doe", email: "jane.doe@city.gov", role: "SuperAdmin", dept: "Road Maintenance Department", active: true, lastLogin: "Today, 2:15 PM" },
  { id: 2, name: "Cmdr. James Vance", email: "j.vance@city.gov", role: "Operator", dept: "Disaster Management & Emergency Response Department", active: true, lastLogin: "Today, 11:30 AM" },
  { id: 3, name: "Priya Sharma", email: "p.sharma@city.gov", role: "Operator", dept: "Sanitation & Waste Management Department", active: true, lastLogin: "Yesterday" },
  { id: 4, name: "David Kim", email: "d.kim@city.gov", role: "ReadOnly", dept: "Parks & Tree Maintenance Department", active: true, lastLogin: "2 days ago" },
  { id: 5, name: "Maria Lopez", email: "m.lopez@city.gov", role: "Operator", dept: "Drainage & Stormwater Department", active: true, lastLogin: "1 week ago" },
];

const ROLE_BADGE: Record<StaffMember["role"], string> = {
  SuperAdmin: "bg-red-50 text-red-700 border-red-100",
  Operator: "bg-blue-50 text-blue-700 border-blue-100",
  ReadOnly: "bg-slate-100 text-slate-600 border-slate-200",
};

const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button onClick={onChange} className={cn("w-10 h-5 rounded-full transition-colors relative shrink-0",
    checked ? "bg-blue-600" : "bg-slate-200"
  )}>
    <span className={cn("absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform",
      checked ? "translate-x-5" : "translate-x-0.5"
    )} />
  </button>
);

const Field = ({ label, type = "text", value, onChange, placeholder }: {
  label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string;
}) => (
  <div>
    <label className="block text-xs font-bold text-slate-700 mb-1">{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100" />
  </div>
);

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [saved, setSaved] = useState(false);

  // Profile
  const [name, setName] = useState("Jane Doe");
  const [email, setEmail] = useState("jane.doe@city.gov");
  const [dept, setDept] = useState("City Administration");
  const [phone, setPhone] = useState("+1 555 012 3456");

  // Staff
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<StaffMember["role"]>("Operator");
  const [inviteSent, setInviteSent] = useState(false);

  // AI
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [autoDispatch, setAutoDispatch] = useState(true);
  const [duplicateDetection, setDuplicateDetection] = useState(true);
  const [aiModel, setAiModel] = useState("YOLOv11 + Gemini Pro Vision");
  const [clusterRadius, setClusterRadius] = useState(50);

  // Alerts
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(false);
  const [slaBreachAlert, setSlaBreachAlert] = useState(true);
  const [aiEscalationScore, setAiEscalationScore] = useState(90);

  // Security
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("8 Hours");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const sendInvite = () => {
    if (!inviteEmail.trim()) return;
    const newMember: StaffMember = {
      id: staff.length + 10, name: inviteEmail.split("@")[0], email: inviteEmail,
      role: inviteRole, dept: "Unassigned", active: true, lastLogin: "Never"
    };
    setStaff(prev => [...prev, newMember]);
    setInviteEmail(""); setInviteSent(true);
    setTimeout(() => setInviteSent(false), 3000);
  };

  const toggleStaffActive = (id: number) =>
    setStaff(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  const changeRole = (id: number, role: StaffMember["role"]) =>
    setStaff(prev => prev.map(s => s.id === id ? { ...s, role } : s));

  const copyKey = () => {
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const TABS: { id: Tab; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
    { id: "profile", label: "Profile & Account", icon: User },
    { id: "staff", label: "Staff & Roles", icon: Users },
    { id: "ai", label: "AI Engine Config", icon: BrainCircuit },
    { id: "alerts", label: "Alert Rules", icon: Bell },
    { id: "security", label: "Security & API Keys", icon: Lock },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8 pb-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-sm">
                <Settings size={16} className="text-white" />
              </div>
              <h1 className="text-2xl font-black text-primary tracking-tight">System Administration</h1>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Manage staff access, AI parameters, alert rules, and platform security from one place.
            </p>
          </div>
          <button onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] text-white rounded-xl text-xs font-bold shadow-sm hover:bg-[#1D4ED8] active:scale-[0.98] transition-all shrink-0">
            {saved ? <><CheckCircle2 size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Tab sidebar */}
          <div className="md:col-span-1 space-y-1">
            {TABS.map(t => {
              const Icon = t.icon;
              const active = activeTab === t.id;
              return (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={cn("w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all text-left",
                    active ? "bg-[#2563EB] text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}>
                  <Icon size={16} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="md:col-span-3 bg-white rounded-2xl border border-border p-6 shadow-sm">

            {/* PROFILE */}
            {activeTab === "profile" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h3 className="text-base font-bold text-primary border-b border-border pb-3">Profile & Account</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md ring-4 ring-slate-50">JD</div>
                  <div>
                    <div className="font-bold text-primary text-base">Jane Doe</div>
                    <div className="text-xs text-slate-400 font-semibold">SuperAdmin · Metro District 1</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Full Name" value={name} onChange={setName} />
                  <Field label="Official Email" type="email" value={email} onChange={setEmail} />
                  <Field label="Primary Department" value={dept} onChange={setDept} />
                  <Field label="Phone Number" value={phone} onChange={setPhone} />
                </div>
              </motion.div>
            )}

            {/* STAFF & ROLES */}
            {activeTab === "staff" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <h3 className="text-base font-bold text-primary border-b border-border pb-3">Staff & Role Management</h3>

                {/* Invite */}
                <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100">
                  <div className="text-xs font-bold text-primary mb-3 flex items-center gap-1.5"><UserPlus size={14} /> Invite New Staff Member</div>
                  <div className="flex flex-wrap gap-2">
                    <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                      placeholder="staff@city.gov"
                      className="flex-1 min-w-[180px] border border-border rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white" />
                    <select value={inviteRole} onChange={e => setInviteRole(e.target.value as StaffMember["role"])}
                      className="border border-border rounded-xl px-3 py-2 text-xs font-medium bg-white focus:outline-none focus:ring-2 focus:ring-blue-200">
                      <option>Operator</option>
                      <option>ReadOnly</option>
                      <option>SuperAdmin</option>
                    </select>
                    <button onClick={sendInvite} className="px-4 py-2 bg-[#2563EB] text-white rounded-xl text-xs font-bold hover:bg-[#1D4ED8] transition-colors flex items-center gap-1.5">
                      <Mail size={12} /> Send Invite
                    </button>
                  </div>
                  {inviteSent && <p className="text-xs text-green-700 font-semibold mt-2">✓ Invite sent!</p>}
                </div>

                {/* Table */}
                <div className="divide-y divide-border/60 rounded-xl border border-border overflow-hidden">
                  {staff.map(s => (
                    <div key={s.id} className={cn("flex items-center gap-3 p-3.5 hover:bg-slate-50 transition-colors", !s.active && "opacity-50")}>
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white text-[10px] font-black shrink-0">
                        {s.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-primary text-xs">{s.name}</div>
                        <div className="text-[11px] text-slate-400 font-medium truncate">{s.email} · {s.dept}</div>
                      </div>
                      <select
                        value={s.role}
                        onChange={e => changeRole(s.id, e.target.value as StaffMember["role"])}
                        className={cn("border rounded-lg px-2 py-1 text-[10px] font-bold focus:outline-none", ROLE_BADGE[s.role])}
                      >
                        <option>SuperAdmin</option>
                        <option>Operator</option>
                        <option>ReadOnly</option>
                      </select>
                      <Toggle checked={s.active} onChange={() => toggleStaffActive(s.id)} />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* AI ENGINE */}
            {activeTab === "ai" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h3 className="text-base font-bold text-primary border-b border-border pb-3 flex items-center justify-between">
                  <span>AI Engine Configuration</span>
                  <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100">YOLOv11 + Gemini Pro</span>
                </h3>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-700">Auto-Routing Confidence Threshold</label>
                    <span className="text-xs font-black text-blue-600">{confidenceThreshold}%</span>
                  </div>
                  <input type="range" min="50" max="98" value={confidenceThreshold}
                    onChange={e => setConfidenceThreshold(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Reports above {confidenceThreshold}% AI confidence will be auto-assigned to the official 5 departments.
                  </p>
                </div>
              </motion.div>
            )}

            {/* ALERT RULES */}
            {activeTab === "alerts" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h3 className="text-base font-bold text-primary border-b border-border pb-3">Official Department SLA Rules</h3>
                <div className="space-y-3">
                  {[
                    { dept: "Road Maintenance Department", sla: "48h", critical: "4h" },
                    { dept: "Sanitation & Waste Management Department", sla: "24h", critical: "4h" },
                    { dept: "Drainage & Stormwater Department", sla: "36h", critical: "2h" },
                    { dept: "Parks & Tree Maintenance Department", sla: "48h", critical: "4h" },
                    { dept: "Disaster Management & Emergency Response Department", sla: "12h", critical: "1h" },
                  ].map(r => (
                    <div key={r.dept} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      <div>
                        <div className="font-bold text-primary">{r.dept}</div>
                        <div className="text-[11px] text-slate-400">Standard SLA: {r.sla}</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 font-bold border border-red-100">Critical SLA: {r.critical}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* SECURITY */}
            {activeTab === "security" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h3 className="text-base font-bold text-primary border-b border-border pb-3">Security & API Key Management</h3>
                <div className="p-4 bg-green-50/60 rounded-xl border border-green-100 flex items-start gap-3">
                  <ShieldCheck size={18} className="text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-green-900">Two-Factor Authentication Active</div>
                    <p className="text-[11px] text-green-700 mt-0.5">Your account is secured via Municipal SSO with Hardware Key 2FA.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
