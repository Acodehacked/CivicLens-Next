"use client";

import { motion } from "framer-motion";
import ShowcasePanel from "./components/ShowcasePanel";
import LoginForm from "./components/LoginForm";
import { ShieldCheck } from "lucide-react";

import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFC]">
      
      {/* Left Panel: Desktop Showcase */}
      <ShowcasePanel />

      {/* Right Panel: Authentication */}
      <div className="flex-1 flex flex-col items-center justify-center relative px-6 py-12 lg:px-16 overflow-y-auto">
        
        {/* Mobile Header (Hidden on LG) */}
        <Link href="/" className="lg:hidden flex flex-col items-center text-center mb-10 w-full max-w-sm mx-auto hover:opacity-90 transition-opacity">
          <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-2xl tracking-tighter mb-4 shadow-md">
            C
          </div>
          <h1 className="text-2xl font-bold text-primary tracking-tight mb-2">CivicLens</h1>
          <p className="text-sm text-on-surface-muted">AI-Powered Civic Intelligence Platform</p>
        </Link>

        {/* Auth Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full flex justify-center z-10"
        >
          <LoginForm />
        </motion.div>

        {/* Security & Footer */}
        <div className="absolute bottom-6 w-full px-6 lg:px-16 flex flex-col items-center justify-center gap-6 z-0">
          
          {/* Security Trust Block */}
          <div className="flex items-center gap-6 px-6 py-3 bg-white border border-border rounded-full shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-success" />
              <span className="text-xs font-semibold text-primary">Secure Authentication</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <span className="text-xs text-on-surface-muted">256-bit Encryption</span>
            <div className="w-1 h-1 rounded-full bg-border hidden sm:block" />
            <span className="text-xs text-on-surface-muted hidden sm:block">SOC 2 Ready</span>
          </div>

          {/* Footer Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-on-surface-muted">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Support Center</a>
            <a href="#" className="hover:text-primary transition-colors">Documentation</a>
            <span className="opacity-50">|</span>
            <span className="opacity-70">© {new Date().getFullYear()} CivicLens</span>
          </div>
        </div>

      </div>
    </div>
  );
}
