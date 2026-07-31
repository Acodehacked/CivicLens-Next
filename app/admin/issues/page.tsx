import { desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { complaints } from "@/db/schema";
import { getStaffContext } from "@/lib/auth/staff-context";
import IssuesTable from "./IssuesTable";

export default async function IssuesPage() {
  const { role, department } = await getStaffContext();

  const where = role === "admin" ? undefined : eq(complaints.department, department!);

  const issues = await db
    .select()
    .from(complaints)
    .where(where)
    .orderBy(desc(complaints.lastReportedAt))
    .limit(200);

  return <IssuesTable issues={issues} isAdmin={role === "admin"} />;
}
