"use server";

import { redirect } from "next/navigation";
import * as z from "zod";
import { createClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/utils/site-url";
import { DEPARTMENTS } from "@/lib/constants/departments";
import type { AuthFormState } from "@/lib/auth/types";

const departmentSignupSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name."),
  email: z.email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  department: z.enum(DEPARTMENTS, "Select a department."),
});

// Self-service for now: creates a `department_staff` account tied to one
// department. It can never create a full `admin` account - the DB trigger
// (public.handle_new_user in db/setup.sql) hard-codes that regardless of
// what this sends. Promoting a department_staff account to admin is a
// manual, server-side operation.
export async function signupDepartmentStaff(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = departmentSignupSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    department: formData.get("department"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { fullName, email, password, department } = parsed.data;
  const supabase = await createClient();
  const siteUrl = await getSiteUrl();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
      data: {
        account_type: "department_staff",
        full_name: fullName,
        department,
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

  redirect("/admin");
}
