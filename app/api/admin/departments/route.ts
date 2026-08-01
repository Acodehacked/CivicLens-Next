import { NextResponse } from "next/server";
import { getStaffContextForApi } from "@/lib/auth/staff-context";
import { adminApiError } from "@/lib/api/admin-error";
import { getDepartmentPerformance } from "@/lib/data/analytics";

export async function GET() {
  const auth = await getStaffContextForApi();
  if (!auth.ok) return auth.response;

  try {
    const departments = await getDepartmentPerformance();
    return NextResponse.json({ departments });
  } catch (err) {
    return adminApiError("departments", err);
  }
}
