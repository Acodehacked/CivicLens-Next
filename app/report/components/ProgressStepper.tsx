"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const steps = [
  "Upload Evidence",
  "Verify Location",
  "Additional Info",
  "AI Analysis",
  "Submit",
];

export default function ProgressStepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {/* Background Line */}
        <div className="absolute left-0 top-[11px] w-full h-[2px] bg-border-light -z-10" />
        
        {/* Active Line (Animated) */}
        <motion.div 
          className="absolute left-0 top-[11px] h-[2px] bg-accent -z-10"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isActive = idx === currentStep;
          
          return (
            <div key={step} className="flex flex-col items-center gap-2 relative bg-[#F8FAFC] px-2">
              <div 
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-colors duration-300 shadow-sm",
                  isActive ? "bg-white border-accent text-accent" : 
                  isCompleted ? "bg-accent border-accent text-white" : 
                  "bg-white border-border text-on-surface-muted"
                )}
              >
                {isCompleted ? <Check size={12} strokeWidth={3} /> : idx + 1}
              </div>
              <span 
                className={cn(
                  "text-xs font-semibold absolute top-8 w-max text-center transition-colors duration-300",
                  isActive ? "text-primary" : 
                  isCompleted ? "text-on-surface-muted" : 
                  "text-on-surface-muted/60"
                )}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
