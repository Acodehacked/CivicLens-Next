"use server";

import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { db } from "@/db/client";
import { complaints } from "@/db/schema";
import { getStaffContext } from "@/lib/auth/staff-context";

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

  await db.update(complaints).set({ status }).where(where);

  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/priority-queue");
  revalidatePath("/admin/issues");
  revalidatePath("/admin/confirmations");
}
