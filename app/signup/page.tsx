"use client";

import { motion } from "framer-motion";
import ShowcasePanel from "../login/components/ShowcasePanel";
import SignupForm from "./components/SignupForm";
import { ShieldCheck } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFC]">
      <ShowcasePanel />

      <div className="flex-1 flex flex-col items-center justify-center relative px-6 py-12 lg:px-16 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full flex justify-center z-10"
        >
          <SignupForm />
        </motion.div>

        <div className="mt-10 flex items-center gap-6 px-6 py-3 bg-white border border-border rounded-full shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-success" />
            <span className="text-xs font-semibold text-primary">Secure Authentication</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-border" />
          <span className="text-xs text-on-surface-muted">256-bit Encryption</span>
        </div>
      </div>
    </div>
  );
}
