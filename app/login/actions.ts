"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/utils/site-url";
import { loginSchema } from "./schema";
import type { AuthFormState } from "@/lib/auth/types";

export async function loginCitizen(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
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
      console.error("[loginCitizen] signInWithPassword error:", error);
      result = { error: "Invalid email or password." };
    } else {
      shouldRedirect = true;
    }
  } catch (err) {
    console.error("[loginCitizen] unexpected error:", err);
    result = { error: "Something went wrong signing you in. Please try again." };
  }

  if (shouldRedirect) {
    redirect("/report");
  }

  return result;
}

export async function loginCitizenWithGoogle() {
  let destination: string;

  try {
    const supabase = await createClient();
    const siteUrl = await getSiteUrl();

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${siteUrl}/auth/callback`,
      },
    });

    if (error || !data.url) {
      console.error("[loginCitizenWithGoogle] signInWithOAuth error:", error);
      destination = `/login?error=${encodeURIComponent(error?.message ?? "Google sign-in failed.")}`;
    } else {
      destination = data.url;
    }
  } catch (err) {
    console.error("[loginCitizenWithGoogle] unexpected error:", err);
    destination = `/login?error=${encodeURIComponent("Google sign-in failed.")}`;
  }

  redirect(destination);
}
