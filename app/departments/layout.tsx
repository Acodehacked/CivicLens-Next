import { ReactNode } from "react";
import CitizenShell from "@/components/citizen/CitizenShell";

export default function DepartmentsLayout({ children }: { children: ReactNode }) {
  return <CitizenShell>{children}</CitizenShell>;
}
