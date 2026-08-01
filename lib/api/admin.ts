// Client-side fetch helpers for /admin/** pages. Mirrors the fetch/throw
// pattern in lib/api/civiclens.ts. Each /admin/* page used to run its DB
// queries directly in a Server Component; that's been moved behind
// app/api/admin/** so a failure surfaces as a real, visible error in the
// browser instead of Next's redacted production error boundary.
import type { Complaint } from "@/db/schema";
import type { DepartmentType } from "@/lib/constants/departments";
import type {
  OverviewStats,
  TrendComparison,
  CategoryCount,
  SeverityByCategory,
  DailyTrendPoint,
  MonthlyTrendPoint,
  DepartmentPerformanceRow,
  TopLocationRow,
  RecentEvent,
  MapMarker,
  HistoryEntry,
  NotificationItem,
} from "@/lib/data/analytics";
import type { StaffDirectoryRow, DepartmentSettingsRow } from "@/lib/data/settings";

async function fetchAdmin<T>(path: string): Promise<T> {
  const res = await fetch(path);
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error ?? "Failed to load admin data.");
  }
  return data as T;
}

export type LayoutStats = { displayName: string; roleLabel: string; pendingCount: number };
export function fetchLayoutStats() {
  return fetchAdmin<LayoutStats>("/api/admin/layout-stats");
}

export type DashboardData = {
  stats: OverviewStats;
  dailyTrend: DailyTrendPoint[];
  categoryBreakdown: CategoryCount[];
  departmentPerformance: DepartmentPerformanceRow[];
  recentEvents: RecentEvent[];
  mapMarkers: MapMarker[];
  priorityItems: Complaint[];
  recentComplaints: Complaint[];
};
export function fetchDashboard() {
  return fetchAdmin<DashboardData>("/api/admin/dashboard");
}

export type AnalyticsData = {
  stats: OverviewStats;
  trend: TrendComparison;
  categories: CategoryCount[];
  severityByCategory: SeverityByCategory[];
  daily: DailyTrendPoint[];
  monthly: MonthlyTrendPoint[];
  departmentPerformance: DepartmentPerformanceRow[];
  topLocations: TopLocationRow[];
  recentEvents: RecentEvent[];
  mapMarkers: MapMarker[];
  totalReportsSubmitted: number;
};
export function fetchAnalytics() {
  return fetchAdmin<AnalyticsData>("/api/admin/analytics");
}

export type ConfirmationsData = { pending: Complaint[]; isAdmin: boolean };
export function fetchConfirmations() {
  return fetchAdmin<ConfirmationsData>("/api/admin/confirmations");
}

export type DepartmentsData = { departments: DepartmentPerformanceRow[] };
export function fetchAdminDepartments() {
  return fetchAdmin<DepartmentsData>("/api/admin/departments");
}

export type HistoryData = { entries: HistoryEntry[]; avgResolutionHours: number | null; stats: OverviewStats };
export function fetchHistory() {
  return fetchAdmin<HistoryData>("/api/admin/history");
}

export type IssuesData = { issues: Complaint[]; isAdmin: boolean };
export function fetchIssues() {
  return fetchAdmin<IssuesData>("/api/admin/issues");
}

export type NotificationsData = { items: NotificationItem[] };
export function fetchNotifications() {
  return fetchAdmin<NotificationsData>("/api/admin/notifications");
}

export type PriorityQueueData = { reports: Complaint[]; isAdmin: boolean; departments: readonly DepartmentType[] };
export function fetchPriorityQueue() {
  return fetchAdmin<PriorityQueueData>("/api/admin/priority-queue");
}

export type SettingsData = {
  profile: {
    fullName: string | null;
    email: string | null;
    role: "admin" | "department_staff";
    department: DepartmentType | null;
    emailNotificationsEnabled: boolean;
  };
  staff: StaffDirectoryRow[];
  departmentSettings: DepartmentSettingsRow[];
  isAdmin: boolean;
};
export function fetchAdminSettings() {
  return fetchAdmin<SettingsData>("/api/admin/settings");
}
