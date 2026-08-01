"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import {
  Settings, User, Users, Building2, Save, CheckCircle2, Mail, Bell, ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { updateOwnProfile, updateOwnNotificationPreference, updateDepartmentSettings } from "@/lib/actions/settings";
import type { StaffDirectoryRow, DepartmentSettingsRow } from "@/lib/data/settings";
import { DEPARTMENT_LABELS, type DepartmentType } from "@/lib/constants/departments";

type ProfileInfo = {
  fullName: string | null;
  email: string | null;
  role: "admin" | "department_staff";
  department: DepartmentType | null;
  emailNotificationsEnabled: boolean;
};

type Tab = "profile" | "staff" | "departments";

const Toggle = ({ checked, onChange, disabled }: { checked: boolean; onChange: () => void; disabled?: boolean }) => (
  <button
    onClick={onChange}
    disabled={disabled}
    className={cn(
      "w-10 h-5 rounded-full transition-colors relative shrink-0 disabled:opacity-50",
      checked ? "bg-blue-600" : "bg-slate-200"
    )}
  >
    <span
      className={cn(
        "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform",
        checked ? "translate-x-5" : "translate-x-0.5"
      )}
    />
  </button>
);

export default function SettingsPage({
  profile,
  staff,
  departmentSettings,
  isAdmin,
}: {
  profile: ProfileInfo;
  staff: StaffDirectoryRow[];
  departmentSettings: DepartmentSettingsRow[];
  isAdmin: boolean;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState<string | null>(null);

  const [name, setName] = useState(profile.fullName ?? "");
  const [notifEnabled, setNotifEnabled] = useState(profile.emailNotificationsEnabled);

  const [deptDrafts, setDeptDrafts] = useState<Record<string, { contactEmail: string; avgResolutionHours: string }>>(
    Object.fromEntries(
      departmentSettings.map((d) => [
        d.name,
        { contactEmail: d.contactEmail ?? "", avgResolutionHours: d.avgResolutionHours != null ? String(d.avgResolutionHours) : "" },
      ])
    )
  );

  const flashSaved = (key: string) => {
    setSaved(key);
    setTimeout(() => setSaved((cur) => (cur === key ? null : cur)), 2000);
  };

  const saveProfile = () => {
    startTransition(async () => {
      await updateOwnProfile(name);
      flashSaved("profile");
    });
  };

  const toggleNotifications = () => {
    const next = !notifEnabled;
    setNotifEnabled(next);
    startTransition(async () => {
      await updateOwnNotificationPreference(next);
      flashSaved("notif");
    });
  };

  const saveDepartment = (deptName: DepartmentType) => {
    const draft = deptDrafts[deptName];
    startTransition(async () => {
      await updateDepartmentSettings(deptName, draft.contactEmail, Number(draft.avgResolutionHours) || 0);
      flashSaved(deptName);
    });
  };

  const TABS: { id: Tab; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
    { id: "profile", label: "Profile & Notifications", icon: User },
    { id: "staff", label: "Staff Directory", icon: Users },
    ...(isAdmin ? [{ id: "departments" as const, label: "Department Contacts", icon: Building2 }] : []),
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
              <h1 className="text-2xl font-black text-primary tracking-tight">Settings</h1>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Your account, email notifications, and{isAdmin ? " department contact details" : " the staff directory"}.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-1">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all text-left",
                    active ? "bg-[#2563EB] text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <Icon size={16} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          <div className="md:col-span-3 bg-white rounded-2xl border border-border p-6 shadow-sm">
            {activeTab === "profile" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <h3 className="text-base font-bold text-primary border-b border-border pb-3">Profile</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md ring-4 ring-slate-50">
                    {(profile.fullName ?? profile.email ?? "?").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-primary text-base">{profile.fullName ?? "Unnamed"}</div>
                    <div className="text-xs text-slate-400 font-semibold">
                      {profile.role === "admin" ? "Administrator" : DEPARTMENT_LABELS[profile.department as DepartmentType] ?? "Department Staff"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Sign-in Email</label>
                    <div className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-500 flex items-center gap-1.5">
                      <Mail size={12} /> {profile.email ?? "—"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={saveProfile}
                    disabled={isPending || !name.trim()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] text-white rounded-xl text-xs font-bold shadow-sm hover:bg-[#1D4ED8] active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {saved === "profile" ? <><CheckCircle2 size={15} /> Saved!</> : <><Save size={15} /> Save Name</>}
                  </button>
                </div>

                <div className="border-t border-border pt-5">
                  <h3 className="text-base font-bold text-primary mb-3">Email Notifications</h3>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-start gap-3">
                      <Bell size={16} className="text-slate-400 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-primary">Status-change alerts</div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Receive an email when a complaint you follow changes status or a new issue is filed in your department.
                        </p>
                      </div>
                    </div>
                    <Toggle checked={notifEnabled} onChange={toggleNotifications} disabled={isPending} />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "staff" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <h3 className="text-base font-bold text-primary border-b border-border pb-3">
                  {isAdmin ? "All Staff & Admin Accounts" : "Your Department's Staff"}
                </h3>
                <div className="divide-y divide-border/60 rounded-xl border border-border overflow-hidden">
                  {staff.length > 0 ? staff.map((s) => (
                    <div key={s.id} className="flex items-center gap-3 p-3.5 hover:bg-slate-50 transition-colors">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white text-[10px] font-black shrink-0">
                        {(s.fullName ?? s.email ?? "?").charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-primary text-xs">{s.fullName ?? "Unnamed"}</div>
                        <div className="text-[11px] text-slate-400 font-medium truncate">
                          {s.email ?? "—"} · {s.department ? DEPARTMENT_LABELS[s.department] : "All Departments"}
                        </div>
                      </div>
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-lg text-[10px] font-bold border",
                          s.role === "admin" ? "bg-red-50 text-red-700 border-red-100" : "bg-blue-50 text-blue-700 border-blue-100"
                        )}
                      >
                        {s.role === "admin" ? "Administrator" : "Department Staff"}
                      </span>
                    </div>
                  )) : (
                    <div className="p-8 text-center text-slate-400 text-xs font-semibold">No staff accounts found.</div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "departments" && isAdmin && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <h3 className="text-base font-bold text-primary border-b border-border pb-3 flex items-center justify-between">
                  <span>Department Contacts</span>
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                    <ShieldCheck size={12} /> Used for new-issue email alerts
                  </span>
                </h3>
                <div className="space-y-4">
                  {departmentSettings.map((d) => (
                    <div key={d.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="font-bold text-primary text-xs mb-3">{DEPARTMENT_LABELS[d.name]}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">Contact Email</label>
                          <input
                            type="email"
                            value={deptDrafts[d.name]?.contactEmail ?? ""}
                            onChange={(e) =>
                              setDeptDrafts((prev) => ({ ...prev, [d.name]: { ...prev[d.name], contactEmail: e.target.value } }))
                            }
                            placeholder="department@city.gov"
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">Target Resolution (hours)</label>
                          <input
                            type="number"
                            min={1}
                            value={deptDrafts[d.name]?.avgResolutionHours ?? ""}
                            onChange={(e) =>
                              setDeptDrafts((prev) => ({ ...prev, [d.name]: { ...prev[d.name], avgResolutionHours: e.target.value } }))
                            }
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                          />
                        </div>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={() => saveDepartment(d.name)}
                          disabled={isPending}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#2563EB] text-white rounded-lg text-[11px] font-bold shadow-sm hover:bg-[#1D4ED8] disabled:opacity-50"
                        >
                          {saved === d.name ? <><CheckCircle2 size={12} /> Saved!</> : <><Save size={12} /> Save</>}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
