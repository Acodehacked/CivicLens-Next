"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { 
  LayoutDashboard, 
  ListTodo, 
  BarChart3, 
  Building2, 
  History, 
  Bell, 
  Settings, 
  HelpCircle,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  LogOut
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: ListTodo, label: "Priority Queue", href: "/admin/priority-queue", badge: 3 },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: Building2, label: "Departments", href: "/admin/departments" },
];

const secondaryNavItems = [
  { icon: History, label: "History Log", href: "/admin/history" },
  { icon: Bell, label: "Notifications", href: "/admin/notifications" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
  { icon: HelpCircle, label: "Help & Support", href: "/admin/help" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside 
      className={cn(
        "h-screen bg-white border-r border-border flex flex-col z-40 transition-all duration-300 shadow-[2px_0_12px_rgba(0,0,0,0.02)] relative hidden md:flex",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border/50 shrink-0">
        {!collapsed && (
          <Link href="/admin/dashboard" className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <div className="w-8 h-8 bg-[#2563EB] rounded-xl flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck size={18} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-primary tracking-tight text-base leading-none">
                CivicLens
              </span>
              <span className="text-[10px] font-black text-[#2563EB] uppercase tracking-wider mt-0.5">
                Admin Console
              </span>
            </div>
          </Link>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-primary transition-all",
            collapsed && "mx-auto"
          )}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-5 px-3 flex flex-col gap-1 custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === "/admin/dashboard" && pathname === "/admin");
          return (
            <Link
              key={item.label}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200",
                isActive 
                  ? "bg-blue-50/80 text-blue-700 font-bold" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-primary"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-600 rounded-r-full" 
                />
              )}
              <item.icon size={18} className="shrink-0" />
              {!collapsed && (
                <div className="flex flex-1 items-center justify-between truncate">
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 text-[10px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}

        {/* Secondary Navigation */}
        <div className="mt-8 mb-2">
          {!collapsed && (
            <div className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              System Admin
            </div>
          )}
          <div className="flex flex-col gap-1">
            {secondaryNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm transition-colors group",
                    isActive
                      ? "bg-blue-50/80 text-blue-700 font-bold"
                      : "text-slate-500 hover:bg-slate-50 hover:text-primary"
                  )}
                >
                  <item.icon size={18} className="shrink-0" />
                  {!collapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border/50 shrink-0">
        <div className={cn(
          "flex items-center w-full gap-3 p-2 rounded-xl transition-colors text-left",
          collapsed && "justify-center"
        )}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shrink-0 border border-border shadow-sm flex items-center justify-center text-white font-bold text-xs ring-2 ring-white">
            JD
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="font-bold text-primary truncate text-sm">Jane Doe</div>
              <div className="text-[11px] font-medium text-slate-500 truncate">City Administrator</div>
            </div>
          )}
          {!collapsed && (
            <Link href="/admin/login" title="Logout" className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
              <LogOut size={16} />
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
