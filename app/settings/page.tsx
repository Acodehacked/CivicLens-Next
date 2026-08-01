import Link from "next/link";
import { LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import SettingsForm from "./components/SettingsForm";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="p-6 sm:p-10 max-w-2xl mx-auto flex flex-col items-center text-center mt-16">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] mb-5">
          <LogIn size={28} />
        </div>
        <h1 className="text-xl font-black text-primary mb-2">Sign in to manage your settings</h1>
        <p className="text-sm text-slate-500 mb-6 max-w-sm">
          Create an account or sign in to update your profile and notification preferences.
        </p>
        <Link href="/login" className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-sm hover:bg-primary-hover transition-colors">
          Sign In
        </Link>
      </div>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, address, mobile_number, aadhaar_number, profession, email_notifications_enabled")
    .eq("id", user.id)
    .single();

  return (
    <div className="p-6 sm:p-10 max-w-2xl mx-auto">
      <SettingsForm
        email={user.email ?? null}
        defaultValues={{
          fullName: profile?.full_name ?? "",
          address: profile?.address ?? "",
          mobileNumber: profile?.mobile_number ?? "",
          aadhaarNumber: profile?.aadhaar_number ?? "",
          profession: profile?.profession ?? "",
        }}
        emailNotificationsEnabled={profile?.email_notifications_enabled ?? true}
      />
    </div>
  );
}
