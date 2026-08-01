"use client";

import { useEffect, useState } from "react";
import SettingsPage from "@/app/admin/pages/settings/SettingsPage";
import AdminErrorPanel from "../components/AdminErrorPanel";
import AdminLoading from "../components/AdminLoading";
import { fetchAdminSettings, type SettingsData } from "@/lib/api/admin";

export default function SettingsRoute() {
  const [data, setData] = useState<SettingsData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchAdminSettings()
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err : new Error(String(err))));
  }, []);

  if (error) return <AdminErrorPanel error={error} />;
  if (!data) return <AdminLoading />;

  return (
    <SettingsPage
      profile={data.profile}
      staff={data.staff}
      departmentSettings={data.departmentSettings}
      isAdmin={data.isAdmin}
    />
  );
}
