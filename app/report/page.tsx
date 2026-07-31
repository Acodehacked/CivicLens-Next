import { createClient } from "@/lib/supabase/server";
import ReportFlow from "./components/ReportFlow";

export default async function ReportPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <ReportFlow reporterId={user?.id ?? null} />;
}
