import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Privileged client for trusted server-only operations that must bypass RLS
// entirely (e.g. an admin promoting a user's role, cross-user maintenance
// tasks). Built with SUPABASE_SECRET_KEY, which has no NEXT_PUBLIC_ prefix
// and is never sent to the browser - the `server-only` import above makes
// any accidental import from a Client Component a build-time error.
//
// This is NOT the client for normal request handling: everyday
// server-rendered pages and Server Actions should keep using
// lib/supabase/server.ts (the publishable-key, cookie-bound client), which
// respects RLS for whichever user is signed in. Only reach for this one
// when the operation genuinely needs to act outside/across RLS.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
