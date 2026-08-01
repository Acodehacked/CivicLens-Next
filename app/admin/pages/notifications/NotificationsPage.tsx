"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, ShieldAlert, Clock3, Sparkles, X, Building2, Check,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils/cn";
import type { NotificationItem } from "@/lib/data/analytics";
import { DEPARTMENT_LABELS, type DepartmentType } from "@/lib/constants/departments";
import { severityStyle, formatIssueLabel } from "@/lib/constants/severity";

const KIND_CONFIG: Record<
  NotificationItem["kind"],
  { icon: typeof ShieldAlert; dot: string; bg: string; border: string; text: string; label: string }
> = {
  critical: { icon: ShieldAlert, dot: "bg-red-500 animate-pulse", bg: "bg-red-50", border: "border-red-100", text: "text-red-700", label: "Critical Severity" },
  stale: { icon: Clock3, dot: "bg-orange-500 animate-pulse", bg: "bg-orange-50", border: "border-orange-100", text: "text-orange-700", label: "Open 48h+" },
  new: { icon: Sparkles, dot: "bg-blue-500", bg: "bg-blue-50", border: "border-blue-100", text: "text-blue-700", label: "New Report" },
};

const FILTERS: Array<{ key: "All" | NotificationItem["kind"]; label: string }> = [
  { key: "All", label: "All" },
  { key: "critical", label: "Critical" },
  { key: "stale", label: "Stale (48h+)" },
  { key: "new", label: "New" },
];

export default function NotificationsPage({ items }: { items: NotificationItem[] }) {
  const [filter, setFilter] = useState<"All" | NotificationItem["kind"]>("All");
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const key = (n: NotificationItem) => `${n.kind}:${n.id}`;
  const visible = items.filter((n) => !dismissed.has(key(n)) && (filter === "All" || n.kind === filter));

  const dismiss = (n: NotificationItem) =>
    setDismissed((prev) => new Set(prev).add(key(n)));

  const counts = {
    critical: items.filter((n) => n.kind === "critical").length,
    stale: items.filter((n) => n.kind === "stale").length,
    new: items.filter((n) => n.kind === "new").length,
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8 pb-20">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-sm">
                <Bell size={16} className="text-white" />
              </div>
              <h1 className="text-2xl font-black text-primary tracking-tight">Notifications</h1>
              {visible.length > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-red-500 text-white text-xs font-black">
                  {visible.length}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Live from open complaints - critical severity, reports sitting open 48h+, and newly filed reports awaiting confirmation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Critical", val: counts.critical, color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
            { label: "Stale (48h+)", val: counts.stale, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },
            { label: "New Reports", val: counts.new, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
          ].map((s) => (
            <div key={s.label} className={cn("rounded-xl border p-4 shadow-sm flex items-center gap-3", s.bg, s.border)}>
              <div className={cn("text-2xl font-black", s.color)}>{s.val}</div>
              <div className="text-xs font-bold text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn("px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-sm",
                filter === f.key ? "bg-[#2563EB] text-white border-[#2563EB]" : "bg-white text-slate-600 border-border hover:bg-slate-50"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {visible.length > 0 ? visible.map((notif, idx) => {
              const cfg = KIND_CONFIG[notif.kind];
              const Icon = cfg.icon;
              const severity = severityStyle(notif.severity);
              return (
                <motion.div
                  key={key(notif)}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }} transition={{ delay: Math.min(idx * 0.03, 0.3) }}
                  className={cn(
                    "bg-white rounded-2xl border-t border-r border-b border-border shadow-sm overflow-hidden hover:shadow-md transition-all border-l-4",
                    notif.kind === "critical" ? "border-l-red-400" : notif.kind === "stale" ? "border-l-orange-400" : "border-l-blue-400"
                  )}
                >
                  <div className="p-4 flex items-start gap-3">
                    <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", cfg.bg)}>
                      <Icon size={17} className={cfg.text} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={cn("w-2 h-2 rounded-full shrink-0", cfg.dot)} />
                          <span className="font-bold text-primary text-sm">{formatIssueLabel(notif.yoloClass)}</span>
                          <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold border", cfg.bg, cfg.border, cfg.text)}>
                            {cfg.label}
                          </span>
                          <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider", severity.badgeClass)}>
                            {severity.label}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium shrink-0">
                          {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-medium flex-wrap mt-1">
                        <span className="flex items-center gap-1 text-blue-600 font-semibold">
                          <Building2 size={12} />{DEPARTMENT_LABELS[notif.department as DepartmentType] ?? notif.department}
                        </span>
                        {notif.addressText && (
                          <>
                            <span>•</span>
                            <span className="truncate">{notif.addressText}</span>
                          </>
                        )}
                        {notif.reportCount > 1 && (
                          <>
                            <span>•</span>
                            <span>{notif.reportCount} reports</span>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => dismiss(notif)}
                      className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors shrink-0 ml-1"
                      title="Dismiss for this session"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </motion.div>
              );
            }) : (
              <div className="p-16 text-center text-slate-400 bg-white rounded-2xl border border-border shadow-sm">
                <Check size={36} className="mx-auto mb-2 opacity-50" />
                <p className="font-semibold text-slate-600">Nothing needs attention right now</p>
                <p className="text-xs mt-1">You&apos;re all caught up.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
