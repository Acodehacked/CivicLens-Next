"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/utils/site-url";
import { signupSchema } from "./schema";
import type { AuthFormState } from "@/lib/auth/types";

export async function signupCitizen(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = signupSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    address: formData.get("address"),
    mobileNumber: formData.get("mobileNumber"),
    aadhaarNumber: formData.get("aadhaarNumber"),
    profession: formData.get("profession"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { fullName, email, password, address, mobileNumber, aadhaarNumber, profession } =
    parsed.data;

  const supabase = await createClient();
  const siteUrl = await getSiteUrl();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
      data: {
        account_type: "citizen",
        full_name: fullName,
        address,
        mobile_number: mobileNumber,
        aadhaar_number: aadhaarNumber || null,
        profession,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.session) {
    return {
      message: "Account created. Check your email to confirm it before signing in.",
    };
  }

  redirect("/report");
}
