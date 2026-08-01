import "server-only";
import { and, eq, inArray, isNotNull } from "drizzle-orm";
import { db } from "@/db/client";
import { reports, profiles } from "@/db/schema";
import { createAdminClient } from "@/lib/supabase/admin";

// Every distinct signed-in reporter of a complaint, filtered to those who
// haven't opted out via profiles.email_notifications_enabled. Anonymous
// reports (reporter_id null) are naturally excluded - there's no account
// to email. Uses the secret-key admin client since auth.users' email
// column isn't reachable through the publishable-key client.
export async function getReporterEmails(complaintId: string): Promise<string[]> {
  const rows = await db
    .selectDistinct({ reporterId: reports.reporterId })
    .from(reports)
    .where(and(eq(reports.complaintId, complaintId), isNotNull(reports.reporterId)));

  const reporterIds = rows.map((r) => r.reporterId).filter((id): id is string => id !== null);
  if (reporterIds.length === 0) return [];

  const optedIn = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(and(inArray(profiles.id, reporterIds), eq(profiles.emailNotificationsEnabled, true)));
  const optedInIds = new Set(optedIn.map((p) => p.id));

  const admin = createAdminClient();
  const emails: string[] = [];

  for (const id of reporterIds) {
    if (!optedInIds.has(id)) continue;
    const { data, error } = await admin.auth.admin.getUserById(id);
    if (!error && data.user?.email) emails.push(data.user.email);
  }

  return emails;
}
