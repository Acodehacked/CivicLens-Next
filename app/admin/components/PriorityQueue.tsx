"use client";

import { AlertTriangle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import type { Complaint } from "@/db/schema";
import { severityStyle, formatIssueLabel } from "@/lib/constants/severity";

export default function PriorityQueue({ items }: { items: Complaint[] }) {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle size={18} className="text-red-500" />
          <div>
            <h3 className="font-bold text-primary">Priority Queue</h3>
            <p className="text-[11px] font-semibold text-slate-400">Requires immediate department attention</p>
          </div>
        </div>
        <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">
          {items.length} Pending
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1 overflow-y-auto">
        {items.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-center text-slate-400 text-sm font-medium py-8">
            No active issues right now.
          </div>
        )}
        {items.map((item, idx) => {
          const severity = severityStyle(item.severity);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-3 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col gap-3 relative overflow-hidden group cursor-pointer hover:border-red-200 transition-colors"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />

              <div className="flex gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.thumbnailUrl ?? item.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-sm font-bold text-primary truncate pr-2">{formatIssueLabel(item.yoloClass)}</div>
                    <div className="text-xs font-black text-red-600 shrink-0">{item.priorityScore.toFixed(0)}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${severity.badgeClass}`}>
                      {severity.label}
                    </div>
                    <div className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                      <Clock size={10} /> {formatDistanceToNow(new Date(item.firstReportedAt), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <Link href="/admin/priority-queue" className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold shadow-sm hover:bg-primary-hover active:scale-95 transition-all">
                  View
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="p-3 border-t border-border bg-slate-50/50 flex justify-center mt-auto">
        <Link href="/admin/priority-queue" className="text-xs font-bold text-slate-500 hover:text-[#2563EB] transition-colors flex items-center gap-1">
          Open Priority Queue →
        </Link>
      </div>
    </div>
  );
}
