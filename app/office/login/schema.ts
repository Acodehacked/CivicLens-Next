import * as z from "zod";

export const departmentLoginSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export type DepartmentLoginValues = z.infer<typeof departmentLoginSchema>;
