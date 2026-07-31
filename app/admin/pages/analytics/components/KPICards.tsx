"use client";

import { motion } from "framer-motion";
import { 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  BrainCircuit, 
  CopyCheck, 
  Smile 
} from "lucide-react";

interface KPICardItem {
  id: string;
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
  subtext: string;
  icon: any;
  sparkline: number[];
}

const kpiData: KPICardItem[] = [
  {
    id: "total",
    title: "Total Reports",
    value: "2,845",
    trend: "+14.2%",
    isPositive: true,
    subtext: "vs last month",
    icon: FileText,
    sparkline: [30, 45, 55, 60, 75, 82, 95],
  },
  {
    id: "open",
    title: "Open Issues",
    value: "214",
    trend: "-8.1%",
    isPositive: true,
    subtext: "vs last week",
    icon: AlertCircle,
    sparkline: [60, 55, 50, 45, 40, 35, 28],
  },
  {
    id: "resolved",
    title: "Resolved Today",
    value: "48",
    trend: "+22.5%",
    isPositive: true,
    subtext: "vs yesterday",
    icon: CheckCircle2,
    sparkline: [20, 25, 30, 32, 38, 42, 48],
  },
  {
    id: "critical",
    title: "Critical Issues",
    value: "12",
    trend: "-15.0%",
    isPositive: true,
    subtext: "vs last week",
    icon: AlertTriangle,
    sparkline: [25, 22, 18, 16, 14, 13, 12],
  },
  {
    id: "resTime",
    title: "Avg Resolution Time",
    value: "4.2h",
    trend: "-1.5h",
    isPositive: true,
    subtext: "improvement",
    icon: Clock,
    sparkline: [7.2, 6.5, 5.8, 5.2, 4.8, 4.4, 4.2],
  },
  {
    id: "aiAcc",
    title: "AI Accuracy",
    value: "99.2%",
    trend: "+0.4%",
    isPositive: true,
    subtext: "model precision",
    icon: BrainCircuit,
    sparkline: [98.0, 98.2, 98.5, 98.8, 99.0, 99.1, 99.2],
  },
  {
    id: "dedup",
    title: "Duplicates Merged",
    value: "642",
    trend: "22.5%",
    isPositive: true,
    subtext: "duplicate rate",
    icon: CopyCheck,
    sparkline: [40, 45, 50, 55, 60, 62, 65],
  },
  {
    id: "satisfaction",
    title: "Citizen Satisfaction",
    value: "94.8%",
    trend: "+2.1%",
    isPositive: true,
    subtext: "rating",
    icon: Smile,
    sparkline: [90, 91, 92, 93, 93.8, 94.2, 94.8],
  },
];

function MiniSparkline({ data }: { data: number[] }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 64;
  const height = 24;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke="#2563EB"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export default function KPICards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiData.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: index * 0.05 }}
          className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between group cursor-default"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
        >
          {/* Card Top */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center group-hover:scale-105 transition-transform">
                <item.icon size={16} />
              </div>
              <span className="text-xs font-semibold text-slate-500 truncate" style={{ fontFamily: "var(--font-body)" }}>
                {item.title}
              </span>
            </div>
            <MiniSparkline data={item.sparkline} />
          </div>

          {/* Card Value & Trend */}
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
              {item.value}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-bold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded-full border border-[#BFDBFE]">
                {item.trend}
              </span>
              <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">{item.subtext}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
