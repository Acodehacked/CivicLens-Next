import { ReactNode } from "react";
import Sidebar from "./components/Sidebar";
import TopNav from "./components/TopNav";

export default function ReportLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] overflow-hidden text-sm">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <TopNav />
        {children}
      </div>
    </div>
  );
}
