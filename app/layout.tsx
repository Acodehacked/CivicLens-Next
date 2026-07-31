import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CivicLens — AI-Powered Civic Intelligence for Better Cities",
  description:
    "CivicLens transforms municipal incident reporting using advanced computer vision and predictive severity analysis to help cities identify, prioritize, and resolve infrastructure issues faster.",
  keywords: [
    "civic intelligence",
    "AI",
    "municipal",
    "infrastructure",
    "incident reporting",
    "computer vision",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
