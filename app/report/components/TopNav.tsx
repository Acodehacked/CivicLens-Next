"use client";

import { Search, Bell, User } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default function TopNav() {
  const currentDate = format(new Date(), "EEEE, MMMM do, yyyy");

  return (
    <header className="h-16 shrink-0 bg-white border-b border-border shadow-sm flex items-center justify-between px-6 z-20">
      
      {/* Left side: Search */}
      <div className="flex-1 max-w-md hidden sm:flex">
        <div className="relative w-full group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-600 transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search reports, locations, or IDs..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Right side: Utilities */}
      <div className="flex items-center gap-5 ml-auto">
        <div className="hidden lg:flex flex-col items-end mr-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Current Date</span>
          <span className="text-sm font-semibold text-slate-900">{currentDate}</span>
        </div>

        <div className="h-8 w-px bg-slate-200 hidden lg:block" />

        <div className="flex items-center gap-3">
          {/* AI Status Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">AI Engine Active</span>
          </div>
          
          <Link 
            href="/notifications" 
            title="Notification Center"
            className="relative w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Bell size={18} />
            <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </Link>
          
          <Link 
            href="/settings" 
            title="User Profile & Settings"
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
          >
            JD
          </Link>
        </div>
      </div>
    </header>
  );
}
