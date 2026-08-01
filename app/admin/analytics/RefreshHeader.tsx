"use client";

import AnalyticsHeader from "@/app/admin/pages/analytics/components/AnalyticsHeader";

// Data now lives in the parent page's own client-side fetch (see
// AnalyticsPage) rather than being re-fetched via router.refresh() /
// re-rendering a Server Component, so the refresh action is passed down
// from there instead of this component owning it.
export default function RefreshHeader({
  onRefresh,
  isRefreshing,
}: {
  onRefresh: () => void;
  isRefreshing: boolean;
}) {
  return <AnalyticsHeader onRefresh={onRefresh} isRefreshing={isRefreshing} />;
}
