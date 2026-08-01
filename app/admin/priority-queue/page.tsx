"use client";

import { useEffect, useState } from "react";
import PriorityQueuePage from "@/app/admin/pages/priority-queue/PriorityQueuePage";
import AdminErrorPanel from "../components/AdminErrorPanel";
import AdminLoading from "../components/AdminLoading";
import { fetchPriorityQueue, type PriorityQueueData } from "@/lib/api/admin";

export default function PriorityQueueRoute() {
  const [data, setData] = useState<PriorityQueueData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchPriorityQueue()
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err : new Error(String(err))));
  }, []);

  if (error) return <AdminErrorPanel error={error} />;
  if (!data) return <AdminLoading />;

  return (
    <PriorityQueuePage
      reports={data.reports}
      isAdmin={data.isAdmin}
      departments={data.departments}
    />
  );
}
