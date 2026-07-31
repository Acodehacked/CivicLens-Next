"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { User, Mail, Lock, MapPin, Phone, IdCard, Briefcase, Eye, EyeOff, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { signupCitizen } from "../actions";
import { PROFESSIONS } from "@/lib/constants/professions";

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
          Creating account...
        </>
      ) : (
        "Create Account"
      )}
    </button>
  );
}

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction] = useActionState(signupCitizen, undefined);

  if (state?.message) {
    return (
      <div className="w-full max-w-[420px] flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-success-bg border-4 border-white shadow-lg flex items-center justify-center text-success mb-6">
          <CheckCircle size={40} strokeWidth={2} />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">Almost there</h2>
        <p className="text-sm text-on-surface-muted">{state.message}</p>
        <Link href="/login" className="mt-8 text-sm font-semibold text-accent hover:text-accent-hover transition-colors">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[420px] flex flex-col">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-muted hover:text-primary transition-colors mb-8">
        <ArrowLeft size={16} />
        Back to Home
      </Link>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-primary tracking-tight mb-2">Create Your Account</h2>
        <p className="text-sm text-on-surface-muted">Join CivicLens to report and track issues in your city.</p>
      </div>

      <form action={formAction} className="flex flex-col gap-5">
        {state?.error && (
          <div className="rounded-xl bg-error-bg border border-error/20 px-4 py-3 text-sm font-medium text-error">
            {state.error}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-primary" htmlFor="fullName">Full Name</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-muted group-focus-within:text-accent transition-colors">
              <User size={18} />
            </div>
            <input
              name="fullName"
              id="fullName"
              type="text"
              required
              placeholder="Jane Doe"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm text-primary placeholder:text-on-surface-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-primary" htmlFor="email">Email Address</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-muted group-focus-within:text-accent transition-colors">
              <Mail size={18} />
            </div>
            <input
              name="email"
              id="email"
              type="email"
              required
              placeholder="you@example.com"
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
              minLength={8}
              placeholder="At least 8 characters"
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

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-primary" htmlFor="mobileNumber">Mobile Number</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-muted group-focus-within:text-accent transition-colors">
              <Phone size={18} />
            </div>
            <input
              name="mobileNumber"
              id="mobileNumber"
              type="tel"
              required
              placeholder="10-digit mobile number"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm text-primary placeholder:text-on-surface-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-primary" htmlFor="address">Address</label>
          <div className="relative group">
            <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none text-on-surface-muted group-focus-within:text-accent transition-colors">
              <MapPin size={18} />
            </div>
            <textarea
              name="address"
              id="address"
              required
              rows={2}
              placeholder="House no, street, area, city"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm text-primary placeholder:text-on-surface-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all shadow-sm resize-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-primary" htmlFor="profession">Profession</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-muted group-focus-within:text-accent transition-colors">
              <Briefcase size={18} />
            </div>
            <select
              name="profession"
              id="profession"
              required
              defaultValue=""
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all shadow-sm appearance-none"
            >
              <option value="" disabled>Select your profession</option>
              {PROFESSIONS.map((profession) => (
                <option key={profession} value={profession}>{profession}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-primary" htmlFor="aadhaarNumber">
            Aadhaar Number <span className="font-normal text-on-surface-muted">(optional)</span>
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-muted group-focus-within:text-accent transition-colors">
              <IdCard size={18} />
            </div>
            <input
              name="aadhaarNumber"
              id="aadhaarNumber"
              type="text"
              placeholder="12-digit Aadhaar number"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm text-primary placeholder:text-on-surface-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all shadow-sm"
            />
          </div>
        </div>

        <SubmitButton />
      </form>

      <div className="mt-8 text-center">
        <span className="text-sm text-on-surface-muted">Already have an account? </span>
        <Link href="/login" className="text-sm font-semibold text-accent hover:text-accent-hover transition-colors">Sign in</Link>
      </div>
    </div>
  );
}
