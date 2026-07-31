"use client";

import { Save, Send, RotateCcw } from "lucide-react";

export default function ActionBar({ onSubmit, isReady }: { onSubmit: () => void, isReady: boolean }) {
  return (
    <div className="sticky bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-border shadow-[0_-4px_24px_-8px_rgba(0,0,0,0.05)] p-4 flex items-center justify-between z-10">
      
      <div className="flex gap-3">
        <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white border border-border rounded-lg text-sm font-semibold text-on-surface-muted hover:bg-surface-muted hover:text-primary transition-all">
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      <div className="flex gap-3 w-full sm:w-auto">
        <button className="flex-1 sm:flex-none px-4 py-2.5 bg-white border border-border rounded-lg text-sm font-semibold text-primary shadow-sm hover:bg-surface-muted transition-all">
          Save Draft
        </button>
        <button 
          onClick={onSubmit}
          disabled={!isReady}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-accent text-white rounded-lg text-sm font-semibold shadow-md shadow-accent/20 hover:bg-accent-hover hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all"
        >
          <Send size={16} />
          Submit Report
        </button>
      </div>
    </div>
  );
}
