import "server-only";
import { and, desc, eq, gte, isNotNull, or, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { complaints, departments, reports } from "@/db/schema";
import type { DepartmentType } from "@/lib/constants/departments";

// Every function here takes `department: DepartmentType | null` - null means
// "no filter" (admin sees everything), a value scopes to that one
// department (what a department_staff account is restricted to). This
// mirrors the same admin/department_staff split enforced by
// lib/auth/staff-context.ts everywhere else in /admin.

function departmentScope(department: DepartmentType | null) {
  return department ? eq(complaints.department, department) : undefined;
}

export type OverviewStats = {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  rejected: number;
  duplicate: number;
  critical: number;
  avgPriority: number;
  avgConfidence: number;
  avgSimilarity: number;
  safetyRiskCount: number;
  mergedCount: number;
};

export async function getOverviewStats(department: DepartmentType | null): Promise<OverviewStats> {
  const [stats] = await db
    .select({
      total: sql<number>`count(*)`.mapWith(Number),
      open: sql<number>`count(*) filter (where ${complaints.status} = 'open')`.mapWith(Number),
      inProgress: sql<number>`count(*) filter (where ${complaints.status} = 'in_progress')`.mapWith(Number),
      resolved: sql<number>`count(*) filter (where ${complaints.status} = 'resolved')`.mapWith(Number),
      rejected: sql<number>`count(*) filter (where ${complaints.status} = 'rejected')`.mapWith(Number),
      duplicate: sql<number>`count(*) filter (where ${complaints.status} = 'duplicate')`.mapWith(Number),
      critical: sql<number>`count(*) filter (where ${complaints.severity} = 'critical')`.mapWith(Number),
      avgPriority: sql<number>`coalesce(avg(${complaints.priorityScore}), 0)`.mapWith(Number),
      avgConfidence: sql<number>`coalesce(avg(${complaints.yoloConfidence}), 0)`.mapWith(Number),
      avgSimilarity: sql<number>`coalesce(avg(${complaints.maxSimilarity}), 0)`.mapWith(Number),
      safetyRiskCount: sql<number>`count(*) filter (where ${complaints.safetyRisk} = true)`.mapWith(Number),
      mergedCount: sql<number>`count(*) filter (where ${complaints.reportCount} > 1)`.mapWith(Number),
    })
    .from(complaints)
    .where(departmentScope(department));

  return stats;
}

export type TrendComparison = { current: number; previous: number; pctChange: number | null };

// Real period-over-period change (e.g. this week vs last week), not a
// fabricated trend arrow - null pctChange means "no prior-period data to
// compare against" rather than showing a misleading 0%/infinite change.
export async function getTrendComparison(
  department: DepartmentType | null,
  days = 7
): Promise<TrendComparison> {
  const scope = departmentScope(department);
  const now = Date.now();
  const currentStart = new Date(now - days * 86_400_000).toISOString();
  const previousStart = new Date(now - days * 2 * 86_400_000).toISOString();

  const [row] = await db
    .select({
      current: sql<number>`count(*) filter (where ${complaints.firstReportedAt} >= ${currentStart}::timestamptz)`.mapWith(Number),
      previous: sql<number>`count(*) filter (where ${complaints.firstReportedAt} >= ${previousStart}::timestamptz and ${complaints.firstReportedAt} < ${currentStart}::timestamptz)`.mapWith(Number),
    })
    .from(complaints)
    .where(scope);

  const pctChange =
    row.previous > 0 ? ((row.current - row.previous) / row.previous) * 100 : row.current > 0 ? 100 : null;

  return { current: row.current, previous: row.previous, pctChange };
}

export type CategoryCount = { category: string; count: number };

export async function getCategoryBreakdown(department: DepartmentType | null): Promise<CategoryCount[]> {
  const rows = await db
    .select({
      category: complaints.yoloClass,
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(complaints)
    .where(departmentScope(department))
    .groupBy(complaints.yoloClass)
    .orderBy(desc(sql`count(*)`));

  return rows;
}

export type SeverityByCategory = { category: string; low: number; medium: number; high: number; critical: number };

export async function getSeverityByCategory(department: DepartmentType | null): Promise<SeverityByCategory[]> {
  const rows = await db
    .select({
      category: complaints.yoloClass,
      severity: complaints.severity,
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(complaints)
    .where(departmentScope(department))
    .groupBy(complaints.yoloClass, complaints.severity);

  const byCategory = new Map<string, SeverityByCategory>();
  for (const row of rows) {
    const entry = byCategory.get(row.category) ?? { category: row.category, low: 0, medium: 0, high: 0, critical: 0 };
    entry[row.severity as "low" | "medium" | "high" | "critical"] = row.count;
    byCategory.set(row.category, entry);
  }
  return Array.from(byCategory.values());
}

export type DailyTrendPoint = { label: string; date: string; reports: number; resolved: number };

export async function getDailyTrend(department: DepartmentType | null, days = 7): Promise<DailyTrendPoint[]> {
  const scope = departmentScope(department);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const windowFilter = or(gte(complaints.firstReportedAt, since), gte(complaints.resolvedAt, since));
  const where = scope ? and(scope, windowFilter) : windowFilter;

  const rows = await db
    .select({
      firstReportedAt: complaints.firstReportedAt,
      resolvedAt: complaints.resolvedAt,
      status: complaints.status,
    })
    .from(complaints)
    .where(where);

  const buckets = new Map<string, { reports: number; resolved: number }>();
  const dayKeys: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    dayKeys.push(key);
    buckets.set(key, { reports: 0, resolved: 0 });
  }

  for (const row of rows) {
    const reportedKey = new Date(row.firstReportedAt).toISOString().slice(0, 10);
    if (buckets.has(reportedKey)) buckets.get(reportedKey)!.reports += 1;

    if (row.status === "resolved" && row.resolvedAt) {
      const resolvedKey = new Date(row.resolvedAt).toISOString().slice(0, 10);
      if (buckets.has(resolvedKey)) buckets.get(resolvedKey)!.resolved += 1;
    }
  }

  return dayKeys.map((key) => {
    const bucket = buckets.get(key)!;
    const label = new Date(key).toLocaleDateString("en-US", { weekday: "short" });
    return { label, date: key, ...bucket };
  });
}

export type MonthlyTrendPoint = { label: string; month: string; count: number };

export async function getMonthlyTrend(department: DepartmentType | null, months = 6): Promise<MonthlyTrendPoint[]> {
  const scope = departmentScope(department);
  const since = new Date();
  since.setMonth(since.getMonth() - (months - 1));
  since.setDate(1);
  since.setHours(0, 0, 0, 0);

  const where = scope ? and(scope, gte(complaints.firstReportedAt, since)) : gte(complaints.firstReportedAt, since);

  const rows = await db.select({ firstReportedAt: complaints.firstReportedAt }).from(complaints).where(where);

  const buckets = new Map<string, number>();
  const monthKeys: string[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthKeys.push(key);
    buckets.set(key, 0);
  }

  for (const row of rows) {
    const d = new Date(row.firstReportedAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (buckets.has(key)) buckets.set(key, buckets.get(key)! + 1);
  }

  return monthKeys.map((key) => {
    const [year, month] = key.split("-");
    const label = new Date(Number(year), Number(month) - 1, 1).toLocaleDateString("en-US", { month: "short" });
    return { label, month: key, count: buckets.get(key)! };
  });
}

export type DepartmentPerformanceRow = {
  name: DepartmentType;
  contactEmail: string | null;
  avgResolutionHours: number | null;
  assigned: number;
  resolved: number;
  pending: number;
  critical: number;
};

// Not department-scoped - this IS the per-department breakdown, always
// across all 5 (a department_staff viewing their own dashboard still sees
// this as a full directory, same as the citizen-facing /departments page).
export async function getDepartmentPerformance(): Promise<DepartmentPerformanceRow[]> {
  const rows = await db
    .select({
      name: departments.name,
      contactEmail: departments.contactEmail,
      avgResolutionHours: departments.avgResolutionHours,
      assigned: sql<number>`count(${complaints.id})`.mapWith(Number),
      resolved: sql<number>`count(${complaints.id}) filter (where ${complaints.status} = 'resolved')`.mapWith(Number),
      pending: sql<number>`count(${complaints.id}) filter (where ${complaints.status} in ('open', 'in_progress'))`.mapWith(Number),
      critical: sql<number>`count(${complaints.id}) filter (where ${complaints.severity} = 'critical')`.mapWith(Number),
    })
    .from(departments)
    .leftJoin(complaints, eq(complaints.department, departments.name))
    .groupBy(departments.id, departments.name, departments.contactEmail, departments.avgResolutionHours);

  return rows;
}

export type TopLocationRow = {
  addressText: string;
  complaintCount: number;
  totalReports: number;
  maxPriority: number;
};

export async function getTopLocations(department: DepartmentType | null, limit = 8): Promise<TopLocationRow[]> {
  const scope = departmentScope(department);
  const notNull = isNotNull(complaints.addressText);
  const where = scope ? and(scope, notNull) : notNull;

  return db
    .select({
      addressText: sql<string>`${complaints.addressText}`,
      complaintCount: sql<number>`count(*)`.mapWith(Number),
      totalReports: sql<number>`coalesce(sum(${complaints.reportCount}), 0)`.mapWith(Number),
      maxPriority: sql<number>`coalesce(max(${complaints.priorityScore}), 0)`.mapWith(Number),
    })
    .from(complaints)
    .where(where)
    .groupBy(complaints.addressText)
    .orderBy(desc(sql`count(*)`))
    .limit(limit);
}

export type RecentEvent = {
  reportId: string;
  complaintId: string;
  createdAt: Date;
  imageUrl: string;
  yoloClass: string | null;
  severity: string | null;
  department: string | null;
  addressText: string | null;
  isDuplicate: boolean;
};

export async function getRecentEvents(department: DepartmentType | null, limit = 6): Promise<RecentEvent[]> {
  const scope = department ? eq(complaints.department, department) : undefined;

  const rows = await db
    .select({
      reportId: reports.id,
      complaintId: complaints.id,
      createdAt: reports.createdAt,
      imageUrl: reports.imageUrl,
      yoloClass: complaints.yoloClass,
      severity: complaints.severity,
      department: complaints.department,
      addressText: complaints.addressText,
      isDuplicateOf: reports.isDuplicateOf,
    })
    .from(reports)
    .innerJoin(complaints, eq(reports.complaintId, complaints.id))
    .where(scope)
    .orderBy(desc(reports.createdAt))
    .limit(limit);

  return rows.map((r) => ({ ...r, isDuplicate: r.isDuplicateOf !== null }));
}

export type MapMarker = {
  id: string;
  yoloClass: string | null;
  severity: string;
  department: string;
  status: string;
  lat: number;
  lng: number;
};

// PostGIS is confirmed installed on this project - ST_Y/ST_X extract
// lat/lng from the opaque `geography(Point,4326)` column Drizzle can't
// otherwise read (see db/schema.ts's geographyPoint comment).
export async function getMapMarkers(department: DepartmentType | null, limit = 300): Promise<MapMarker[]> {
  return db
    .select({
      id: complaints.id,
      yoloClass: complaints.yoloClass,
      severity: complaints.severity,
      department: complaints.department,
      status: complaints.status,
      lat: sql<number>`ST_Y(${complaints.location}::geometry)`.mapWith(Number),
      lng: sql<number>`ST_X(${complaints.location}::geometry)`.mapWith(Number),
    })
    .from(complaints)
    .where(departmentScope(department))
    .limit(limit);
}

// Total individual photo submissions (not deduplicated complaints) - a
// citizen re-reporting the same pothole counts once per photo here, since
// that's genuinely how many images the detection pipeline has processed.
export async function getTotalReportsSubmitted(department: DepartmentType | null): Promise<number> {
  const scope = department ? eq(complaints.department, department) : undefined;
  const [row] = await db
    .select({ count: sql<number>`count(*)`.mapWith(Number) })
    .from(reports)
    .innerJoin(complaints, eq(reports.complaintId, complaints.id))
    .where(scope);
  return row.count;
}

export type HistoryEntry = {
  id: string;
  yoloClass: string | null;
  severity: string;
  status: string;
  department: string;
  reportCount: number;
  priorityScore: number;
  addressText: string | null;
  imageUrl: string;
  thumbnailUrl: string | null;
  firstReportedAt: Date;
  lastReportedAt: Date;
  resolvedAt: Date | null;
};

// Every complaint, most recently active first - real chain-of-custody
// data (what it is, where, current status, when first/last reported and
// resolved). No fabricated "actor" concept - we don't log who performed
// which action, only the complaint's current state.
export async function getHistoryLog(department: DepartmentType | null, limit = 100): Promise<HistoryEntry[]> {
  return db
    .select({
      id: complaints.id,
      yoloClass: complaints.yoloClass,
      severity: complaints.severity,
      status: complaints.status,
      department: complaints.department,
      reportCount: complaints.reportCount,
      priorityScore: complaints.priorityScore,
      addressText: complaints.addressText,
      imageUrl: complaints.imageUrl,
      thumbnailUrl: complaints.thumbnailUrl,
      firstReportedAt: complaints.firstReportedAt,
      lastReportedAt: complaints.lastReportedAt,
      resolvedAt: complaints.resolvedAt,
    })
    .from(complaints)
    .where(departmentScope(department))
    .orderBy(desc(complaints.lastReportedAt))
    .limit(limit);
}

// Real average time-to-resolution in hours, computed from resolved_at -
// first_reported_at on complaints that actually have a resolved_at (set by
// the DB trigger on status change - see db/schema.ts). Null if nothing has
// been resolved yet, rather than a misleading 0.
export async function getAvgResolutionHours(department: DepartmentType | null): Promise<number | null> {
  const scope = departmentScope(department);
  const resolvedOnly = isNotNull(complaints.resolvedAt);
  const where = scope ? and(scope, resolvedOnly) : resolvedOnly;

  const [row] = await db
    .select({
      avgHours: sql<number | null>`avg(extract(epoch from (${complaints.resolvedAt} - ${complaints.firstReportedAt})) / 3600)`,
      count: sql<number>`count(*)`.mapWith(Number),
    })
    .from(complaints)
    .where(where);

  if (!row || row.count === 0 || row.avgHours == null) return null;
  return Number(row.avgHours);
}

export type NotificationItem = {
  id: string;
  kind: "new" | "critical" | "stale";
  yoloClass: string | null;
  severity: string;
  department: string;
  addressText: string | null;
  reportCount: number;
  timestamp: Date;
};

// Derived, not persisted - there's no notifications table (and therefore
// no real read/unread state to track), so this recomputes "what needs
// attention right now" from live complaint data every time it's loaded:
// unconfirmed new reports, unresolved critical severity, and open issues
// that have sat for more than 48 hours.
export async function getNotificationFeed(department: DepartmentType | null, limit = 30): Promise<NotificationItem[]> {
  const scope = departmentScope(department);

  const newOnes = await db
    .select({
      id: complaints.id,
      yoloClass: complaints.yoloClass,
      severity: complaints.severity,
      department: complaints.department,
      addressText: complaints.addressText,
      reportCount: complaints.reportCount,
      timestamp: complaints.firstReportedAt,
    })
    .from(complaints)
    .where(scope ? and(scope, eq(complaints.status, "open")) : eq(complaints.status, "open"))
    .orderBy(desc(complaints.firstReportedAt))
    .limit(limit);

  const staleCutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const staleFilter = and(
    eq(complaints.status, "open"),
    sql`${complaints.firstReportedAt} < ${staleCutoff.toISOString()}::timestamptz`
  );
  const stale = await db
    .select({
      id: complaints.id,
      yoloClass: complaints.yoloClass,
      severity: complaints.severity,
      department: complaints.department,
      addressText: complaints.addressText,
      reportCount: complaints.reportCount,
      timestamp: complaints.firstReportedAt,
    })
    .from(complaints)
    .where(scope ? and(scope, staleFilter) : staleFilter)
    .orderBy(complaints.firstReportedAt)
    .limit(limit);

  const items: NotificationItem[] = [
    ...newOnes.map((r) => ({ ...r, kind: "critical" as const, id: r.id })).filter((r) => r.severity === "critical"),
    ...stale.map((r) => ({ ...r, kind: "stale" as const })),
    ...newOnes.map((r) => ({ ...r, kind: "new" as const })),
  ];

  // De-dupe by id+kind (a complaint can legitimately appear once per
  // relevant kind - e.g. both "new" and "critical" - but not twice for the
  // same kind), most recent first.
  const seen = new Set<string>();
  const deduped = items.filter((item) => {
    const key = `${item.kind}:${item.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return deduped
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);
}
