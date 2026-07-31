"use client";

import { motion } from "framer-motion";
import { Sparkles, Map, BarChart3, ListTodo, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";

export default function ShowcasePanel() {
  return (
    <div className="relative hidden lg:flex flex-col w-[55%] h-full bg-gradient-to-br from-[#1e3a8a] to-primary overflow-hidden p-12 text-white">
      
      {/* Abstract Background Mesh */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-accent rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-0 w-[500px] h-[500px] bg-purple-600 rounded-full blur-[150px] opacity-30" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex flex-col gap-6 max-w-xl">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity w-fit">
          <div className="w-8 h-8 rounded-lg bg-white text-primary flex items-center justify-center font-bold text-xl tracking-tighter">
            C
          </div>
          <span className="text-2xl font-bold tracking-tight">CivicLens</span>
        </Link>
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 w-fit backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-accent-light" />
          <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">
            AI-Powered Civic Intelligence Platform
          </span>
        </div>

        <h1 className="text-4xl xl:text-5xl font-bold leading-tight tracking-tight">
          Building Smarter Cities Through AI
        </h1>
        
        <p className="text-lg text-white/70 leading-relaxed max-w-lg">
          CivicLens transforms citizen reports into intelligent city insights using computer vision, severity analysis, duplicate detection, and automated department routing.
        </p>
      </div>

      {/* Floating Dashboard Mockup */}
      <div className="relative z-10 flex-1 mt-12 w-full max-w-2xl mx-auto flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="w-full aspect-[4/3] bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl p-4 flex flex-col relative"
        >
           {/* Mockup Header */}
           <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
             <div className="flex gap-2">
               <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
               <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
               <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
             </div>
             <div className="w-32 h-2 bg-white/10 rounded-full" />
           </div>

           {/* Mockup Layout */}
           <div className="flex-1 flex gap-4">
             {/* Sidebar Map */}
             <div className="w-1/3 bg-white/5 rounded-xl border border-white/5 p-3 flex flex-col gap-3 relative overflow-hidden">
               <Map className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5" />
               <div className="w-full h-16 bg-white/10 rounded-lg flex items-center justify-center">
                 <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
               </div>
               <div className="flex-1 flex flex-col gap-2">
                 <div className="w-3/4 h-2 bg-white/20 rounded-full" />
                 <div className="w-1/2 h-2 bg-white/10 rounded-full" />
                 <div className="w-full h-8 bg-error/20 border border-error/30 rounded-md mt-auto flex items-center justify-center gap-2 text-error text-[10px] font-bold uppercase">
                   <ShieldAlert size={12} /> High Priority
                 </div>
               </div>
             </div>
             
             {/* Main Chart area */}
             <div className="flex-1 flex flex-col gap-4">
               <div className="h-1/2 w-full bg-white/5 rounded-xl border border-white/5 p-4 flex items-end gap-2">
                 {[40, 70, 45, 90, 65, 85].map((h, i) => (
                   <div key={i} className={cn("flex-1 rounded-t-sm", i === 3 ? "bg-accent" : "bg-white/20")} style={{ height: `${h}%` }} />
                 ))}
                 <BarChart3 className="absolute top-4 right-4 w-6 h-6 text-white/20" />
               </div>
               <div className="h-1/2 w-full bg-white/5 rounded-xl border border-white/5 p-3 flex flex-col gap-2">
                 {[1, 2, 3].map((i) => (
                   <div key={i} className="w-full h-8 bg-white/5 rounded-md flex items-center px-2 gap-2">
                     <ListTodo className="w-3 h-3 text-white/40" />
                     <div className="w-2/3 h-1.5 bg-white/20 rounded-full" />
                   </div>
                 ))}
               </div>
             </div>
           </div>
        </motion.div>

        {/* Floating Stats Cards */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-6 top-1/4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-xl z-20"
        >
          <div className="text-2xl font-bold text-white mb-1">96%</div>
          <div className="text-[10px] font-medium text-white/70 uppercase tracking-wider">AI Accuracy</div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -right-8 top-1/2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-xl z-20"
        >
          <div className="text-2xl font-bold text-white mb-1">100K+</div>
          <div className="text-[10px] font-medium text-white/70 uppercase tracking-wider">Reports Processed</div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute left-10 -bottom-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-xl z-20"
        >
          <div className="text-2xl font-bold text-accent-light mb-1">40%</div>
          <div className="text-[10px] font-medium text-white/70 uppercase tracking-wider">Faster Resolution</div>
        </motion.div>

      </div>
    </div>
  );
}
