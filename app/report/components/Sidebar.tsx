"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { LogoutButton } from "@/components/logout-button";
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
  PanelLeftOpen,
  LogOut
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "#" },
  { icon: MapPin, label: "Report Issue", href: "/report", active: true },
  { icon: Map, label: "Community Map", href: "#" },
  { icon: ListTodo, label: "Priority Queue", href: "#" },
  { icon: BarChart3, label: "Analytics", href: "#" },
  { icon: Building2, label: "Departments", href: "#" },
];

const secondaryNavItems = [
  { icon: History, label: "History", href: "#" },
  { icon: Bell, label: "Notifications", href: "#" },
  { icon: Settings, label: "Settings", href: "#" },
  { icon: HelpCircle, label: "Help", href: "#" },
];

export default function Sidebar({
  displayName,
  email,
}: {
  displayName: string | null;
  email: string | null;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const initials = displayName
    ? displayName
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  return (
    <aside 
      className={cn(
        "h-full bg-white border-r border-border transition-all duration-300 flex flex-col z-20",
        collapsed ? "w-[68px]" : "w-64"
      )}
    >
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-border/50">
        {!collapsed && (
          <span className="font-bold text-primary tracking-tight text-lg overflow-hidden whitespace-nowrap">
            CivicLens
          </span>
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
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            title={collapsed ? item.label : undefined}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors relative group",
              item.active 
                ? "bg-[#EFF6FF] text-[#2563EB]" 
                : "text-on-surface-muted hover:bg-surface-muted hover:text-primary"
            )}
          >
            {item.active && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#2563EB] rounded-r-full" />
            )}
            <item.icon size={18} className="shrink-0" />
            {!collapsed && (
              <span className="truncate">{item.label}</span>
            )}
          </a>
        ))}

        {/* Secondary Nav */}
        <div className="mt-8 mb-2">
          {!collapsed && (
            <div className="px-3 text-xs font-semibold text-on-surface-muted/60 uppercase tracking-wider mb-2">
              Preferences
            </div>
          )}
          <div className="flex flex-col gap-1">
            {secondaryNavItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className="flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-on-surface-muted hover:bg-surface-muted hover:text-primary transition-colors"
              >
                <item.icon size={18} className="shrink-0" />
                {!collapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border/50">
        {displayName ? (
          <div className={cn(
            "flex items-center w-full gap-3 p-2 -m-2 rounded-lg text-left",
            collapsed && "flex-col justify-center"
          )}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-purple-500 shrink-0 border border-border shadow-sm flex items-center justify-center text-white font-bold text-xs">
              {initials}
            </div>
            {!collapsed && (
              <div className="flex-1 overflow-hidden">
                <div className="font-semibold text-primary truncate text-sm">{displayName}</div>
                <div className="text-xs text-on-surface-muted truncate">{email}</div>
              </div>
            )}
            <LogoutButton
              redirectTo="/"
              className="shrink-0 p-2 rounded-lg border-none text-on-surface-muted hover:bg-surface-muted hover:text-red-600 transition-colors"
            >
              <LogOut size={16} />
            </LogoutButton>
          </div>
        ) : (
          <Link
            href="/login"
            className={cn(
              "flex items-center w-full gap-3 p-2 -m-2 rounded-lg hover:bg-surface-muted transition-colors text-left",
              collapsed && "justify-center"
            )}
          >
            <div className="w-8 h-8 rounded-full bg-surface-muted border border-border shrink-0 flex items-center justify-center text-on-surface-muted font-bold text-xs">
              ?
            </div>
            {!collapsed && (
              <div className="flex-1 overflow-hidden">
                <div className="font-semibold text-primary truncate text-sm">Guest</div>
                <div className="text-xs text-on-surface-muted truncate">Sign in to track reports</div>
              </div>
            )}
          </Link>
        )}
      </div>
    </aside>
  );
}
