import { NextResponse } from "next/server";
import { getStaffContextForApi } from "@/lib/auth/staff-context";
import { adminApiError } from "@/lib/api/admin-error";
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
    return adminApiError("notifications", err);
  }
}
