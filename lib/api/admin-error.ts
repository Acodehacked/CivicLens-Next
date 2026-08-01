import { NextResponse } from "next/server";

// Shared by every app/api/admin/** route: logs server-side (Vercel function
// logs still get the full detail) and also returns the real message/code to
// the client, since these are internal, auth-gated admin endpoints and the
// whole point of moving these calls client-side is to see the real failure
// instead of Next's redacted production error page.
export function adminApiError(routeTag: string, err: unknown) {
  console.error(`[api/admin/${routeTag}]`, err);
  const message = err instanceof Error ? err.message : "Unknown error";
  const code = err && typeof err === "object" && "code" in err ? (err as { code?: string }).code : undefined;
  return NextResponse.json({ error: message, code }, { status: 500 });
}
