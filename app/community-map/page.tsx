import { getPublicMapIssues } from "@/lib/data/public-map";
import CommunityMapClient from "./CommunityMapClient";

// Live complaint data - must be fetched per-request, not baked into the
// static build. Without this, Next prerenders the page at build time and
// runs the DB query then, which both goes stale immediately and breaks the
// build if build-time DB credentials aren't available.
export const dynamic = "force-dynamic";

export default async function CommunityMapPage() {
  const issues = await getPublicMapIssues();
  return <CommunityMapClient issues={issues} />;
}
