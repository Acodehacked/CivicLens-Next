"use server";

import { redirect } from "next/navigation";
import * as z from "zod";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/utils/site-url";
import { PROFESSIONS } from "@/lib/constants/professions";
import type { AuthFormState } from "@/lib/auth/types";

const signupSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name."),
  email: z.email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  address: z.string().trim().min(5, "Enter your address."),
  mobileNumber: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number."),
  aadhaarNumber: z
    .string()
    .trim()
    .regex(/^\d{12}$/, "Aadhaar number must be exactly 12 digits.")
    .optional()
    .or(z.literal("")),
  profession: z.enum(PROFESSIONS, "Select your profession."),
});

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
