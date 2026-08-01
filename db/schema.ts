
/**
 * Drizzle ORM schema for the Next.js frontend, mirroring the live Supabase
 * database defined in db/schema.sql. schema.sql (run directly in the
 * Supabase SQL editor) is the source of truth — this file is for typed
 * queries from Next.js, not for `drizzle-kit push`/`generate`. If you ever
 * run drizzle-kit against this schema, point it at introspection only, or
 * you risk it trying to recreate objects (RLS policies, triggers, the HNSW
 * index) that Drizzle can't fully express and that already exist.
 *
 * Usage in the Next.js app:
 *   npm install drizzle-orm postgres
 *   // db/index.ts
 *   import { drizzle } from "drizzle-orm/postgres-js";
 *   import postgres from "postgres";
 *   import * as schema from "./schema";
 *   const client = postgres(process.env.DATABASE_URL!); // Supabase connection string, NOT the anon/service key
 *   export const db = drizzle(client, { schema });
 *
 * Note: connecting Drizzle directly to Postgres bypasses Supabase's RLS
 * unless you use the Supabase-provided connection string with the
 * appropriate role, or execute queries with `set role authenticated` +
 * `set request.jwt.claims`. For anything that must respect RLS (per-user
 * reads/writes from the browser), prefer the Supabase JS client instead —
 * use this Drizzle schema for typed server-side/admin queries where RLS is
 * intentionally bypassed (e.g. from a trusted server context).
 */

import { relations } from "drizzle-orm";
import {
  boolean,
  customType,
  doublePrecision,
  integer,
  jsonb,
  pgEnum,
  pgSchema,
  pgTable,
  text,
  timestamp,
  uuid,
  vector,
} from "drizzle-orm/pg-core";

// ---------------------------------------------------------------------
// auth.users — managed by Supabase Auth. Declared minimally here just so
// foreign keys (profiles.id, reports.reporter_id) type-check; never create
// or migrate this table from Drizzle.
// ---------------------------------------------------------------------
const authSchema = pgSchema("auth");
export const authUsers = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

// ---------------------------------------------------------------------
// Custom column type for PostGIS `geography(Point, 4326)`. Drizzle has no
// native PostGIS support, so this is treated as an opaque string (the raw
// EWKB hex Postgres/postgres.js returns, or a WKT string like
// "POINT(lng lat)" on insert). For actual geospatial queries (nearby
// search, distance), use the FastAPI backend's /process-report and
// /similar-reports endpoints (which call the match_nearby_complaint /
// find_similar_complaints SQL functions) rather than querying geography
// columns directly through Drizzle's query builder.
// ---------------------------------------------------------------------
const geographyPoint = customType<{ data: string }>({
  dataType() {
    return "geography(Point, 4326)";
  },
});

// ---------------------------------------------------------------------
// ENUMS — keep in sync with db/schema.sql
// ---------------------------------------------------------------------
export const severityLevelEnum = pgEnum("severity_level", [
  "low",
  "medium",
  "high",
  "critical",
]);

export const complaintStatusEnum = pgEnum("complaint_status", [
  "open",
  "in_progress",
  "resolved",
  "rejected",
  "duplicate",
]);

// Scoped to exactly the classes the detection model outputs today:
// pothole -> roads, garbage -> sanitation, waterlogging -> drainage,
// flood -> disaster_management, fallen_tree -> parks.
export const departmentTypeEnum = pgEnum("department_type", [
  "roads",
  "sanitation",
  "drainage",
  "disaster_management",
  "parks",
]);

export const userRoleEnum = pgEnum("user_role", [
  "citizen",
  "department_staff",
  "admin",
]);

// ---------------------------------------------------------------------
// DEPARTMENTS
// ---------------------------------------------------------------------
export const departments = pgTable("departments", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: departmentTypeEnum("name").notNull().unique(),
  contactEmail: text("contact_email"),
  avgResolutionHours: integer("avg_resolution_hours").default(72),
});

// ---------------------------------------------------------------------
// COMPLAINTS
// ---------------------------------------------------------------------
export const complaints = pgTable("complaints", {
  id: uuid("id").primaryKey().defaultRandom(),
  yoloClass: text("yolo_class").notNull(),
  yoloConfidence: doublePrecision("yolo_confidence"),
  bbox: jsonb("bbox").$type<number[]>(), // normalized [x1, y1, x2, y2]
  mask: jsonb("mask").$type<number[][]>(), // normalized [[x, y], ...] polygon
  severity: severityLevelEnum("severity").notNull().default("medium"),
  severityReasoning: text("severity_reasoning"),
  estimatedSize: text("estimated_size"),
  safetyRisk: boolean("safety_risk").default(false),
  imageUrl: text("image_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  location: geographyPoint("location").notNull(),
  addressText: text("address_text"),
  embedding: vector("embedding", { dimensions: 512 }),
  department: departmentTypeEnum("department").notNull().default("roads"),
  status: complaintStatusEnum("status").notNull().default("open"),
  reportCount: integer("report_count").notNull().default(1),
  // Highest CLIP cosine similarity seen from a confirmed duplicate report —
  // feeds a "genuineness" boost into priority_score. 0 until corroborated.
  maxSimilarity: doublePrecision("max_similarity").notNull().default(0),
  priorityScore: doublePrecision("priority_score").notNull().default(0),
  firstReportedAt: timestamp("first_reported_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  lastReportedAt: timestamp("last_reported_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }), // auto-set by a DB trigger on status change, don't set from the client
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------------------------------------------------------------------
// REPORTS — audit trail of every submission (originals + duplicates)
// ---------------------------------------------------------------------
export const reports = pgTable("reports", {
  id: uuid("id").primaryKey().defaultRandom(),
  complaintId: uuid("complaint_id")
    .notNull()
    .references(() => complaints.id, { onDelete: "cascade" }),
  reporterId: uuid("reporter_id").references(() => authUsers.id),
  imageUrl: text("image_url").notNull(),
  location: geographyPoint("location").notNull(),
  embedding: vector("embedding", { dimensions: 512 }),
  isDuplicateOf: uuid("is_duplicate_of").references(() => complaints.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------------------------------------------------------------------
// PROFILES — extends auth.users with app role/department.
// role/department should only ever be written server-side / by an admin —
// see db/schema.sql's RLS policies, which block a user from escalating
// their own role through a normal update.
// ---------------------------------------------------------------------
export const profiles = pgTable("profiles", {
  id: uuid("id")
    .primaryKey()
    .references(() => authUsers.id, { onDelete: "cascade" }),
  role: userRoleEnum("role").notNull().default("citizen"),
  department: departmentTypeEnum("department"), // only set when role = 'department_staff'
  fullName: text("full_name"),
  // Citizen profile fields, collected at signup. Null for department_staff/admin.
  address: text("address"),
  mobileNumber: text("mobile_number"),
  aadhaarNumber: text("aadhaar_number"), // optional; 12-digit Indian ID, validated at the app layer
  profession: text("profession"),
  // Checked before sending any status-change / new-issue email (see
  // lib/email/notifications.ts) - lets a user opt out without losing their
  // account's other settings.
  emailNotificationsEnabled: boolean("email_notifications_enabled")
    .notNull()
    .default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------------------------------------------------------------------
// RELATIONS (for db.query.* relational queries)
// ---------------------------------------------------------------------
export const complaintsRelations = relations(complaints, ({ many }) => ({
  reports: many(reports),
}));

export const reportsRelations = relations(reports, ({ one }) => ({
  complaint: one(complaints, {
    fields: [reports.complaintId],
    references: [complaints.id],
  }),
  duplicateOf: one(complaints, {
    fields: [reports.isDuplicateOf],
    references: [complaints.id],
  }),
  reporter: one(authUsers, {
    fields: [reports.reporterId],
    references: [authUsers.id],
  }),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(authUsers, {
    fields: [profiles.id],
    references: [authUsers.id],
  }),
}));

// ---------------------------------------------------------------------
// Inferred types — import these in the frontend instead of hand-writing
// interfaces for rows coming back from Drizzle queries.
// ---------------------------------------------------------------------
export type Department = typeof departments.$inferSelect;
export type NewDepartment = typeof departments.$inferInsert;

export type Complaint = typeof complaints.$inferSelect;
export type NewComplaint = typeof complaints.$inferInsert;

export type Report = typeof reports.$inferSelect;
export type NewReport = typeof reports.$inferInsert;

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
