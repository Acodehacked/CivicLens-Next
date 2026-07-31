import OfficeShowcasePanel from "../components/OfficeShowcasePanel";
import OfficeSignupForm from "./components/OfficeSignupForm";

export default function OfficeSignupPage() {
  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFC]">
      <OfficeShowcasePanel />
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16 overflow-y-auto">
        <OfficeSignupForm />
      </div>
    </div>
  );
}
