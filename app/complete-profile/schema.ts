import * as z from "zod";
import { PROFESSIONS } from "@/lib/constants/professions";

export const completeProfileSchema = z.object({
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

export type CompleteProfileValues = z.infer<typeof completeProfileSchema>;
