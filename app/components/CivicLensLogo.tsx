import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export interface CivicLensLogoProps {
  /** Logo variant layout */
  variant?: "horizontal" | "icon";
  /** Color mode variation */
  mode?: "light" | "dark" | "monochrome";
  /** Icon height/width in px (default: 36) */
  size?: number;
  /** Additional wrapper CSS classes */
  className?: string;
  /** Whether to wrap logo in a Next.js Link to "/" */
  href?: string;
}

export function CivicLensIcon({
  size = 36,
  mode = "light",
  className,
}: {
  size?: number;
  mode?: "light" | "dark" | "monochrome";
  className?: string;
}) {
  // Color assignments based on mode (Flat design, no gradients)
  const colors =
    mode === "monochrome"
      ? {
          ring: "currentColor",
          buildingPrimary: "currentColor",
          buildingSecondary: "currentColor",
          buildingDark: "currentColor",
          aiNode: "currentColor",
          aiWave: "currentColor",
          bg: "none",
        }
      : mode === "dark"
      ? {
          ring: "#2563EB",
          buildingPrimary: "#3B82F6",
          buildingSecondary: "#06B6D4",
          buildingDark: "#94A3B8",
          aiNode: "#06B6D4",
          aiWave: "#38BDF8",
          bg: "none",
        }
      : {
          // Light mode
          ring: "#2563EB",
          buildingPrimary: "#2563EB",
          buildingSecondary: "#06B6D4",
          buildingDark: "#1E293B",
          aiNode: "#06B6D4",
          aiWave: "#06B6D4",
          bg: "none",
        };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      {/* Outer precision ring (Lens / Scope boundary) */}
      <circle
        cx="20"
        cy="20"
        r="18"
        stroke={colors.ring}
        strokeWidth="2.5"
        fill={colors.bg}
      />

      {/* Flat Geometric City Skyline */}
      {/* Building 1 (Left low-rise) */}
      <rect x="10" y="22" width="4" height="9" rx="0.5" fill={colors.buildingDark} />
      {/* Building 2 (Main high-rise core) */}
      <rect x="15" y="16" width="5.5" height="15" rx="0.5" fill={colors.buildingPrimary} />
      {/* Building 3 (Secondary high-rise) */}
      <rect x="21.5" y="19" width="4.5" height="12" rx="0.5" fill={colors.buildingSecondary} />
      {/* Building 4 (Right low-rise) */}
      <rect x="27" y="24" width="3.5" height="7" rx="0.5" fill={colors.buildingDark} />

      {/* AI Network Layer: Abstract Wave Line & Nodes */}
      <path
        d="M9.5 14 C 14 11, 18 16, 22.5 12 C 26 9, 30.5 13, 30.5 13"
        stroke={colors.aiWave}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Connected AI Network Nodes */}
      <circle cx="14" cy="11.5" r="1.75" fill={colors.aiNode} />
      <circle cx="22.5" cy="12" r="2.25" fill={colors.buildingPrimary} stroke="#FFFFFF" strokeWidth="1" />
      <circle cx="30.5" cy="13" r="1.5" fill={colors.aiNode} />

      {/* Subtle Vertical AI Data Line linking node to infrastructure */}
      <line
        x1="22.5"
        y1="14.25"
        x2="22.5"
        y2="19"
        stroke={colors.aiNode}
        strokeWidth="1.25"
        strokeDasharray="1.5 1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function CivicLensLogo({
  variant = "horizontal",
  mode = "light",
  size = 36,
  className,
  href = "/",
}: CivicLensLogoProps) {
  const isDark = mode === "dark";
  const isMono = mode === "monochrome";

  const wordmarkClass = isMono
    ? "text-current font-semibold"
    : isDark
    ? "text-white font-semibold"
    : "font-semibold";

  const content = (
    <div className={cn("inline-flex items-center gap-2.5 group cursor-pointer", className)}>
      <CivicLensIcon size={size} mode={mode} />
      {variant === "horizontal" && (
        <span
          className={cn("text-xl tracking-tight select-none", wordmarkClass)}
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {isMono || isDark ? (
            "CivicLens"
          ) : (
            <>
              <span className="text-[#1E293B]">Civic</span>
              <span className="text-[#2563EB]">Lens</span>
            </>
          )}
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} aria-label="CivicLens Home">
        {content}
      </Link>
    );
  }

  return content;
}
