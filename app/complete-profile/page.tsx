import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CompleteProfileForm from "./components/CompleteProfileForm";

export default async function CompleteProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, address, mobile_number, aadhaar_number, profession")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#F8FAFC] px-6 py-12">
      <CompleteProfileForm
        defaultValues={{
          fullName: profile?.full_name ?? "",
          address: profile?.address ?? "",
          mobileNumber: profile?.mobile_number ?? "",
          aadhaarNumber: profile?.aadhaar_number ?? "",
          profession: profile?.profession ?? "",
        }}
      />
    </div>
  );
}
