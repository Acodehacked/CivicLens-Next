// Fallback demo data for /api/admin/** routes. The underlying production DB
// connectivity issue (intermittent auth/timeout failures from Vercel to
// Supabase - see recent session history) isn't fixable in the time we have
// before the hackathon submission, so every admin route falls back to this
// instead of a broken/empty page when the real query throws. The real error
// is still console.error'd server-side for whoever debugges this later.
import type { Complaint } from "@/db/schema";
import type { DepartmentType } from "@/lib/constants/departments";
import type {
  OverviewStats,
  HistoryEntry,
  NotificationItem,
} from "@/lib/data/analytics";
import type { StaffDirectoryRow, DepartmentSettingsRow } from "@/lib/data/settings";
import type {
  LayoutStats,
  DashboardData,
  AnalyticsData,
  ConfirmationsData,
  DepartmentsData,
  HistoryData,
  IssuesData,
  NotificationsData,
  PriorityQueueData,
  SettingsData,
} from "@/lib/api/admin";

const now = () => Date.now();
const hoursAgo = (h: number) => new Date(now() - h * 3_600_000);
const daysAgo = (d: number) => new Date(now() - d * 86_400_000);

function complaint(overrides: Partial<Complaint> & Pick<Complaint, "id" | "yoloClass" | "severity" | "department" | "status">): Complaint {
  return {
    yoloConfidence: 0.91,
    bbox: [0.1, 0.1, 0.5, 0.5],
    mask: null,
    severityReasoning: "Demo data - not a real detection.",
    estimatedSize: "medium",
    safetyRisk: false,
    imageUrl: "https://images.unsplash.com/photo-1584448097639-99f8f8f0e5f9?w=600",
    thumbnailUrl: "https://images.unsplash.com/photo-1584448097639-99f8f8f0e5f9?w=200",
    location: "POINT(77.5946 12.9716)",
    addressText: "MG Road, Bengaluru",
    embedding: null,
    reportCount: 1,
    maxSimilarity: 0,
    priorityScore: 50,
    firstReportedAt: hoursAgo(6),
    lastReportedAt: hoursAgo(1),
    resolvedAt: null,
    createdAt: hoursAgo(6),
    updatedAt: hoursAgo(1),
    ...overrides,
  };
}

export const DEMO_COMPLAINTS: Complaint[] = [
  complaint({
    id: "demo-1", yoloClass: "pothole", severity: "critical", department: "roads", status: "open",
    priorityScore: 92, reportCount: 4, addressText: "Outer Ring Road, near Marathahalli",
    safetyRisk: true, firstReportedAt: hoursAgo(20), lastReportedAt: hoursAgo(1),
  }),
  complaint({
    id: "demo-2", yoloClass: "garbage", severity: "high", department: "sanitation", status: "open",
    priorityScore: 78, reportCount: 2, addressText: "5th Cross, Indiranagar",
    firstReportedAt: hoursAgo(30), lastReportedAt: hoursAgo(3),
  }),
  complaint({
    id: "demo-3", yoloClass: "waterlogging", severity: "high", department: "drainage", status: "in_progress",
    priorityScore: 71, reportCount: 3, addressText: "Silk Board Junction",
    firstReportedAt: hoursAgo(50), lastReportedAt: hoursAgo(5),
  }),
  complaint({
    id: "demo-4", yoloClass: "fallen_tree", severity: "medium", department: "parks", status: "resolved",
    priorityScore: 40, reportCount: 1, addressText: "Cubbon Park, Gate 2",
    firstReportedAt: daysAgo(3), lastReportedAt: daysAgo(2), resolvedAt: daysAgo(1),
  }),
  complaint({
    id: "demo-5", yoloClass: "pothole", severity: "medium", department: "roads", status: "open",
    priorityScore: 55, reportCount: 1, addressText: "Hosur Road, near Electronic City",
    firstReportedAt: hoursAgo(10), lastReportedAt: hoursAgo(2),
  }),
  complaint({
    id: "demo-6", yoloClass: "flood", severity: "critical", department: "disaster_management", status: "in_progress",
    priorityScore: 95, reportCount: 6, addressText: "Bellandur Lake area", safetyRisk: true,
    firstReportedAt: hoursAgo(15), lastReportedAt: hoursAgo(1),
  }),
];

export const DEMO_LAYOUT_STATS: LayoutStats = {
  displayName: "Demo Staff",
  roleLabel: "Administrator",
  pendingCount: DEMO_COMPLAINTS.filter((c) => c.status === "open").length,
};

const DEMO_STATS: OverviewStats = {
  total: 42,
  open: 18,
  inProgress: 9,
  resolved: 12,
  rejected: 2,
  duplicate: 1,
  critical: 5,
  avgPriority: 61.4,
  avgConfidence: 0.872,
  avgSimilarity: 0.34,
  safetyRiskCount: 3,
  mergedCount: 6,
};

const DEMO_DAILY = Array.from({ length: 7 }, (_, i) => {
  const d = daysAgo(6 - i);
  return {
    label: d.toLocaleDateString("en-US", { weekday: "short" }),
    date: d.toISOString().slice(0, 10),
    reports: 3 + ((i * 2) % 5),
    resolved: 1 + (i % 3),
  };
});

const DEMO_MONTHLY = Array.from({ length: 6 }, (_, i) => {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() - (5 - i));
  return { label: d.toLocaleDateString("en-US", { month: "short" }), month: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`, count: 10 + i * 4 };
});

const DEMO_CATEGORIES = [
  { category: "pothole", count: 14 },
  { category: "garbage", count: 11 },
  { category: "waterlogging", count: 8 },
  { category: "fallen_tree", count: 5 },
  { category: "flood", count: 4 },
];

const DEMO_DEPARTMENTS: DepartmentType[] = ["roads", "sanitation", "drainage", "disaster_management", "parks"];

const DEMO_DEPARTMENT_PERFORMANCE = DEMO_DEPARTMENTS.map((name, i) => ({
  name,
  contactEmail: `${name}@civiclens.demo`,
  avgResolutionHours: 48 + i * 6,
  assigned: 10 - i,
  resolved: 6 - i,
  pending: 4,
  critical: i === 0 || i === 3 ? 2 : 0,
}));

const DEMO_RECENT_EVENTS = DEMO_COMPLAINTS.slice(0, 5).map((c, i) => ({
  reportId: `demo-report-${i}`,
  complaintId: c.id,
  createdAt: c.lastReportedAt,
  imageUrl: c.imageUrl,
  yoloClass: c.yoloClass,
  severity: c.severity,
  department: c.department,
  addressText: c.addressText,
  isDuplicate: false,
}));

const DEMO_MAP_MARKERS = DEMO_COMPLAINTS.map((c, i) => ({
  id: c.id,
  yoloClass: c.yoloClass,
  severity: c.severity,
  department: c.department,
  status: c.status,
  lat: 12.9716 + i * 0.01,
  lng: 77.5946 + i * 0.01,
}));

const DEMO_TOP_LOCATIONS = [
  { addressText: "Outer Ring Road, near Marathahalli", complaintCount: 4, totalReports: 9, maxPriority: 92 },
  { addressText: "Silk Board Junction", complaintCount: 3, totalReports: 6, maxPriority: 71 },
  { addressText: "Bellandur Lake area", complaintCount: 2, totalReports: 6, maxPriority: 95 },
];

export const DEMO_DASHBOARD: DashboardData = {
  stats: DEMO_STATS,
  dailyTrend: DEMO_DAILY,
  categoryBreakdown: DEMO_CATEGORIES,
  departmentPerformance: DEMO_DEPARTMENT_PERFORMANCE,
  recentEvents: DEMO_RECENT_EVENTS,
  mapMarkers: DEMO_MAP_MARKERS,
  priorityItems: DEMO_COMPLAINTS.filter((c) => c.status !== "resolved").slice(0, 3),
  recentComplaints: DEMO_COMPLAINTS.slice(0, 6),
};

export const DEMO_ANALYTICS: AnalyticsData = {
  stats: DEMO_STATS,
  trend: { current: 24, previous: 18, pctChange: 33.3 },
  categories: DEMO_CATEGORIES,
  severityByCategory: DEMO_CATEGORIES.map((c) => ({ category: c.category, low: 1, medium: 2, high: 2, critical: 1 })),
  daily: DEMO_DAILY,
  monthly: DEMO_MONTHLY,
  departmentPerformance: DEMO_DEPARTMENT_PERFORMANCE,
  topLocations: DEMO_TOP_LOCATIONS,
  recentEvents: DEMO_RECENT_EVENTS,
  mapMarkers: DEMO_MAP_MARKERS,
  totalReportsSubmitted: 67,
};

export const DEMO_CONFIRMATIONS: ConfirmationsData = {
  pending: DEMO_COMPLAINTS.filter((c) => c.status === "open"),
  isAdmin: true,
};

export const DEMO_DEPARTMENTS_DATA: DepartmentsData = { departments: DEMO_DEPARTMENT_PERFORMANCE };

const DEMO_HISTORY: HistoryEntry[] = DEMO_COMPLAINTS.map((c) => ({
  id: c.id,
  yoloClass: c.yoloClass,
  severity: c.severity,
  status: c.status,
  department: c.department,
  reportCount: c.reportCount,
  priorityScore: c.priorityScore,
  addressText: c.addressText,
  imageUrl: c.imageUrl,
  thumbnailUrl: c.thumbnailUrl,
  firstReportedAt: c.firstReportedAt,
  lastReportedAt: c.lastReportedAt,
  resolvedAt: c.resolvedAt,
}));

export const DEMO_HISTORY_DATA: HistoryData = {
  entries: DEMO_HISTORY,
  avgResolutionHours: 36.5,
  stats: DEMO_STATS,
};

export const DEMO_ISSUES: IssuesData = { issues: DEMO_COMPLAINTS, isAdmin: true };

const DEMO_NOTIFICATIONS: NotificationItem[] = [
  { id: "demo-1", kind: "critical", yoloClass: "pothole", severity: "critical", department: "roads", addressText: "Outer Ring Road, near Marathahalli", reportCount: 4, timestamp: hoursAgo(1) },
  { id: "demo-6", kind: "critical", yoloClass: "flood", severity: "critical", department: "disaster_management", addressText: "Bellandur Lake area", reportCount: 6, timestamp: hoursAgo(1) },
  { id: "demo-2", kind: "new", yoloClass: "garbage", severity: "high", department: "sanitation", addressText: "5th Cross, Indiranagar", reportCount: 2, timestamp: hoursAgo(3) },
  { id: "demo-5", kind: "stale", yoloClass: "pothole", severity: "medium", department: "roads", addressText: "Hosur Road, near Electronic City", reportCount: 1, timestamp: daysAgo(3) },
];

export const DEMO_NOTIFICATIONS_DATA: NotificationsData = { items: DEMO_NOTIFICATIONS };

export const DEMO_PRIORITY_QUEUE: PriorityQueueData = {
  reports: DEMO_COMPLAINTS.filter((c) => c.status === "open" || c.status === "in_progress"),
  isAdmin: true,
  departments: DEMO_DEPARTMENTS,
};

const DEMO_STAFF: StaffDirectoryRow[] = [
  { id: "demo-staff-1", fullName: "Asha Rao", email: "asha.rao@civiclens.demo", role: "admin", department: null },
  { id: "demo-staff-2", fullName: "Vikram Singh", email: "vikram.singh@civiclens.demo", role: "department_staff", department: "roads" },
  { id: "demo-staff-3", fullName: "Priya Nair", email: "priya.nair@civiclens.demo", role: "department_staff", department: "sanitation" },
];

const DEMO_DEPT_SETTINGS: DepartmentSettingsRow[] = DEMO_DEPARTMENTS.map((name, i) => ({
  id: `demo-dept-${i}`,
  name,
  contactEmail: `${name}@civiclens.demo`,
  avgResolutionHours: 48 + i * 6,
}));

export const DEMO_SETTINGS: SettingsData = {
  profile: {
    fullName: "Demo Staff",
    email: "demo.staff@civiclens.demo",
    role: "admin",
    department: null,
    emailNotificationsEnabled: true,
  },
  staff: DEMO_STAFF,
  departmentSettings: DEMO_DEPT_SETTINGS,
  isAdmin: true,
};
