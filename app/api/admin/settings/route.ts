import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getStaffContextForApi } from "@/lib/auth/staff-context";
import { adminApiError } from "@/lib/api/admin-error";
import { db } from "@/db/client";
import { profiles } from "@/db/schema";
import { getStaffDirectory, getDepartmentSettings } from "@/lib/data/settings";

export async function GET() {
  const auth = await getStaffContextForApi();
  if (!auth.ok) return auth.response;
  const { userId, role, department, fullName, email } = auth.context;

  try {
    const [profileRow] = await db
      .select({ emailNotificationsEnabled: profiles.emailNotificationsEnabled })
      .from(profiles)
      .where(eq(profiles.id, userId));

    const scope = role === "admin" ? null : department;
    const [staff, departmentSettings] = await Promise.all([
      getStaffDirectory(scope),
      role === "admin" ? getDepartmentSettings() : Promise.resolve([]),
    ]);

    return NextResponse.json({
      profile: {
        fullName,
        email,
        role,
        department,
        emailNotificationsEnabled: profileRow?.emailNotificationsEnabled ?? true,
      },
      staff,
      departmentSettings,
      isAdmin: role === "admin",
    });
  } catch (err) {
    return adminApiError("settings", err);
  }
}
