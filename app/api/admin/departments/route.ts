import { NextResponse } from "next/server";
import { getStaffContextForApi } from "@/lib/auth/staff-context";
import { DEMO_DEPARTMENTS_DATA } from "@/lib/data/admin-demo";
import { getDepartmentPerformance } from "@/lib/data/analytics";

export async function GET() {
  const auth = await getStaffContextForApi();
  if (!auth.ok) return auth.response;

  try {
    const departments = await getDepartmentPerformance();
    return NextResponse.json({ departments });
  } catch (err) {
    console.error("[api/admin/departments] falling back to demo data:", err);
    return NextResponse.json(DEMO_DEPARTMENTS_DATA);
  }
}
