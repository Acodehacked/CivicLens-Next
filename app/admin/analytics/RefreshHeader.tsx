"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import AnalyticsHeader from "@/app/admin/pages/analytics/components/AnalyticsHeader";

export default function RefreshHeader() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <AnalyticsHeader
      onRefresh={() => startTransition(() => router.refresh())}
      isRefreshing={isPending}
    />
  );
}
