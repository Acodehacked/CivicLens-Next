import { ReactNode } from "react";
import CitizenShell from "@/components/citizen/CitizenShell";

export default function LiveLayout({ children }: { children: ReactNode }) {
  return <CitizenShell>{children}</CitizenShell>;
}
