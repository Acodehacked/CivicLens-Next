import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getStaffContextForApi } from "@/lib/auth/staff-context";
import { withTimeout } from "@/lib/api/with-timeout";
import { DEMO_SETTINGS } from "@/lib/data/admin-demo";
import { db } from "@/db/client";
import { profiles } from "@/db/schema";
import { getStaffDirectory, getDepartmentSettings } from "@/lib/data/settings";

export async function GET() {
  const auth = await getStaffContextForApi();
  if (!auth.ok) return auth.response;
  const { userId, role, department, fullName, email } = auth.context;

  try {
    const [profileRow] = await withTimeout(
      db
        .select({ emailNotificationsEnabled: profiles.emailNotificationsEnabled })
        .from(profiles)
        .where(eq(profiles.id, userId))
    );

    const scope = role === "admin" ? null : department;
    // One at a time rather than Promise.all - see dashboard/route.ts.
    const staff = await withTimeout(getStaffDirectory(scope));
    const departmentSettings = role === "admin" ? await withTimeout(getDepartmentSettings()) : [];

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
    console.error("[api/admin/settings] falling back to demo data:", err);
    return NextResponse.json(DEMO_SETTINGS);
  }
}
