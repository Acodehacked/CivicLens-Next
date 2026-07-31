import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

// `prepare: false` is required when connecting through Supabase's transaction
// pooler (port 6543 / pgbouncer), which does not support prepared statements.
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
