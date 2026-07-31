import { headers } from "next/headers";

// OAuth redirects need an absolute URL. Prefer an explicit env var
// (required in production, behind a proxy/load balancer); fall back to the
// incoming request's Host header for local dev.
export async function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}
