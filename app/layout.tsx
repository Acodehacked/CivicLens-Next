import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Fix Your Neighborhood with a Single Photo | CivicLens",
  description:
    "CivicLens turns a single photo into an actionable civic report. AI detects defects, assesses severity, merges duplicates, and routes issues to the right municipal department — making cities safer, faster.",
  keywords: [
    "civic issue reporting",
    "pothole reporting",
    "AI civic intelligence",
    "municipal dashboard",
    "community infrastructure",
    "computer vision",
    "smart city",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

