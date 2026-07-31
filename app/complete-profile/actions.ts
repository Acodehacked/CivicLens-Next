"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { completeProfileSchema } from "./schema";
import type { AuthFormState } from "@/lib/auth/types";

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
