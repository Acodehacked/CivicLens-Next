"use server";

import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { db } from "@/db/client";
import { complaints } from "@/db/schema";
import { getStaffContext } from "@/lib/auth/staff-context";
import { getReporterEmails } from "@/lib/data/reporters";
import { sendStatusChangeEmail } from "@/lib/email/notifications";
import { formatIssueLabel } from "@/lib/constants/severity";
import { DEPARTMENT_LABELS, type DepartmentType } from "@/lib/constants/departments";

// Shared by /admin/priority-queue, /admin/issues, and /admin/confirmations -
// all three just change a complaint's status, scoped so a department_staff
// account can only touch complaints in their own department (admin can
// touch any). `resolved_at` is set by a DB trigger on status change, so it
// isn't set here - see db/schema.ts's comment on complaints.resolvedAt.
export async function updateComplaintStatus(
  complaintId: string,
  status: "in_progress" | "resolved" | "rejected" | "duplicate"
) {
  const { role, department } = await getStaffContext();

  const where =
    role === "admin"
      ? eq(complaints.id, complaintId)
      : and(eq(complaints.id, complaintId), eq(complaints.department, department!));

  const [updated] = await db.update(complaints).set({ status }).where(where).returning();

  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/priority-queue");
  revalidatePath("/admin/issues");
  revalidatePath("/admin/confirmations");
  revalidatePath("/my-reports");

  // Email is best-effort and must never break the status update itself.
  if (updated) {
    try {
      const emails = await getReporterEmails(updated.id);
      if (emails.length > 0) {
        await sendStatusChangeEmail({
          to: emails,
          issueTitle: formatIssueLabel(updated.yoloClass),
          newStatus: status,
          department: DEPARTMENT_LABELS[updated.department as DepartmentType] ?? updated.department,
          addressText: updated.addressText,
          complaintId: updated.id,
        });
      }
    } catch (err) {
      console.error("[updateComplaintStatus] failed to send status email:", err);
    }
  }
}
