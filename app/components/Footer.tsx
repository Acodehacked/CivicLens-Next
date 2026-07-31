import { cn } from "@/lib/utils/cn";
import { Globe, Mail, MessageCircle } from "lucide-react";
import Link from "next/link";
import CivicLensLogo from "@/app/components/CivicLensLogo";

interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

const linkGroups: FooterLinkGroup[] = [
  {
    title: "Platform",
    links: [
      { label: "Community Map", href: "/community-map" },
      { label: "Report an Issue", href: "/report" },
      { label: "About CivicLens", href: "/about" },
      { label: "Contact Support", href: "/contact" },
    ],
  },
  {
    title: "Citizen Portal",
    links: [
      { label: "Citizen Login", href: "/login" },
      { label: "Submit Observation", href: "/report" },
      { label: "Live Map View", href: "/community-map" },
      { label: "How It Works", href: "/#how-it-works" },
    ],
  },
  {
    title: "Legal & Privacy",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Data Governance", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer
      className="w-full bg-surface-muted pt-20 pb-12 border-t border-border/50"
      role="contentinfo"
    >
      <div className="max-w-[var(--container-max)] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Socials (takes up 2 cols on lg) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <CivicLensLogo size={36} />
            <p className="text-sm text-on-surface-muted leading-relaxed max-w-sm">
              Empowering citizens and communities through transparent AI-driven civic reporting. Building cleaner, safer cities together.
            </p>
            <div className="flex gap-4 mt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-border/50 flex items-center justify-center text-on-surface-muted hover:text-[#2563EB] hover:border-[#2563EB]/40 transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-border/50 flex items-center justify-center text-on-surface-muted hover:text-[#2563EB] hover:border-[#2563EB]/40 transition-colors">
                <Mail className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white border border-border/50 flex items-center justify-center text-on-surface-muted hover:text-[#2563EB] hover:border-[#2563EB]/40 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link Groups */}
          {linkGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-4">
              <span className="text-sm font-semibold text-primary">
                {group.title}
              </span>
              <ul className="flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-on-surface-muted hover:text-[#2563EB] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-on-surface-muted">
            © {new Date().getFullYear()} CivicLens Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-on-surface-muted">
             <div className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse" /> Public Citizen Portal
          </div>
        </div>
      </div>
    </footer>
  );
}
