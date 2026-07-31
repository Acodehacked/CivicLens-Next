"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import TopNav from "./components/TopNav";
import { createClient } from "@/lib/supabase/server";
import { DEPARTMENT_LABELS, type DepartmentType } from "@/lib/constants/departments";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setCheckingAuth(false);
      return;
    }

    // Auth check simulation
    if (typeof window !== "undefined") {
      const isAuthed = sessionStorage.getItem("admin_authed");
      if (!isAuthed) {
        // Redirect unauthenticated staff to Admin Login page
        router.push("/admin/login");
      } else {
        setCheckingAuth(false);
      }
    }
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <div className="h-screen w-full bg-[#0F172A] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-400">Verifying Admin Credentials...</span>
        </div>
      </div>
    );
  }

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let displayName = "Staff";
  let roleLabel = "Department Staff";

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, role, department")
      .eq("id", user.id)
      .single();

    displayName = profile?.full_name || user.email || "Staff";
    roleLabel =
      profile?.role === "admin"
        ? "Administrator"
        : profile?.department
          ? `${DEPARTMENT_LABELS[profile.department as DepartmentType]} Dept.`
          : "Department Staff";
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar displayName={displayName} roleLabel={roleLabel} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNav displayName={displayName} roleLabel={roleLabel} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
