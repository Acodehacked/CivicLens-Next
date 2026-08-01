import { NextResponse } from "next/server";
import { getStaffContextForApi } from "@/lib/auth/staff-context";
import { DEMO_NOTIFICATIONS_DATA } from "@/lib/data/admin-demo";
import { getNotificationFeed } from "@/lib/data/analytics";

export async function GET() {
  const auth = await getStaffContextForApi();
  if (!auth.ok) return auth.response;
  const { role, department } = auth.context;

  try {
    const scope = role === "admin" ? null : department;
    const items = await getNotificationFeed(scope, 40);
    return NextResponse.json({ items });
  } catch (err) {
    console.error("[api/admin/notifications] falling back to demo data:", err);
    return NextResponse.json(DEMO_NOTIFICATIONS_DATA);
  }
}
