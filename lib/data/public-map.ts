import "server-only";
import { desc, notInArray, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { complaints } from "@/db/schema";
import { DEPARTMENT_LABELS, type DepartmentType } from "@/lib/constants/departments";
import { formatIssueLabel } from "@/lib/constants/severity";

export type MapPriority = "Critical" | "High" | "Medium" | "Low" | "Resolved";

export type MapIssue = {
  id: string;
  title: string;
  category: string;
  lat: number;
  lng: number;
  priority: MapPriority;
  confidence: number;
  severityScore: number;
  department: string;
  status: string;
  reportedAt: string;
  imageUrl: string;
  addressText: string | null;
};

const SEVERITY_TO_PRIORITY: Record<string, MapPriority> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

const STATUS_LABELS: Record<string, string> = {
  open: "Open",
  in_progress: "Assigned",
  resolved: "Resolved",
};

// Public, unauthenticated - this powers the citizen-facing community map
// (/community-map), so it deliberately excludes "rejected" (not a genuine
// issue) and "duplicate" (already folded into another complaint's
// report_count, so it shouldn't appear as its own pin) statuses.
export async function getPublicMapIssues(limit = 500): Promise<MapIssue[]> {
  const rows = await db
    .select({
      id: complaints.id,
      yoloClass: complaints.yoloClass,
      severity: complaints.severity,
      status: complaints.status,
      department: complaints.department,
      imageUrl: complaints.imageUrl,
      thumbnailUrl: complaints.thumbnailUrl,
      addressText: complaints.addressText,
      priorityScore: complaints.priorityScore,
      yoloConfidence: complaints.yoloConfidence,
      lastReportedAt: complaints.lastReportedAt,
      lat: sql<number>`ST_Y(${complaints.location}::geometry)`.mapWith(Number),
      lng: sql<number>`ST_X(${complaints.location}::geometry)`.mapWith(Number),
    })
    .from(complaints)
    .where(notInArray(complaints.status, ["rejected", "duplicate"]))
    .orderBy(desc(complaints.lastReportedAt))
    .limit(limit);

  return rows.map((r) => ({
    id: r.id,
    title: formatIssueLabel(r.yoloClass),
    category: formatIssueLabel(r.yoloClass),
    lat: r.lat,
    lng: r.lng,
    priority: r.status === "resolved" ? "Resolved" : (SEVERITY_TO_PRIORITY[r.severity] ?? "Medium"),
    confidence: r.yoloConfidence != null ? Math.round(r.yoloConfidence * 100) : 0,
    severityScore: Math.round(r.priorityScore),
    department: DEPARTMENT_LABELS[r.department as DepartmentType] ?? r.department,
    status: STATUS_LABELS[r.status] ?? r.status,
    reportedAt: r.lastReportedAt.toISOString(),
    imageUrl: r.thumbnailUrl ?? r.imageUrl,
    addressText: r.addressText,
  }));
}
