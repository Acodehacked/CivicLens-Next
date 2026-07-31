"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { 
  LayoutDashboard, 
  MapPin, 
  Map, 
  ListTodo, 
  BarChart3, 
  Building2, 
  History, 
  Bell, 
  Settings, 
  HelpCircle,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: MapPin, label: "Report Issue", href: "/report" },
  { icon: Map, label: "Community Map", href: "/map" },
  { icon: ListTodo, label: "Priority Queue", href: "/priority-queue" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: Building2, label: "Departments", href: "/departments" },
];

const secondaryNavItems = [
  { icon: History, label: "History", href: "/history" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: Settings, label: "Settings", href: "/settings" },
  { icon: HelpCircle, label: "Help", href: "/help" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside 
      className={cn(
        "h-full bg-white border-r border-border transition-all duration-300 flex flex-col z-20 shrink-0",
        collapsed ? "w-[68px]" : "w-64"
      )}
    >
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-border/50">
        {!collapsed && (
          <Link href="/" className="font-bold text-primary tracking-tight text-lg overflow-hidden whitespace-nowrap">
            CivicLens
          </Link>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "p-1.5 rounded-md text-on-surface-muted hover:bg-surface-muted hover:text-primary transition-colors",
            collapsed && "mx-auto"
          )}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* Primary Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors relative group text-sm",
                isActive 
                  ? "bg-[#EFF6FF] text-[#2563EB] font-semibold" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#2563EB] rounded-r-full" />
              )}
              <item.icon size={18} className="shrink-0" />
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </Link>
          );
        })}

        {/* Secondary Nav */}
        <div className="mt-8 mb-2">
          {!collapsed && (
            <div className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Preferences
            </div>
          )}
          <div className="flex flex-col gap-1">
            {secondaryNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className="flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors text-sm"
              >
                <item.icon size={18} className="shrink-0" />
                {!collapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border/50">
        <button className={cn(
          "flex items-center w-full gap-3 p-2 -m-2 rounded-lg hover:bg-surface-muted transition-colors text-left",
          collapsed && "justify-center"
        )}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2563EB] to-indigo-600 shrink-0 border border-border shadow-sm flex items-center justify-center text-white font-bold text-xs">
            JD
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <div className="font-semibold text-primary truncate text-sm">Jane Doe</div>
              <div className="text-xs text-on-surface-muted truncate">jane.doe@city.gov</div>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
