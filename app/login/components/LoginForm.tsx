"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, Eye, EyeOff, Loader2, Landmark, CheckCircle, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  rememberMe: z.boolean().optional(),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginValues) => {
    setIsSubmitting(true);
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Redirect to admin dashboard after brief success message
      setTimeout(() => router.push("/admin"), 1000);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-[400px] flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 rounded-full bg-success-bg border-4 border-white shadow-lg flex items-center justify-center text-success mb-6">
          <CheckCircle size={40} strokeWidth={2} />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">Authentication Successful</h2>
        <p className="text-sm text-on-surface-muted">Redirecting to your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[420px] flex flex-col">
      {/* Back to Home */}
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-muted hover:text-primary transition-colors mb-8">
        <ArrowLeft size={16} />
        Back to Home
      </Link>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-primary tracking-tight mb-2">Welcome Back</h2>
        <p className="text-sm text-on-surface-muted">Sign in to access your CivicLens dashboard.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        
        {/* Email Field */}
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
              placeholder="name@city.gov"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm text-primary placeholder:text-on-surface-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all shadow-sm"
            />
          </div>
          <AnimatePresence>
            {errors.email && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <span className="text-xs font-medium text-error mt-1 block">{errors.email?.message}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-primary" htmlFor="password">Password</label>
            <a href="#" className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors">Forgot Password?</a>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-muted group-focus-within:text-accent transition-colors">
              <Lock size={18} />
            </div>
            <input
              {...register("password")}
              id="password"
              type={showPassword ? "text" : "password"}
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
          <AnimatePresence>
            {errors.password && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <span className="text-xs font-medium text-error mt-1 block">{errors.password?.message}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Remember Me */}
        <div className="flex items-center gap-2">
          <input
            {...register("rememberMe")}
            type="checkbox"
            id="rememberMe"
            className="w-4 h-4 rounded border-border text-accent focus:ring-accent/20 transition-colors cursor-pointer"
          />
          <label htmlFor="rememberMe" className="text-sm text-on-surface-muted cursor-pointer select-none">
            Remember me for 30 days
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 py-3 bg-primary text-white rounded-xl text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary-hover hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:pointer-events-none"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Authenticating...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-8">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs font-semibold text-on-surface-muted/60 uppercase tracking-widest">OR</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Social Logins */}
      <div className="flex flex-col gap-3">
        <button className="w-full py-2.5 bg-white border border-border rounded-xl text-sm font-semibold text-primary shadow-sm hover:bg-surface-muted hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3">
          <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>
        <button className="w-full py-2.5 bg-white border border-border rounded-xl text-sm font-semibold text-primary shadow-sm hover:bg-surface-muted hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3">
          <svg className="w-4 h-4" viewBox="0 0 21 21"><path d="M10 0H0v10h10V0zM21 0H11v10h10V0zM10 11H0v10h10V11zM21 11H11v10h10V11z" fill="#00a4ef"/></svg>
          Continue with Microsoft
        </button>
        <button className="w-full py-2.5 bg-primary text-white border border-border rounded-xl text-sm font-semibold shadow-sm hover:bg-primary-hover hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3">
          <Landmark size={16} />
          Continue with Government SSO
        </button>
      </div>

      <div className="mt-8 text-center">
        <span className="text-sm text-on-surface-muted">Not an admin? </span>
        <Link href="/report" className="text-sm font-semibold text-accent hover:text-accent-hover transition-colors">Submit a Civic Report</Link>
      </div>
    </div>
  );
}
