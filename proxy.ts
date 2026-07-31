import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next.js 16 renamed `middleware.ts`/`export function middleware` to
// `proxy.ts`/`export default function proxy`.
//
// Route separation enforced here (optimistic check - real authorization
// still lives in RLS, see db/setup.sql):
//   /admin/**                     -> admin or department_staff only
//   /office/login, /office/signup -> staff get bounced straight to /admin
//   /complete-profile             -> signed-in citizens only
//   /login, /signup               -> staff go to /admin, citizens to /report
//   /map/**, /report/**           -> staff get bounced to /admin
export default async function proxy(request: NextRequest) {
  const { response, user, role } = await updateSession(request);
  const path = request.nextUrl.pathname;

  const isStaff = !!user && (role === "admin" || role === "department_staff");
  const isCitizen = !!user && role === "citizen";

  const goTo = (destination: string) =>
    NextResponse.redirect(new URL(destination, request.url));

  if (path.startsWith("/admin")) {
    if (!user) return goTo("/office/login");
    if (!isStaff) return goTo("/");
    return response;
  }

  if (path.startsWith("/office/login") || path.startsWith("/office/signup")) {
    if (isStaff) return goTo("/admin");
    return response;
  }

  if (path.startsWith("/complete-profile")) {
    if (!user) return goTo("/login");
    if (isStaff) return goTo("/admin");
    return response;
  }

  if (path.startsWith("/login") || path.startsWith("/signup")) {
    if (isStaff) return goTo("/admin");
    if (isCitizen) return goTo("/report");
    return response;
  }

  if (path.startsWith("/map") || path.startsWith("/report")) {
    if (isStaff) return goTo("/admin");
    return response;
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
