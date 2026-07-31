"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { departmentLoginSchema } from "./schema";
import type { AuthFormState } from "@/lib/auth/types";

export async function loginDepartment(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = departmentLoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { email, password } = parsed.data;

  let shouldRedirect = false;
  let result: AuthFormState;

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("[loginDepartment] signInWithPassword error:", error);
      result = { error: "Invalid email or password." };
    } else {
      shouldRedirect = true;
    }
  } catch (err) {
    console.error("[loginDepartment] unexpected error:", err);
    result = { error: "Something went wrong signing you in. Please try again." };
  }

  if (shouldRedirect) {
    redirect("/admin");
  }

  return result;
}
