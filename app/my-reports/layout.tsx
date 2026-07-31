import { ReactNode } from "react";
import CitizenShell from "@/components/citizen/CitizenShell";

export default function MyReportsLayout({ children }: { children: ReactNode }) {
  return <CitizenShell>{children}</CitizenShell>;
}
