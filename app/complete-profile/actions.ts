"use server";

import { redirect } from "next/navigation";
import * as z from "zod";
import { createClient } from "@/lib/supabase/server";
import { PROFESSIONS } from "@/lib/constants/professions";
import type { AuthFormState } from "@/lib/auth/types";

const completeProfileSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name."),
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

export async function completeProfile(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = completeProfileSchema.safeParse({
    fullName: formData.get("fullName"),
    address: formData.get("address"),
    mobileNumber: formData.get("mobileNumber"),
    aadhaarNumber: formData.get("aadhaarNumber"),
    profession: formData.get("profession"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { fullName, address, mobileNumber, aadhaarNumber, profession } = parsed.data;

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      address,
      mobile_number: mobileNumber,
      aadhaar_number: aadhaarNumber || null,
      profession,
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  redirect("/report");
}
