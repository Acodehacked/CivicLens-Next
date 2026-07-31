import { getPublicMapIssues } from "@/lib/data/public-map";
import CommunityMapClient from "./CommunityMapClient";

export default async function CommunityMapPage() {
  const issues = await getPublicMapIssues();
  return <CommunityMapClient issues={issues} />;
}
