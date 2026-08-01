import { ReactNode } from "react";
import CitizenShell from "@/components/citizen/CitizenShell";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return <CitizenShell>{children}</CitizenShell>;
}
