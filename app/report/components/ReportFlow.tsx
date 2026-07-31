"use client";

import { useState, useEffect } from "react";
import { Loader2, Camera, MapPin, FileText, CheckCircle2, ChevronRight, RotateCcw, Map as MapIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import CameraUploadCard from "./CameraUploadCard";
import DescriptionCard from "./DescriptionCard";
import AIIntelligencePanel, { AIState } from "./AIIntelligencePanel";
import ReviewSubmitCard from "./ReviewSubmitCard";
import { uploadReportImageWithProgress } from "@/lib/supabase/storage";
import { processReport, getSimilarReports, type ProcessReportResult, type SimilarReportMatch } from "@/lib/api/civiclens";

// SSR-disabled import for Leaflet
const LiveMapPicker = dynamic(() => import("./LiveMapPicker"), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-2xl border border-border shadow-sm h-[320px] sm:h-[400px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-slate-400">
        <Loader2 className="w-7 h-7 animate-spin text-[#2563EB]" />
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
            <div className="flex flex-col items-center gap-1">
              <div className={cn(
                "w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm",
                done   ? "bg-[#2563EB] border-[#2563EB] text-white" :
                active ? "bg-white border-[#2563EB] text-[#2563EB] ring-4 ring-blue-100 font-bold" :
                         "bg-white border-slate-200 text-slate-300"
              )}>
                {done
                  ? <CheckCircle2 size={15} strokeWidth={2.5} />
                  : <Icon size={15} strokeWidth={active ? 2 : 1.5} />
                }
              </div>
              <span className={cn(
                "text-[10px] sm:text-[11px] font-bold leading-none whitespace-nowrap transition-colors hidden sm:block",
                active ? "text-[#2563EB]" : done ? "text-slate-500" : "text-slate-300"
              )}>
                {step.shortLabel}
              </span>
            </div>
            {/* Connector */}
            {idx < STEPS.length - 1 && (
              <div className="flex-1 h-[2px] mx-1 sm:mx-2 rounded-full overflow-hidden bg-slate-100">
                <motion.div
                  className="h-full bg-[#2563EB] origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: done ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
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
  step, label, desc, children,
}: {
  step: number; label: string; desc: string; current: number; children: React.ReactNode;
}) {
  return (
    <motion.section
      key={step}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-4"
    >
      {/* Section heading */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-[#2563EB] text-white text-xs font-bold flex items-center justify-center shrink-0">
          {step}
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-primary leading-tight">{label}</h2>
          <p className="text-xs sm:text-sm text-slate-500">{desc}</p>
        </div>
      </div>
      {children}
    </motion.section>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ReportFlow({ reporterId }: { reporterId: string | null }) {
  const [step, setStep] = useState(1);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [hasLocation, setHasLocation] = useState(false);
  const [locationCoords, setLocationCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [aiState, setAiState] = useState<AIState>("IDLE");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState<ProcessReportResult | null>(null);
  const [similarReports, setSimilarReports] = useState<SimilarReportMatch[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  // Keep a preview URL for the review step in sync with the selected file.
  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleUpload = (file: File | null) => {
    setImageFile(file);
    // A new photo invalidates any previous submission result.
    setResult(null);
    setSimilarReports([]);
    setSubmitError(null);
    setUploadProgress(0);
    setAiState("IDLE");
  };

  const canProceed = () => {
    if (step === 1) return !!imageFile;
    if (step === 2) return hasLocation;
    return true;
  };

  const goNext = () => step < 4 && setStep((s) => s + 1);
  const goPrev = () => step > 1 && setStep((s) => s - 1);

  const submitReport = async () => {
    if (!imageFile || !locationCoords) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setUploadProgress(0);
    setAiState("UPLOADING");

    try {
      const imageUrl = await uploadReportImageWithProgress(imageFile, setUploadProgress);

      setAiState("ANALYZING");
      const [data, matches] = await Promise.all([
        processReport({
          imageUrl,
          latitude: locationCoords.lat,
          longitude: locationCoords.lng,
          reporterId,
        }),
        getSimilarReports({
          imageUrl,
          latitude: locationCoords.lat,
          longitude: locationCoords.lng,
        }),
      ]);
      setResult(data);
      setSimilarReports(matches);
      setAiState("COMPLETE");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setSubmitError(message);
      setAiState("ERROR");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetFlow = () => {
    setStep(1);
    setImageFile(null);
    setHasLocation(false);
    setLocationCoords(null);
    setAiState("IDLE");
    setUploadProgress(0);
    setResult(null);
    setSimilarReports([]);
    setSubmitError(null);
  };

  const currentStepMeta = STEPS[step - 1];

  return (
    <div className="flex-1 flex flex-col lg:flex-row relative bg-[#F8FAFC] min-h-[calc(100vh-4rem)]">

      {/* ── Main content area ───────────────────────────────────────────────── */}
      <div className="flex-1 px-4 sm:px-6 lg:px-10 py-6 sm:py-8 pb-12 sm:pb-16">
        <div className="max-w-3xl mx-auto">

          {/* Breadcrumb / Page Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-2">
              <Link href="/" className="hover:text-primary transition-colors">CivicLens</Link>
              <ChevronRight size={13} className="opacity-40" />
              <span className="text-[#2563EB] font-bold">Report Issue</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-primary tracking-tight mb-1.5">
              Submit a Civic Observation
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-xl">
              Upload a photo of any civic defect. AI Vision will detect the issue, score severity, and route it to the right department.
            </p>
          </div>

          {/* Stepper Header */}
          <div className="bg-white rounded-2xl border border-border shadow-sm p-4 sm:p-5 mb-6 sm:mb-8">
            <StepBar current={step} />
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-border/50 pt-2.5">
              <span className="font-bold text-[#2563EB]">Step {step} of {STEPS.length}: {currentStepMeta.label}</span>
              <span className="hidden sm:inline text-slate-400">{currentStepMeta.desc}</span>
            </div>
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <Section key={1} step={1} label="Capture Evidence" desc="Photograph the issue or upload an existing photo from your gallery." current={step}>
                <CameraUploadCard onUploadComplete={handleUpload} />

                {/* Mobile AI Panel Inline rendering */}
                <div className="block lg:hidden mt-4">
                  <AIIntelligencePanel
                    state={aiState}
                    uploadProgress={uploadProgress}
                    result={result}
                    similarReports={similarReports}
                    error={submitError}
                  />
                </div>
              </Section>
            )}

            {step === 2 && (
              <Section key={2} step={2} label="Confirm Location" desc="GPS location is detected automatically. Tap or drag pin on map if needed." current={step}>
                <LiveMapPicker onLocationConfirm={(lat, lng) => {
                  setHasLocation(true);
                  setLocationCoords({ lat, lng });
                }} />
              </Section>
            )}

            {step === 3 && (
              <Section key={3} step={3} label="Additional Details" desc="Add details or AI-enhance description." current={step}>
                <DescriptionCard />
              </Section>
            )}

            {step === 4 && (
              <Section key={4} step={4} label="Review & Submit" desc="Verify report information before dispatching to official municipal department." current={step}>
                <ReviewSubmitCard
                  previewUrl={previewUrl}
                  locationCoords={locationCoords}
                  result={result}
                  similarReports={similarReports}
                  isSubmitting={isSubmitting}
                  aiState={aiState}
                  uploadProgress={uploadProgress}
                  submitError={submitError}
                />
              </Section>
            )}
          </AnimatePresence>

          {/* Inline Action Bar Card below form step content */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex items-center justify-between mt-6 gap-3">
            {!result && (
              <button
                onClick={goPrev}
                disabled={step === 1 || isSubmitting}
                className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-100 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                ← Back
              </button>
            )}

            {step < 4 ? (
              <button
                onClick={goNext}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#2563EB] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:bg-[#1D4ED8] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all ml-auto"
              >
                Continue
                <ChevronRight size={15} />
              </button>
            ) : result ? (
              <div className="flex items-center gap-3 ml-auto">
                <button
                  onClick={resetFlow}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-primary rounded-xl text-xs sm:text-sm font-bold hover:bg-slate-200 active:scale-95 transition-all"
                >
                  <RotateCcw size={15} /> Report Another Issue
                </button>
                <button
                  onClick={() => router.push("/map")}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#2563EB] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:bg-[#1D4ED8] active:scale-95 transition-all"
                >
                  <MapIcon size={15} /> View on Community Map
                </button>
              </div>
            ) : (
              <button
                onClick={submitReport}
                disabled={isSubmitting || !imageFile || !locationCoords}
                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:bg-green-700 active:scale-95 disabled:opacity-70 disabled:cursor-wait transition-all ml-auto"
              >
                {isSubmitting
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> {aiState === "UPLOADING" ? `Uploading… ${uploadProgress}%` : "Analyzing…"}</>
                  : submitError
                  ? <><RotateCcw size={16} /> Retry Submission</>
                  : <><CheckCircle2 size={16} /> Submit Report</>
                }
              </button>
            )}
          </div>

        </div>
      </div>

      {/* ── Desktop AI Intelligence Sidebar (lg+) ────────────────────────────── */}
      <AIIntelligencePanel
        state={aiState}
        uploadProgress={uploadProgress}
        result={result}
        similarReports={similarReports}
        error={submitError}
      />

    </div>
  );
}
