"use client";

import { useActionState, startTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, MapPin, Phone, IdCard, Briefcase, Loader2 } from "lucide-react";
import { completeProfile } from "../actions";
import { completeProfileSchema, type CompleteProfileValues } from "../schema";
import { PROFESSIONS } from "@/lib/constants/professions";

export default function CompleteProfileForm({ defaultValues }: { defaultValues: CompleteProfileValues }) {
  const [state, formAction, isPending] = useActionState(completeProfile, undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompleteProfileValues>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues,
  });

  function onValid(values: CompleteProfileValues) {
    const formData = new FormData();
    formData.set("fullName", values.fullName);
    formData.set("address", values.address);
    formData.set("mobileNumber", values.mobileNumber);
    formData.set("aadhaarNumber", values.aadhaarNumber ?? "");
    formData.set("profession", values.profession);
    startTransition(() => {
      formAction(formData);
    });
  }

  return (
    <div className="w-full max-w-[420px] flex flex-col bg-white border border-border rounded-2xl shadow-sm p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary tracking-tight mb-2">Complete Your Profile</h2>
        <p className="text-sm text-on-surface-muted">
          A few more details so we can route your reports and contact you if needed.
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
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-muted">
              <User size={18} />
            </div>
            <input
              {...register("fullName")}
              id="fullName"
              type="text"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all shadow-sm"
            />
          </div>
          {errors.fullName && <span className="text-xs font-medium text-error">{errors.fullName.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-primary" htmlFor="mobileNumber">Mobile Number</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-muted">
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
            <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none text-on-surface-muted">
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
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-muted">
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
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-muted">
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
              Saving...
            </>
          ) : (
            "Save and Continue"
          )}
        </button>
      </form>
    </div>
  );
}
