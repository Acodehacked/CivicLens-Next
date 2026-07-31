import * as z from "zod";
import { DEPARTMENTS } from "@/lib/constants/departments";

export const departmentSignupSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name."),
  email: z.email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  department: z.enum(DEPARTMENTS, "Select a department."),
});

export type DepartmentSignupValues = z.infer<typeof departmentSignupSchema>;
