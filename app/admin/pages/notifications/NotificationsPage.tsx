"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, CheckCircle2, AlertOctagon, BrainCircuit, ShieldAlert,
  Clock, Trash2, Check, X, Filter, Megaphone, Send,
  Building2, TrendingUp, Info, AlertTriangle, Zap
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

type NotifType = "critical" | "ai" | "system" | "success" | "warning" | "sla";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: NotifType;
  category: string;
  read: boolean;
  link?: string;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-1", title: "Critical: Fallen Tree Blocking Main Rd",
    message: "AI Vision score: 98/100. Auto-routed to Parks & Tree Maintenance Department.",
    time: "10m ago", type: "critical", category: "AI Escalation", read: false,
  },
  {
    id: "notif-2", title: "SLA Breach — Drainage & Stormwater Department (REP-112)",
    message: "Waterlogging report REP-112 exceeded 4-hour SLA window. Automatic escalation triggered.",
    time: "20m ago", type: "sla", category: "SLA Breach", read: false,
  },
  {
    id: "notif-3", title: "AI Duplicate Cluster: 12 Reports Merged",
    message: "Semantic & spatial deduplication merged 12 citizen posts for 'Flash Flood' (Disaster Management).",
    time: "25m ago", type: "ai", category: "AI Clustering", read: false,
  },
  {
    id: "notif-4", title: "Road Maintenance Dept Accepted Work Order REP-104",
    message: "Pothole repair squad dispatched. Estimated ETA: 30 mins. Status → In Progress.",
    time: "45m ago", type: "system", category: "Department Action", read: false,
  },
  {
    id: "notif-5", title: "City Resolution Efficiency: 94.2%",
    message: "Weekly municipal resolution rate increased by 4.2% following auto-routing deployment.",
    time: "2h ago", type: "success", category: "Performance", read: true,
  },
  {
    id: "notif-6", title: "Weather Alert: Heavy Rain — Flood Risk",
    message: "Disaster Management & Emergency Response Department placed on standby.",
    time: "4h ago", type: "warning", category: "Environmental", read: true,
  },
];

const TYPE_CONFIG: Record<NotifType, { icon: React.ComponentType<{ size?: number; className?: string }>; dot: string; bg: string; border: string; label: string }> = {
  critical: { icon: ShieldAlert, dot: "bg-red-500 animate-pulse", bg: "bg-red-50", border: "border-red-100", label: "Critical" },
  sla:      { icon: AlertOctagon, dot: "bg-orange-500 animate-pulse", bg: "bg-orange-50", border: "border-orange-100", label: "SLA Breach" },
  ai:       { icon: BrainCircuit, dot: "bg-indigo-500", bg: "bg-indigo-50", border: "border-indigo-100", label: "AI Event" },
  system:   { icon: Bell, dot: "bg-blue-500", bg: "bg-blue-50", border: "border-blue-100", label: "System" },
  success:  { icon: CheckCircle2, dot: "bg-green-500", bg: "bg-green-50", border: "border-green-100", label: "Success" },
  warning:  { icon: AlertTriangle, dot: "bg-amber-500", bg: "bg-amber-50", border: "border-amber-100", label: "Warning" },
};

const CATEGORIES = ["All", "Critical", "SLA Breach", "AI Event", "System", "Success", "Warning"];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState("All");
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [broadcastDept, setBroadcastDept] = useState("All Departments");
  const [broadcastSent, setBroadcastSent] = useState(false);

  const DEPARTMENTS = [
    "All Departments",
    "Road Maintenance Department",
    "Sanitation & Waste Management Department",
    "Drainage & Stormwater Department",
    "Parks & Tree Maintenance Department",
    "Disaster Management & Emergency Response Department"
  ];

  const markRead = (id: string) =>
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const deleteNotif = (id: string) =>
    setNotifications(prev => prev.filter(n => n.id !== id));

  const filtered = notifications.filter(n => {
    if (filter === "All") return true;
    const cfg = TYPE_CONFIG[n.type];
    return cfg.label === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const sendBroadcast = () => {
    if (!broadcastMsg.trim()) return;
    const newNotif: Notification = {
      id: `broadcast-${Date.now()}`, type: "system",
      title: `Admin Broadcast to ${broadcastDept}`,
      message: broadcastMsg,
      time: "Just now", category: "Broadcast", read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
    setBroadcastMsg(""); setBroadcastOpen(false); setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 3000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8 pb-20">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-sm">
                <Bell size={16} className="text-white" />
              </div>
              <h1 className="text-2xl font-black text-primary tracking-tight">Alert & Broadcast Center</h1>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-red-500 text-white text-xs font-black animate-pulse">
                  {unreadCount}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Monitor system alerts, AI escalations, SLA breaches. Broadcast messages to official municipal departments.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="flex items-center gap-1.5 px-3 py-2 border border-border bg-white rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 shadow-sm">
                <Check size={13} /> Mark All Read
              </button>
            )}
            <button
              onClick={() => setBroadcastOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2563EB] rounded-xl text-xs font-bold text-white shadow-sm hover:bg-[#1D4ED8]"
            >
              <Megaphone size={13} /> Send Broadcast
            </button>
          </div>
        </div>

        {/* Broadcast Sent Banner */}
        <AnimatePresence>
          {broadcastSent && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-sm font-semibold text-green-700">
              <CheckCircle2 size={16} /> Broadcast sent successfully!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary chips */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Unread Alerts", val: unreadCount, color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
            { label: "Total Notifications", val: notifications.length, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
            { label: "SLA Breaches", val: notifications.filter(n => n.type === "sla").length, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },
          ].map(s => (
            <div key={s.label} className={cn("rounded-xl border p-4 shadow-sm flex items-center gap-3", s.bg, s.border)}>
              <div className={cn("text-2xl font-black", s.color)}>{s.val}</div>
              <div className="text-xs font-bold text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-5">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={cn("px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-sm",
                filter === cat ? "bg-[#2563EB] text-white border-[#2563EB]" : "bg-white text-slate-600 border-border hover:bg-slate-50"
              )}>
              {cat}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {filtered.map((notif, idx) => {
              const cfg = TYPE_CONFIG[notif.type];
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }} transition={{ delay: idx * 0.04 }}
                  className={cn(
                    "bg-white rounded-2xl border shadow-sm overflow-hidden hover:shadow-md transition-all",
                    !notif.read ? "border-l-4 border-l-[#2563EB] border-t-border border-r-border border-b-border" : "border-border"
                  )}
                >
                  <div className="p-4 flex items-start gap-3">
                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", cfg.bg)}>
                      <Icon size={17} className={cn(
                        notif.type === "critical" ? "text-red-600" :
                        notif.type === "sla" ? "text-orange-600" :
                        notif.type === "ai" ? "text-indigo-600" :
                        notif.type === "success" ? "text-green-600" :
                        notif.type === "warning" ? "text-amber-600" : "text-blue-600"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          {!notif.read && <span className={cn("w-2 h-2 rounded-full shrink-0", cfg.dot)} />}
                          <span className="font-bold text-primary text-sm">{notif.title}</span>
                          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold border", cfg.bg, cfg.border,
                            notif.type === "critical" ? "text-red-700" :
                            notif.type === "sla" ? "text-orange-700" :
                            notif.type === "ai" ? "text-indigo-700" :
                            notif.type === "success" ? "text-green-700" :
                            notif.type === "warning" ? "text-amber-700" : "text-blue-700"
                          )}>
                            {notif.category}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium shrink-0">{notif.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{notif.message}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-1">
                      {!notif.read && (
                        <button onClick={() => markRead(notif.id)}
                          className="w-7 h-7 rounded-lg text-slate-400 hover:text-green-600 hover:bg-green-50 flex items-center justify-center transition-colors" title="Mark read">
                          <Check size={13} />
                        </button>
                      )}
                      <button onClick={() => deleteNotif(notif.id)}
                        className="w-7 h-7 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors" title="Dismiss">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Broadcast Modal */}
      <AnimatePresence>
        {broadcastOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl border border-border shadow-2xl w-full max-w-md"
            >
              <div className="p-5 border-b border-border flex items-center justify-between bg-slate-50 rounded-t-2xl">
                <h3 className="font-bold text-primary text-base flex items-center gap-2"><Megaphone size={15} className="text-blue-500" />Send Department Broadcast</h3>
                <button onClick={() => setBroadcastOpen(false)} className="w-7 h-7 rounded-lg text-slate-400 hover:bg-slate-200 flex items-center justify-center"><X size={15} /></button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1.5">Target Official Department</label>
                  <select value={broadcastDept} onChange={e => setBroadcastDept(e.target.value)}
                    className="w-full border border-border rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white">
                    {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1.5">Message</label>
                  <textarea value={broadcastMsg} onChange={e => setBroadcastMsg(e.target.value)} rows={4}
                    placeholder="Write an admin message to official department staff..."
                    className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none" />
                </div>
              </div>
              <div className="p-4 border-t border-border flex justify-end gap-2 bg-slate-50 rounded-b-2xl">
                <button onClick={() => setBroadcastOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 border border-border rounded-xl bg-white hover:bg-slate-100">Cancel</button>
                <button onClick={sendBroadcast} disabled={!broadcastMsg.trim()}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#2563EB] rounded-xl hover:bg-[#1D4ED8] disabled:opacity-50 flex items-center gap-1.5">
                  <Send size={13} /> Send Broadcast
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
