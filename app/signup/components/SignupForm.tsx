"use client";

import { useActionState, useState, startTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Lock, MapPin, Phone, IdCard, Briefcase, Eye, EyeOff, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { signupCitizen } from "../actions";
import { signupSchema, type SignupValues } from "../schema";
import { PROFESSIONS } from "@/lib/constants/professions";

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(signupCitizen, undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) });

  // react-hook-form validates client-side first (zodResolver) - the server
  // action is only ever invoked with data that already passed validation,
  // so a rejected submission never round-trips to the server and never
  // risks clearing what the user typed.
  function onValid(values: SignupValues) {
    const formData = new FormData();
    formData.set("fullName", values.fullName);
    formData.set("email", values.email);
    formData.set("password", values.password);
    formData.set("address", values.address);
    formData.set("mobileNumber", values.mobileNumber);
    formData.set("aadhaarNumber", values.aadhaarNumber ?? "");
    formData.set("profession", values.profession);
    startTransition(() => {
      formAction(formData);
    });
  }

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

      <form onSubmit={handleSubmit(onValid)} className="flex flex-col gap-5" noValidate>
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
              {...register("fullName")}
              id="fullName"
              type="text"
              placeholder="Jane Doe"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm text-primary placeholder:text-on-surface-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all shadow-sm"
            />
          </div>
          {errors.fullName && <span className="text-xs font-medium text-error">{errors.fullName.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-primary" htmlFor="email">Email Address</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-muted group-focus-within:text-accent transition-colors">
              <Mail size={18} />
            </div>
            <input
              {...register("email")}
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm text-primary placeholder:text-on-surface-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all shadow-sm"
            />
          </div>
          {errors.email && <span className="text-xs font-medium text-error">{errors.email.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-primary" htmlFor="password">Password</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-muted group-focus-within:text-accent transition-colors">
              <Lock size={18} />
            </div>
            <input
              {...register("password")}
              id="password"
              type={showPassword ? "text" : "password"}
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
          {errors.password && <span className="text-xs font-medium text-error">{errors.password.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-primary" htmlFor="mobileNumber">Mobile Number</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-muted group-focus-within:text-accent transition-colors">
              <Phone size={18} />
            </div>
            <input
              {...register("mobileNumber")}
              id="mobileNumber"
              type="tel"
              placeholder="10-digit mobile number"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm text-primary placeholder:text-on-surface-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all shadow-sm"
            />
          </div>
          {errors.mobileNumber && <span className="text-xs font-medium text-error">{errors.mobileNumber.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-primary" htmlFor="address">Address</label>
          <div className="relative group">
            <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none text-on-surface-muted group-focus-within:text-accent transition-colors">
              <MapPin size={18} />
            </div>
            <textarea
              {...register("address")}
              id="address"
              rows={2}
              placeholder="House no, street, area, city"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm text-primary placeholder:text-on-surface-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all shadow-sm resize-none"
            />
          </div>
          {errors.address && <span className="text-xs font-medium text-error">{errors.address.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-primary" htmlFor="profession">Profession</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-muted group-focus-within:text-accent transition-colors">
              <Briefcase size={18} />
            </div>
            <select
              {...register("profession")}
              id="profession"
              defaultValue=""
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all shadow-sm appearance-none"
            >
              <option value="" disabled>Select your profession</option>
              {PROFESSIONS.map((profession) => (
                <option key={profession} value={profession}>{profession}</option>
              ))}
            </select>
          </div>
          {errors.profession && <span className="text-xs font-medium text-error">{errors.profession.message}</span>}
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
              {...register("aadhaarNumber")}
              id="aadhaarNumber"
              type="text"
              placeholder="12-digit Aadhaar number"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm text-primary placeholder:text-on-surface-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all shadow-sm"
            />
          </div>
          {errors.aadhaarNumber && <span className="text-xs font-medium text-error">{errors.aadhaarNumber.message}</span>}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-2 py-3 bg-primary text-white rounded-xl text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary-hover hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
        >
          {isPending ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <span className="text-sm text-on-surface-muted">Already have an account? </span>
        <Link href="/login" className="text-sm font-semibold text-accent hover:text-accent-hover transition-colors">Sign in</Link>
      </div>
    </div>
  );
}
