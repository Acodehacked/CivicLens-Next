import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { profiles } from "@/db/schema";
import { getStaffContext } from "@/lib/auth/staff-context";
import { createClient } from "@/lib/supabase/server";
import { getStaffDirectory, getDepartmentSettings } from "@/lib/data/settings";
import SettingsPage from "@/app/admin/pages/settings/SettingsPage";

export default async function SettingsRoute() {
  const { userId, role, department, fullName } = await getStaffContext();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [profileRow] = await db
    .select({ emailNotificationsEnabled: profiles.emailNotificationsEnabled })
    .from(profiles)
    .where(eq(profiles.id, userId));

  const scope = role === "admin" ? null : department;
  const [staff, departmentSettings] = await Promise.all([
    getStaffDirectory(scope),
    role === "admin" ? getDepartmentSettings() : Promise.resolve([]),
  ]);

  return (
    <SettingsPage
      profile={{
        fullName,
        email: user?.email ?? null,
        role,
        department,
        emailNotificationsEnabled: profileRow?.emailNotificationsEnabled ?? true,
      }}
      staff={staff}
      departmentSettings={departmentSettings}
      isAdmin={role === "admin"}
    />
  );
}
