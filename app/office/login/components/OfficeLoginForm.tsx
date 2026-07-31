"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { loginDepartment } from "../actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full mt-2 py-3 bg-primary text-white rounded-xl text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary-hover hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
    >
      {pending ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          Authenticating...
        </>
      ) : (
        "Sign In to Dashboard"
      )}
    </button>
  );
}

export default function OfficeLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction] = useActionState(loginDepartment, undefined);

  return (
    <div className="w-full max-w-[420px] flex flex-col">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-muted hover:text-primary transition-colors mb-8">
        <ArrowLeft size={16} />
        Back to Home
      </Link>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-primary tracking-tight mb-2">Department Sign In</h2>
        <p className="text-sm text-on-surface-muted">Restricted access for department staff and administrators.</p>
      </div>

      <form action={formAction} className="flex flex-col gap-5">
        {state?.error && (
          <div className="rounded-xl bg-error-bg border border-error/20 px-4 py-3 text-sm font-medium text-error">
            {state.error}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-primary" htmlFor="email">Official Email</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-muted group-focus-within:text-accent transition-colors">
              <Mail size={18} />
            </div>
            <input
              name="email"
              id="email"
              type="email"
              required
              placeholder="name@city.gov"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm text-primary placeholder:text-on-surface-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-primary" htmlFor="password">Password</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-muted group-focus-within:text-accent transition-colors">
              <Lock size={18} />
            </div>
            <input
              name="password"
              id="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-white text-sm text-primary placeholder:text-on-surface-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all shadow-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-on-surface-muted hover:text-primary transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <SubmitButton />
      </form>

      <div className="mt-8 text-center flex flex-col gap-2">
        <span className="text-sm text-on-surface-muted">
          New department account?{" "}
          <Link href="/office/signup" className="font-semibold text-accent hover:text-accent-hover transition-colors">
            Register your department
          </Link>
        </span>
        <Link href="/login" className="text-xs font-medium text-on-surface-muted hover:text-primary transition-colors">
          Citizen? Sign in here
        </Link>
      </div>
    </div>
  );
}
