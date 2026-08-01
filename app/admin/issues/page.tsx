"use client";

import { useEffect, useState } from "react";
import IssuesTable from "./IssuesTable";
import AdminErrorPanel from "../components/AdminErrorPanel";
import AdminLoading from "../components/AdminLoading";
import { fetchIssues, type IssuesData } from "@/lib/api/admin";

export default function IssuesPage() {
  const [data, setData] = useState<IssuesData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchIssues()
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err : new Error(String(err))));
  }, []);

  if (error) return <AdminErrorPanel error={error} />;
  if (!data) return <AdminLoading />;

  return <IssuesTable issues={data.issues} isAdmin={data.isAdmin} />;
}
