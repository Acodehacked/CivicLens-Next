"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    setStatus(error ? "error" : "sent");
  }

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-4 p-8">
      <h1 className="text-xl font-semibold">Sign in</h1>

      {status === "sent" ? (
        <p className="text-sm text-neutral-600">
          Check {email} for a magic link.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded border border-neutral-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded bg-neutral-900 px-3 py-2 text-sm text-white disabled:opacity-50"
          >
            {status === "sending" ? "Sending..." : "Send magic link"}
          </button>
          {status === "error" && (
            <p className="text-sm text-red-600">
              Something went wrong. Try again.
            </p>
          )}
        </form>
      )}
    </main>
  );
}
