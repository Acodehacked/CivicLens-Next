import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import Features from "@/app/components/Features";
import HowItWorks from "@/app/components/HowItWorks";
import AICapabilities from "@/app/components/AICapabilities";
import Statistics from "@/app/components/Statistics";
import Benefits from "@/app/components/Benefits";
import Testimonials from "@/app/components/Testimonials";
import FinalCTA from "@/app/components/FinalCTA";
import Footer from "@/app/components/Footer";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let currentUser: { displayName: string; href: string } | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .single();

    currentUser = {
      displayName: profile?.full_name || user.email || "Account",
      href: profile?.role === "admin" || profile?.role === "department_staff" ? "/admin" : "/report",
    };
  }

  return (
    <>
      <Navbar currentUser={currentUser} />
      <main className="w-full flex flex-col bg-background">
        <Hero />
        <Features />
        <HowItWorks />
        <AICapabilities />
        <Statistics />
        <Benefits />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}

