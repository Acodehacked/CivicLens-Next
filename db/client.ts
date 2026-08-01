import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Deliberately NOT process.env.DATABASE_URL - that's the session-mode
// pooler (port 5432), which holds one dedicated Postgres backend
// connection per client for its entire lifetime and is capped by a small
// `pool_size` (Supabase's default is 15). Every Vercel serverless
// invocation can open its own connection, so session mode runs out of
// headroom almost immediately under any concurrent load - see the
// "max clients reached in session mode" errors this caused.
//
// DATABASE_POOL_URL must point at the transaction-mode pooler (port 6543)
// instead: same host/user/password/database, transaction mode multiplexes
// many client connections over a shared set of backend connections,
// releasing each one back to the pool as soon as its query finishes,
// which is exactly the pattern serverless functions need.
const connectionString = process.env.DATABASE_POOL_URL;

if (!connectionString) {
  throw new Error("DATABASE_POOL_URL is not set");
}

// `prepare: false` is required for the transaction pooler, which doesn't
// support prepared statements. `max: 1` is the standard recommendation for
// serverless: each invocation only ever needs one connection from its own
// perspective - the pooler handles concurrency across invocations, not the
// client library.
//
// `idle_timeout` and `max_lifetime` bound how long this module-level client
// holds its one connection open. Without them a warm Vercel Lambda can be
// frozen between invocations for a long time; if Supabase's pooler closes
// the idle connection server-side during that freeze, the client doesn't
// find out and sends the next query down a dead socket, which surfaces as
// a hang or a confusing auth/timeout error rather than a clean reconnect.
// `connect_timeout` makes a bad/unreachable pooler fail fast instead of
// hanging the request.
const client = postgres(connectionString, {
  prepare: false,
  max: 1,
  idle_timeout: 20,
  max_lifetime: 60 * 30,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });
