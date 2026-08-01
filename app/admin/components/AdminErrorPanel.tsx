"use client";

import { AlertTriangle } from "lucide-react";

// Shows the real error client-side instead of letting it fall through to
// Next's generic production error boundary, which redacts the message and
// only shows a digest - useless for debugging without digging through
// Vercel's function logs.
export default function AdminErrorPanel({ error }: { error: Error }) {
  return (
    <div className="p-6 sm:p-10 max-w-2xl mx-auto mt-10">
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 flex flex-col gap-3">
        <div className="flex items-center gap-2 text-red-700 font-bold">
          <AlertTriangle size={18} />
          Failed to load this page
        </div>
        <p className="text-sm text-red-800 font-mono whitespace-pre-wrap break-words">
          {error.message}
        </p>
      </div>
    </div>
  );
}
