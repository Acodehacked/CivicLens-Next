"use client";

import { useState, useEffect } from "react";
import { Search, Bell, Calendar as CalendarIcon, Download, Menu, X, Eye, LayoutDashboard, ListChecks, ClipboardCheck, ListTodo, BarChart3, Building2, History, Settings, LogOut, HelpCircle } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { LogoutButton } from "@/components/logout-button";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: ListChecks, label: "Issues", href: "/admin/issues" },
  { icon: ClipboardCheck, label: "Confirmations", href: "/admin/confirmations" },
  { icon: ListTodo, label: "Priority Queue", href: "/admin/priority-queue" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: Building2, label: "Departments", href: "/admin/departments" },
];

const secondaryNavItems = [
  { icon: History, label: "History Log", href: "/admin/history" },
  { icon: Bell, label: "Notifications", href: "/admin/notifications" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
  { icon: HelpCircle, label: "Help & Support", href: "/admin/help" },
];

export default function TopNav({
  displayName = "Staff",
  roleLabel = "Department Staff",
}: {
  displayName?: string;
  roleLabel?: string;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentDate = format(new Date(), "MMM d, yyyy");
  const pathname = usePathname();
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [mobileMenuOpen]);
  
  return (
    <>
      <header className="h-16 bg-white border-b border-border flex items-center justify-between px-4 sm:px-6 shrink-0 z-40 sticky top-0">
        
        {/* Mobile: Logo & Menu Toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          >
            <Menu size={20} />
          </button>
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center shrink-0">
              <Eye size={14} className="text-white" />
            </div>
            <span className="font-bold text-primary tracking-tight">CivicLens Admin</span>
          </Link>
        </div>

        {/* Desktop: Global Search */}
        <div className="flex-1 max-w-md hidden md:flex items-center relative">
          <Search className="absolute left-3 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search reports, users, or departments (Press '/' to focus)" 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-primary placeholder:text-slate-400 focus:outline-none focus:border-blue-300 focus:ring-4 focus:ring-blue-100/50 transition-all"
          />
          <div className="absolute right-3 px-1.5 py-0.5 border border-slate-200 rounded text-[10px] font-bold text-slate-400 bg-white shadow-sm">
            /
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-3 sm:gap-4">
          
          {/* Mobile Search Icon */}
          <button className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors">
            <Search size={18} />
          </button>

          {/* Date / Filter */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600">
            <CalendarIcon size={14} />
            {currentDate}
          </div>

          {/* AI Status */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-lg text-xs font-bold text-blue-700">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </div>
            <span className="hidden sm:inline">AI Active</span>
          </div>

          {/* Export Button */}
          <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
            <Download size={14} />
            Export
          </button>

          <div className="w-px h-6 bg-slate-200 hidden sm:block mx-1" />

          {/* Notifications */}
          <Link 
            href="/admin/notifications" 
            title="Notifications" 
            className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-primary transition-colors"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </Link>

          <div className="w-px h-6 bg-slate-200 hidden sm:block mx-1" />

          <div className="hidden sm:flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm border border-slate-200">
              {initials || "?"}
            </div>
            <LogoutButton
              redirectTo="/office/login"
              className="p-2 rounded-lg border-none text-slate-400 hover:bg-slate-50 hover:text-red-600 transition-colors"
            >
              <LogOut size={16} />
            </LogoutButton>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-50 md:hidden"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-white border-r border-border shadow-2xl z-50 md:hidden flex flex-col"
            >
              <div className="h-16 flex items-center justify-between px-4 border-b border-border/50 shrink-0">
                <Link 
                  href="/admin/dashboard" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shrink-0">
                    <Eye size={18} className="text-white" />
                  </div>
                  <span className="font-bold text-primary tracking-tight text-lg">CivicLens</span>
                </Link>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 -mr-2 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto py-5 px-3 flex flex-col gap-1 custom-scrollbar">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "group relative flex items-center gap-3 px-3 py-3 rounded-xl font-semibold text-sm transition-all duration-200",
                        isActive ? "bg-blue-50/80 text-blue-700" : "text-slate-500 hover:bg-slate-50 hover:text-primary"
                      )}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-600 rounded-r-full" />
                      )}
                      <item.icon size={18} className="shrink-0" />
                      <div className="flex flex-1 items-center justify-between truncate">
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  );
                })}

                <div className="mt-8 mb-2">
                  <div className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">System</div>
                  <div className="flex flex-col gap-1">
                    {secondaryNavItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl font-semibold text-sm text-slate-500 hover:bg-slate-50 hover:text-primary transition-colors group"
                      >
                        <item.icon size={18} className="shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </nav>

              <div className="p-4 border-t border-border/50 shrink-0 bg-slate-50/50">
                <div className="flex items-center gap-3 p-2 rounded-xl">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shrink-0 shadow-sm flex items-center justify-center text-white font-bold text-sm ring-2 ring-white">
                    {initials || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-primary truncate text-sm">{displayName}</div>
                    <div className="text-xs font-medium text-slate-500 truncate">{roleLabel}</div>
                  </div>
                  <LogoutButton
                    redirectTo="/office/login"
                    className="shrink-0 p-2 rounded-lg border-none text-slate-400 hover:bg-slate-100 hover:text-red-600 transition-colors"
                  >
                    <LogOut size={16} />
                  </LogoutButton>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
