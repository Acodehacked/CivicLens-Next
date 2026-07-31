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

type CurrentUser = { displayName: string; href: string } | null;

export default function Navbar({ currentUser = null }: { currentUser?: CurrentUser }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const initials = currentUser
    ? currentUser.displayName
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : null;

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

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-4">
          {currentUser ? (
            <Link
              href={currentUser.href}
              className="hidden sm:inline-flex items-center gap-2 bg-white border border-border px-2 py-1.5 pr-4 rounded-full text-sm font-medium tracking-wide text-primary hover:bg-surface-muted active:scale-[0.98] transition-all duration-200 shadow-sm"
            >
              <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0">
                {initials}
              </span>
              {currentUser.displayName}
            </Link>
          ) : (
            <Link
              href="/login"
              className="hidden sm:inline-flex bg-primary text-white px-5 py-2 rounded-full text-sm font-medium tracking-wide hover:bg-primary-hover active:scale-[0.98] transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Portal Login
            </Link>
          )}

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
            <nav
              className="flex flex-col py-4 px-6 gap-2"
              aria-label="Mobile navigation"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "py-3 px-4 rounded-xl text-sm font-medium transition-colors",
                    link.active
                      ? "text-primary bg-surface-muted font-bold"
                      : "text-on-surface-muted hover:text-primary hover:bg-surface-muted"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {currentUser ? (
                <Link
                  href={currentUser.href}
                  className="mt-4 flex items-center justify-center gap-2 bg-primary text-white py-3 px-4 rounded-xl text-sm font-medium text-center hover:bg-primary-hover transition-colors sm:hidden shadow-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs shrink-0">
                    {initials}
                  </span>
                  {currentUser.displayName}
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="mt-4 bg-primary text-white py-3 px-4 rounded-xl text-sm font-medium text-center hover:bg-primary-hover transition-colors sm:hidden shadow-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  Portal Login
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
