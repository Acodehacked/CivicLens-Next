"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

const navLinks = [
  { label: "Home", href: "/", active: true },
  { label: "Community Map", href: "/map" },
  { label: "Report Issue", href: "/report" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Features", href: "/#features" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 backdrop-blur-xl shadow-nav border-b border-border/50"
          : "bg-transparent"
      )}
      role="banner"
    >
      <div className="h-16 max-w-[var(--container-max)] mx-auto px-6 flex items-center justify-between">
        {/* Wordmark */}
        <Link
          href="/"
          className="text-xl font-bold text-primary tracking-tight hover:opacity-80 transition-opacity"
          aria-label="CivicLens Home"
        >
          CivicLens
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex items-center gap-8"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "text-[14px] font-medium transition-colors duration-200 relative py-2",
                link.active
                  ? "text-primary"
                  : "text-on-surface-muted hover:text-primary"
              )}
              {...(link.active ? { "aria-current": "page" as const } : {})}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden sm:inline-flex bg-primary text-white px-5 py-2 rounded-full text-sm font-medium tracking-wide hover:bg-primary-hover active:scale-[0.98] transition-all duration-200 shadow-sm hover:shadow-md"
          >
            Portal Login
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 -mr-2 rounded-lg text-primary hover:bg-surface-muted transition-colors"
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
            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-b border-border/50"
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
              <Link
                href="/login"
                className="mt-4 bg-primary text-white py-3 px-4 rounded-xl text-sm font-medium text-center hover:bg-primary-hover transition-colors sm:hidden shadow-sm"
                onClick={() => setMobileOpen(false)}
              >
                Portal Login
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
