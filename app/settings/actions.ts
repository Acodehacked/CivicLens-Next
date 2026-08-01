"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { completeProfileSchema } from "@/app/complete-profile/schema";
import type { AuthFormState } from "@/lib/auth/types";

export async function updateCitizenProfile(
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
    return { error: "Not signed in." };
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
    console.error("[updateCitizenProfile] profiles update error:", error);
    return { error: error.message };
  }

  revalidatePath("/settings");
  return { message: "Profile updated." };
}
