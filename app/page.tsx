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

export default function Home() {
  return (
    <>
      <Navbar />
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
