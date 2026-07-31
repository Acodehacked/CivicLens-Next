"use client";

import { useActionState, useState, startTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Lock, Building2, Eye, EyeOff, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { signupDepartmentStaff } from "../actions";
import { departmentSignupSchema, type DepartmentSignupValues } from "../schema";
import { DEPARTMENTS, DEPARTMENT_LABELS } from "@/lib/constants/departments";

export default function OfficeSignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, isPending] = useActionState(signupDepartmentStaff, undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DepartmentSignupValues>({ resolver: zodResolver(departmentSignupSchema) });

  function onValid(values: DepartmentSignupValues) {
    const formData = new FormData();
    formData.set("fullName", values.fullName);
    formData.set("email", values.email);
    formData.set("password", values.password);
    formData.set("department", values.department);
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
        <Link href="/office/login" className="mt-8 text-sm font-semibold text-accent hover:text-accent-hover transition-colors">
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
        <h2 className="text-3xl font-bold text-primary tracking-tight mb-2">Register Your Department</h2>
        <p className="text-sm text-on-surface-muted">
          Creates a department staff account with access to the admin dashboard for the selected department.
        </p>
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
          <label className="text-sm font-semibold text-primary" htmlFor="email">Official Email</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-muted group-focus-within:text-accent transition-colors">
              <Mail size={18} />
            </div>
            <input
              {...register("email")}
              id="email"
              type="email"
              placeholder="name@city.gov"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm text-primary placeholder:text-on-surface-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all shadow-sm"
            />
          </div>
          {errors.email && <span className="text-xs font-medium text-error">{errors.email.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-primary" htmlFor="department">Department</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-muted group-focus-within:text-accent transition-colors">
              <Building2 size={18} />
            </div>
            <select
              {...register("department")}
              id="department"
              defaultValue=""
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all shadow-sm appearance-none"
            >
              <option value="" disabled>Select your department</option>
              {DEPARTMENTS.map((department) => (
                <option key={department} value={department}>{DEPARTMENT_LABELS[department]}</option>
              ))}
            </select>
          </div>
          {errors.department && <span className="text-xs font-medium text-error">{errors.department.message}</span>}
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
            "Register Department Account"
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <span className="text-sm text-on-surface-muted">Already registered? </span>
        <Link href="/office/login" className="text-sm font-semibold text-accent hover:text-accent-hover transition-colors">Sign in</Link>
      </div>
    </div>
  );
}
