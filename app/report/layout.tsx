import { ReactNode } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] overflow-hidden text-sm">
      <Sidebar displayName={displayName} email={email} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <TopNav displayName={displayName} />
        {children}
      </div>
      <Footer />
    </div>
  );
}
