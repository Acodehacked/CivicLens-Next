// Postgres's own statement_timeout (2 min) is far too slow for a page load -
// a hung/slow query (seen repeatedly against this project's Supabase
// pooler) would otherwise leave the admin UI spinning for minutes before
// the route's catch block ever gets a chance to fall back to demo data.
// This races the real query against a short timeout so the fallback kicks
// in fast enough for a live page load.
export function withTimeout<T>(promise: Promise<T>, ms = 8000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(`Query timed out after ${ms}ms`)), ms);
    }),
  ]);
}
