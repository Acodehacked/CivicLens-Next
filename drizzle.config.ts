import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    // Use Supabase's direct connection (port 5432) here, not the pooler,
    // since drizzle-kit needs to run DDL and introspection queries.
    url: process.env.DATABASE_URL,
  },
});
