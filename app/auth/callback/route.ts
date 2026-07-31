import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// OAuth (Google) callback for citizen sign-in/sign-up. Only citizens use
// this flow today (department staff sign in with email/password on
// /office/login), so we route based on the resulting profile: staff land
// on /admin, citizens with a missing required field are sent to finish
// their profile, everyone else goes to /report.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, address, mobile_number, profession")
          .eq("id", user.id)
          .single();

        if (profile?.role === "admin" || profile?.role === "department_staff") {
          return NextResponse.redirect(`${origin}/admin`);
        }

        const incomplete = !profile?.address || !profile?.mobile_number || !profile?.profession;
        if (incomplete) {
          return NextResponse.redirect(`${origin}/complete-profile`);
        }

        return NextResponse.redirect(`${origin}/report`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("Sign-in failed. Please try again.")}`);
}
