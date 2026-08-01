"use client";

import { useEffect, useState } from "react";
import DepartmentsPage from "@/app/admin/pages/departments/DepartmentsPage";
import AdminErrorPanel from "../components/AdminErrorPanel";
import AdminLoading from "../components/AdminLoading";
import { fetchAdminDepartments, type DepartmentsData } from "@/lib/api/admin";

export default function DepartmentsRoute() {
  const [data, setData] = useState<DepartmentsData | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchAdminDepartments()
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err : new Error(String(err))));
  }, []);

  if (error) return <AdminErrorPanel error={error} />;
  if (!data) return <AdminLoading />;

  return <DepartmentsPage departments={data.departments} />;
}
