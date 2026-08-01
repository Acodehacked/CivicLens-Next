"use client";

import { useEffect, useState } from "react";
import ConfirmationsQueue from "./ConfirmationsQueue";
import AdminErrorPanel from "../components/AdminErrorPanel";
import AdminLoading from "../components/AdminLoading";
import { fetchConfirmations, type ConfirmationsData } from "@/lib/api/admin";

export default function ConfirmationsPage() {
  const [data, setData] = useState<ConfirmationsData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchConfirmations()
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err : new Error(String(err))));
  }, []);

  if (error) return <AdminErrorPanel error={error} />;
  if (!data) return <AdminLoading />;

  return <ConfirmationsQueue pending={data.pending} isAdmin={data.isAdmin} />;
}
