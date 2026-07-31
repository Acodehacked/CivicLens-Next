"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Loader2, Camera, MapPin, FileText, CheckCircle2, ChevronRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CameraUploadCard from "./components/CameraUploadCard";
import DescriptionCard from "./components/DescriptionCard";
import AIIntelligencePanel, { AIState } from "./components/AIIntelligencePanel";
import ReviewSubmitCard from "./components/ReviewSubmitCard";

// SSR-disabled import for Leaflet
const LiveMapPicker = dynamic(() => import("./components/LiveMapPicker"), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-2xl border border-border shadow-sm h-[400px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-slate-400">
        <Loader2 className="w-7 h-7 animate-spin text-accent" />
        <span className="text-sm font-medium">Loading map engine…</span>
      </div>
    </div>
  ),
});

// ── Steps definition ─────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Capture Evidence", shortLabel: "Photo",    icon: Camera,       desc: "Take or upload a photo of the civic issue." },
  { id: 2, label: "Confirm Location", shortLabel: "Location", icon: MapPin,       desc: "Pin the exact location on the live map." },
  { id: 3, label: "Add Details",      shortLabel: "Details",  icon: FileText,     desc: "Provide any additional context about the issue." },
  { id: 4, label: "Review & Submit",  shortLabel: "Submit",   icon: CheckCircle2, desc: "Review your report and submit it." },
] as const;

// ── Stepper ───────────────────────────────────────────────────────────────────
function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, idx) => {
        const done   = idx + 1 < current;
        const active = idx + 1 === current;
        const Icon   = step.icon;
        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            {/* Circle */}
            <div className="flex flex-col items-center gap-1.5">
              <div className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm",
                done   ? "bg-accent border-accent text-white" :
                active ? "bg-white border-accent text-accent shadow-[0_0_0_4px_rgba(37,99,235,0.12)]" :
                         "bg-white border-slate-200 text-slate-300"
              )}>
                {done
                  ? <CheckCircle2 size={16} strokeWidth={2.5} />
                  : <Icon size={16} strokeWidth={active ? 2 : 1.5} />
                }
              </div>
              <span className={cn(
                "text-[11px] font-semibold leading-none whitespace-nowrap transition-colors hidden sm:block",
                active ? "text-accent" : done ? "text-slate-400" : "text-slate-300"
              )}>
                {step.shortLabel}
              </span>
            </div>
            {/* Connector */}
            {idx < STEPS.length - 1 && (
              <div className="flex-1 h-[2px] mx-2 rounded-full overflow-hidden bg-slate-100">
                <motion.div
                  className="h-full bg-accent origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: done ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────
function Section({
  step, label, desc, current, children,
}: {
  step: number; label: string; desc: string; current: number; children: React.ReactNode;
}) {
  return (
    <motion.section
      key={step}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col gap-5"
    >
      {/* Section heading */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shrink-0">
          {step}
        </div>
        <div>
          <h2 className="text-lg font-bold text-primary leading-tight">{label}</h2>
          <p className="text-sm text-on-surface-muted">{desc}</p>
        </div>
      </div>
      {children}
    </motion.section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ReportPage() {
  const [step, setStep]             = useState(1);
  const [hasImage, setHasImage]     = useState(false);
  const [hasLocation, setHasLocation] = useState(false);
  const [aiState, setAiState]       = useState<AIState>("IDLE");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number } | null>(null);

  const handleUpload = (ok: boolean) => {
    setHasImage(ok);
    if (ok) {
      setAiState("PROCESSING");
      setTimeout(() => setAiState("COMPLETE"), 7 * 800 + 400);
    } else {
      setAiState("IDLE");
    }
  };

  const canProceed = () => {
    if (step === 1) return hasImage;        // allow moving before AI completes
    if (step === 2) return hasLocation;
    return true;
  };

  const goNext = () => step < 4 && setStep((s) => s + 1);
  const goPrev = () => step > 1 && setStep((s) => s - 1);

  const submitReport = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      // Navigate to map after submission so user can see their report
      router.push("/map");
    }, 1800);
  };

  const currentStepMeta = STEPS[step - 1];

  return (
    <div className="flex-1 flex overflow-hidden relative bg-[#F8FAFC]">

      {/* ── Main content area ───────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-12 py-8 pb-32">

          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-muted mb-3">
              <Link href="/" className="hover:text-primary transition-colors">CivicLens</Link>
              <ChevronRight size={14} className="opacity-40" />
              <span className="text-primary">Submit Observation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight mb-2">
              Submit a Civic Observation
            </h1>
            <p className="text-on-surface-muted text-sm sm:text-base leading-relaxed max-w-xl">
              Upload an image of a civic issue. Our AI engine will detect the problem, estimate severity, and route it to the right department.
            </p>
          </div>

          {/* Stepper */}
          <div className="bg-white rounded-2xl border border-border shadow-sm px-6 py-5 mb-8">
            <StepBar current={step} />
            {/* Current step hint */}
            <div className="mt-4 flex items-center gap-2 text-xs text-on-surface-muted border-t border-border/50 pt-3">
              <span className="font-bold text-primary">Step {step} of {STEPS.length}:</span>
              <span>{currentStepMeta.desc}</span>
            </div>
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <Section key={1} step={1} label="Capture Evidence" desc="Photograph the issue using your device camera or upload an existing image." current={step}>
                <CameraUploadCard onUploadComplete={handleUpload} />
                {hasImage && aiState === "PROCESSING" && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl text-sm font-medium text-blue-700"
                  >
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    AI is analysing your image in the panel on the right…
                  </motion.div>
                )}
                {hasImage && aiState === "COMPLETE" && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-100 rounded-xl text-sm font-medium text-green-700"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    AI analysis complete — review the results in the panel, then continue.
                  </motion.div>
                )}
              </Section>
            )}

            {step === 2 && (
              <Section key={2} step={2} label="Confirm Location" desc="Your GPS location is fetched automatically. Drag the pin to adjust if needed." current={step}>
                <LiveMapPicker onLocationConfirm={(lat, lng) => {
                  setHasLocation(true);
                  setLocationCoords({ lat, lng });
                }} />
              </Section>
            )}

            {step === 3 && (
              <Section key={3} step={3} label="Additional Details" desc="Describe anything not visible in the photo — size, traffic impact, nearby landmarks." current={step}>
                <DescriptionCard />
              </Section>
            )}

            {step === 4 && (
              <Section key={4} step={4} label="Review & Submit" desc="Check all details before submitting. You can go back to edit any step." current={step}>
                <ReviewSubmitCard locationCoords={locationCoords} />
              </Section>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* ── AI Intelligence Panel (right sidebar) ───────────────────────────── */}
      <AIIntelligencePanel state={aiState} />

      {/* ── Sticky bottom action bar ─────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 lg:right-96 z-30 bg-white/90 backdrop-blur-xl border-t border-border shadow-[0_-8px_24px_-8px_rgba(0,0,0,0.08)]">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 lg:px-12 h-20 flex items-center justify-between gap-4">

          <button
            onClick={goPrev}
            disabled={step === 1}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-primary hover:bg-slate-100 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            ← Back
          </button>

          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-primary border border-border hover:bg-slate-50 active:scale-[0.97] transition-all shadow-sm">
              Save Draft
            </button>

            {step < 4 ? (
              <button
                onClick={goNext}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold shadow-sm hover:bg-blue-700 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed transition-all min-w-[130px] justify-center"
              >
                Continue
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={submitReport}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold shadow-sm hover:bg-green-700 active:scale-[0.97] disabled:opacity-70 disabled:cursor-wait transition-all min-w-[150px] justify-center"
              >
                {isSubmitting
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
                  : <><CheckCircle2 size={16} /> Submit Report</>
                }
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
