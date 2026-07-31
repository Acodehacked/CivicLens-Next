import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { complaints } from "@/db/schema";
import { getStaffContext } from "@/lib/auth/staff-context";
import ConfirmationsQueue from "./ConfirmationsQueue";

export default async function ConfirmationsPage() {
  const { role, department } = await getStaffContext();

  const openOnly = eq(complaints.status, "open");
  const where = role === "admin" ? openOnly : and(openOnly, eq(complaints.department, department!));

  const pending = await db
    .select()
    .from(complaints)
    .where(where)
    .orderBy(desc(complaints.priorityScore))
    .limit(200);

  return <ConfirmationsQueue pending={pending} isAdmin={role === "admin"} />;
}
