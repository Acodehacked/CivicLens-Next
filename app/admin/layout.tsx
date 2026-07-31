import { Metadata } from "next";
import Sidebar from "./components/Sidebar";
import TopNav from "./components/TopNav";

export const metadata: Metadata = {
  title: "Admin Dashboard | CivicLens",
  description: "Central command center for city administrators.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
