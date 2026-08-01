"use client";

import { useEffect, useState } from "react";
import NotificationsPage from "@/app/admin/pages/notifications/NotificationsPage";
import AdminErrorPanel from "../components/AdminErrorPanel";
import AdminLoading from "../components/AdminLoading";
import { fetchNotifications, type NotificationsData } from "@/lib/api/admin";

export default function NotificationsRoute() {
  const [data, setData] = useState<NotificationsData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchNotifications()
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err : new Error(String(err))));
  }, []);

  if (error) return <AdminErrorPanel error={error} />;
  if (!data) return <AdminLoading />;

  return <NotificationsPage items={data.items} />;
}
