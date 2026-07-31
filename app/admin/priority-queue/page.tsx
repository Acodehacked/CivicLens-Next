import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "@/db/client";
import { complaints } from "@/db/schema";
import { getStaffContext } from "@/lib/auth/staff-context";
import { DEPARTMENTS } from "@/lib/constants/departments";
import PriorityQueuePage from "@/app/admin/pages/priority-queue/PriorityQueuePage";

export default async function PriorityQueueRoute() {
  const { role, department } = await getStaffContext();

  const activeOnly = inArray(complaints.status, ["open", "in_progress"]);
  const where =
    role === "admin" ? activeOnly : and(activeOnly, eq(complaints.department, department!));

  const reports = await db
    .select()
    .from(complaints)
    .where(where)
    .orderBy(desc(complaints.priorityScore))
    .limit(100);

  return (
    <PriorityQueuePage
      reports={reports}
      isAdmin={role === "admin"}
      departments={DEPARTMENTS}
    />
  );
}
