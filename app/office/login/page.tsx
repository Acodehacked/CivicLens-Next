import OfficeShowcasePanel from "../components/OfficeShowcasePanel";
import OfficeLoginForm from "./components/OfficeLoginForm";

export default function OfficeLoginPage() {
  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFC]">
      <OfficeShowcasePanel />
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16">
        <OfficeLoginForm />
      </div>
    </div>
  );
}
