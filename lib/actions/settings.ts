"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { profiles, departments } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";
import { getStaffContext } from "@/lib/auth/staff-context";
import { getAdminEmails } from "@/lib/data/settings";
import { sendSupportTicketEmail } from "@/lib/email/notifications";
import type { DepartmentType } from "@/lib/constants/departments";

export async function updateOwnProfile(fullName: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in.");

  const trimmed = fullName.trim();
  if (!trimmed) throw new Error("Name cannot be empty.");

  await db.update(profiles).set({ fullName: trimmed }).where(eq(profiles.id, user.id));
  revalidatePath("/admin/settings");
}

export async function updateOwnNotificationPreference(enabled: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in.");

  await db.update(profiles).set({ emailNotificationsEnabled: enabled }).where(eq(profiles.id, user.id));
  revalidatePath("/admin/settings");
}

// Admin-only - department_staff can view the directory/contact info but not
// edit it. contactEmail is what lib/email/notifications.ts's sendNewIssueEmail
// sends to when a new issue is filed, so this is what actually turns that
// feature on for a department.
export async function updateDepartmentSettings(
  department: DepartmentType,
  contactEmail: string,
  avgResolutionHours: number
) {
  const { role } = await getStaffContext();
  if (role !== "admin") throw new Error("Only admins can edit department settings.");

  await db
    .update(departments)
    .set({
      contactEmail: contactEmail.trim() || null,
      avgResolutionHours: Number.isFinite(avgResolutionHours) ? avgResolutionHours : null,
    })
    .where(eq(departments.name, department));

  revalidatePath("/admin/settings");
  revalidatePath("/admin/departments");
}

// Sent to every admin account - there's no dedicated support inbox, so this
// is the real, honest set of people who could actually see and act on it.
export async function submitSupportTicket(message: string) {
  const trimmed = message.trim();
  if (!trimmed) throw new Error("Message cannot be empty.");

  const { fullName } = await getStaffContext();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) throw new Error("Not signed in.");

  const adminEmails = await getAdminEmails();
  if (adminEmails.length === 0) return;

  await sendSupportTicketEmail({
    to: adminEmails,
    fromName: fullName ?? user.email,
    fromEmail: user.email,
    message: trimmed,
  });
}
