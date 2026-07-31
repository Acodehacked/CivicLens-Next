import * as z from "zod";
import { PROFESSIONS } from "@/lib/constants/professions";

// Shared between the client form (react-hook-form + zodResolver, so bad
// input never leaves the browser) and the server action (never trust the
// client - the action re-validates with this same schema).
export const signupSchema = z.object({
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

export type SignupValues = z.infer<typeof signupSchema>;
