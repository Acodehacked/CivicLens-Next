"use client";

import { useEffect, useState } from "react";
import HistoryPage from "@/app/admin/pages/history/HistoryPage";
import AdminErrorPanel from "../components/AdminErrorPanel";
import AdminLoading from "../components/AdminLoading";
import { fetchHistory, type HistoryData } from "@/lib/api/admin";

export default function HistoryRoute() {
  const [data, setData] = useState<HistoryData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchHistory()
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err : new Error(String(err))));
  }, []);

  if (error) return <AdminErrorPanel error={error} />;
  if (!data) return <AdminLoading />;

  return <HistoryPage entries={data.entries} avgResolutionHours={data.avgResolutionHours} stats={data.stats} />;
}
