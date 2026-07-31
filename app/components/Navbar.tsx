"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import CivicLensLogo from "@/app/components/CivicLensLogo";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Community Map", href: "/community-map" },
  { label: "Report Issue", href: "/report" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-white/85 backdrop-blur-2xl shadow-nav border-b border-[#2563EB]/10"
          : "bg-white/60 backdrop-blur-md border-b border-slate-100"
      )}
      role="banner"
    >
      <div className="h-16 max-w-[var(--container-max)] mx-auto px-6 flex items-center justify-between">

        <CivicLensLogo />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Main navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "text-[14px] font-medium transition-colors duration-[220ms] py-2 relative",
                  isActive
                    ? "text-[#2563EB] font-semibold after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:rounded-full after:bg-[#2563EB]"
                    : "text-slate-600 hover:text-slate-900"
                )}
                style={{ fontFamily: "var(--font-body)" }}
                {...(isActive ? { "aria-current": "page" as const } : {})}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA Group + Mobile Toggle */}
        <div className="flex items-center gap-3">
          {/* Report Issue — Blue filled */}
          <Link
            href="/report"
            className="hidden sm:inline-flex items-center gap-1.5 bg-[#2563EB] text-white px-4 py-2 rounded-full text-sm font-semibold tracking-wide hover:bg-[#1d4ed8] active:scale-[0.97] transition-all duration-200 shadow-sm hover:shadow-[0_4px_16px_rgba(37,99,235,0.25)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Report Issue
          </Link>
          {/* Log In — Blue outline */}
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border border-slate-200 text-slate-600 hover:border-[#2563EB] hover:text-[#2563EB] active:scale-[0.97] transition-all duration-[220ms]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Log In
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 -mr-1 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-2xl border-b border-border/50"
          >
            <nav className="flex flex-col py-4 px-6 gap-2" aria-label="Mobile navigation">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "py-3 px-4 rounded-2xl text-sm font-medium transition-colors duration-[220ms]",
                      isActive
                        ? "text-[#2563EB] bg-[#EFF6FF] font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/report"
                className="mt-2 bg-[#2563EB] text-white py-3 px-4 rounded-2xl text-sm font-semibold text-center hover:bg-[#1d4ed8] transition-colors duration-[220ms] shadow-sm"
                onClick={() => setMobileOpen(false)}
              >
                Report Issue
              </Link>
              <Link
                href="/login"
                className="border border-slate-200 text-slate-600 py-3 px-4 rounded-2xl text-sm font-medium text-center hover:border-[#2563EB] hover:text-[#2563EB] transition-all duration-[220ms]"
                onClick={() => setMobileOpen(false)}
              >
                Log In
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
