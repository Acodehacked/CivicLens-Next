"use client";

import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import TopNav from "./components/TopNav";
import AdminErrorPanel from "./components/AdminErrorPanel";
import { fetchLayoutStats, type LayoutStats } from "@/lib/api/admin";

// proxy.ts already redirects non-staff away from /admin/** before this ever
// renders - that's the real auth gate. This just displays the name/role/
// pending-count, fetched client-side (see /api/admin/layout-stats) so a DB
// hiccup here shows a visible error instead of crashing the whole shell.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [stats, setStats] = useState<LayoutStats | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchLayoutStats()
      .then(setStats)
      .catch((err) => setError(err instanceof Error ? err : new Error(String(err))));
  }, []);

  const displayName = stats?.displayName ?? "Staff";
  const roleLabel = stats?.roleLabel ?? "Department Staff";
  const pendingCount = stats?.pendingCount ?? 0;

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar displayName={displayName} roleLabel={roleLabel} pendingCount={pendingCount} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNav displayName={displayName} roleLabel={roleLabel} />
        <main className="flex-1 overflow-y-auto">
          {error ? <AdminErrorPanel error={error} /> : children}
        </main>
      </div>
    </div>
  );
}
