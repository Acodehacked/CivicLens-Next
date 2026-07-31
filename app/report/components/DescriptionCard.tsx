"use client";

import { useState } from "react";
import { Mic, Sparkles, RotateCcw, CheckCircle2, AlertTriangle, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";

type EnhanceState = "idle" | "loading" | "done" | "error";

export default function DescriptionCard() {
  const [text, setText] = useState("");
  const [enhanceState, setEnhanceState] = useState<EnhanceState>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [originalText, setOriginalText] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const maxLength = 600;

  const suggestions = [
    "Deep pothole",
    "Obscured by bushes",
    "Traffic hazard",
    "Water pooling",
    "Foul smell",
    "Broken signage",
  ];

  const canEnhance = text.trim().length >= 10 && enhanceState !== "loading";

  const handleEnhance = async () => {
    if (!canEnhance) return;

    setOriginalText(text); // save so user can revert
    setEnhanceState("loading");
    setErrorMsg(null);

    try {
      const res = await fetch("/api/enhance-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText: text }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setEnhanceState("error");
      } else {
        setText(data.enhanced);
        setEnhanceState("done");
      }
    } catch {
      setErrorMsg("Network error — check your connection and try again.");
      setEnhanceState("error");
    }
  };

  const handleRevert = () => {
    if (originalText !== null) {
      setText(originalText);
      setOriginalText(null);
    }
    setEnhanceState("idle");
    setErrorMsg(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-border/50">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-primary mb-0.5">Additional Details</h3>
            <p className="text-xs text-on-surface-muted leading-relaxed">
              Describe the issue in your own words. Our AI will rewrite it into a professional report description.
            </p>
          </div>

          {/* AI Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[11px] font-bold shrink-0">
            <Sparkles size={11} />
            AI Enhanced
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-4">
        {/* Quick-add suggestions */}
        <div className="flex flex-wrap gap-2">
          {suggestions.map((tag) => (
            <button
              key={tag}
              onClick={() => setText((prev) => (prev ? `${prev.trimEnd()}, ${tag}` : tag))}
              className="px-2.5 py-1 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-transparent transition-all active:scale-95"
            >
              + {tag}
            </button>
          ))}
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              // Reset enhance state when user edits
              if (enhanceState === "done") setEnhanceState("idle");
            }}
            placeholder="E.g. There is a large pothole near the junction causing traffic slowdown. Water is collecting in it after rain, making it hard to see at night…"
            className={cn(
              "w-full min-h-[140px] p-4 pr-12 rounded-xl border bg-[#F8FAFC] text-primary placeholder:text-on-surface-muted/50 focus:outline-none focus:ring-2 focus:border-accent transition-all resize-none text-sm leading-relaxed",
              enhanceState === "loading" ? "opacity-60 pointer-events-none border-blue-200 focus:ring-blue-100" :
              enhanceState === "done"    ? "border-green-300 focus:ring-green-100" :
              enhanceState === "error"   ? "border-red-200 focus:ring-red-100" :
              "border-border focus:ring-accent/20"
            )}
            maxLength={maxLength}
            disabled={enhanceState === "loading"}
          />

          {/* Loading shimmer overlay */}
          <AnimatePresence>
            {enhanceState === "loading" && (
              <motion.div
                key="shimmer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/80 to-transparent animate-shimmer" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mic / Copy button */}
          <div className="absolute bottom-3 right-3 flex flex-col gap-2">
            {enhanceState === "done" && (
              <button
                onClick={handleCopy}
                title={copied ? "Copied!" : "Copy to clipboard"}
                className={cn(
                  "p-1.5 rounded-lg border transition-all",
                  copied ? "bg-green-50 text-green-600 border-green-200" : "bg-white text-slate-400 border-border hover:text-primary shadow-sm"
                )}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            )}
            
          </div>
        </div>

        {/* Status feedback */}
        <AnimatePresence mode="wait">
          {enhanceState === "loading" && (
            <motion.div
              key="loading-msg"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-center gap-2 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2"
            >
              <Sparkles size={13} className="animate-pulse shrink-0" />
              AI is rewriting your description into a professional report…
            </motion.div>
          )}

          {enhanceState === "done" && (
            <motion.div
              key="done-msg"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-center justify-between gap-3 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={13} className="shrink-0" />
                Description enhanced successfully!
              </div>
              <button
                onClick={handleRevert}
                className="flex items-center gap-1 text-green-600 hover:text-green-800 underline underline-offset-2 font-semibold whitespace-nowrap"
              >
                <RotateCcw size={11} /> Undo
              </button>
            </motion.div>
          )}

          {enhanceState === "error" && (
            <motion.div
              key="error-msg"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-center justify-between gap-3 text-xs font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle size={13} className="shrink-0" />
                {errorMsg}
              </div>
              <button
                onClick={() => setEnhanceState("idle")}
                className="text-red-600 hover:text-red-800 underline underline-offset-2 font-semibold whitespace-nowrap"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer: char count + Enhance button */}
        <div className="flex items-center justify-between gap-4 pt-1">
          <span className={cn(
            "text-xs font-medium tabular-nums",
            text.length > maxLength * 0.9 ? "text-red-500" : "text-on-surface-muted/60"
          )}>
            {text.length} / {maxLength}
          </span>

          <div className="flex items-center gap-2">
            {enhanceState === "done" && originalText && (
              <button
                onClick={handleRevert}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1"
              >
                <RotateCcw size={12} /> Revert to original
              </button>
            )}

            <button
              onClick={handleEnhance}
              disabled={!canEnhance}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-all active:scale-[0.97]",
                canEnhance
                  ? "bg-primary text-white hover:bg-blue-700"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              )}
            >
              <Sparkles size={15} className={enhanceState === "loading" ? "animate-spin" : ""} />
              {enhanceState === "loading" ? "Enhancing…" : " Enhance with AI"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
