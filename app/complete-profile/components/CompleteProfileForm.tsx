"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { User, MapPin, Phone, IdCard, Briefcase, Loader2 } from "lucide-react";
import { completeProfile } from "../actions";
import { PROFESSIONS } from "@/lib/constants/professions";

type DefaultValues = {
  fullName: string;
  address: string;
  mobileNumber: string;
  aadhaarNumber: string;
  profession: string;
};

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
          Saving...
        </>
      ) : (
        "Save and Continue"
      )}
    </button>
  );
}

export default function CompleteProfileForm({ defaultValues }: { defaultValues: DefaultValues }) {
  const [state, formAction] = useActionState(completeProfile, undefined);

  return (
    <div className="w-full max-w-[420px] flex flex-col bg-white border border-border rounded-2xl shadow-sm p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-primary tracking-tight mb-2">Complete Your Profile</h2>
        <p className="text-sm text-on-surface-muted">
          A few more details so we can route your reports and contact you if needed.
        </p>
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
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-muted">
              <User size={18} />
            </div>
            <input
              name="fullName"
              id="fullName"
              type="text"
              required
              defaultValue={defaultValues.fullName}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-primary" htmlFor="mobileNumber">Mobile Number</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-muted">
              <Phone size={18} />
            </div>
            <input
              name="mobileNumber"
              id="mobileNumber"
              type="tel"
              required
              defaultValue={defaultValues.mobileNumber}
              placeholder="10-digit mobile number"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm text-primary placeholder:text-on-surface-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-primary" htmlFor="address">Address</label>
          <div className="relative group">
            <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none text-on-surface-muted">
              <MapPin size={18} />
            </div>
            <textarea
              name="address"
              id="address"
              required
              rows={2}
              defaultValue={defaultValues.address}
              placeholder="House no, street, area, city"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm text-primary placeholder:text-on-surface-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all shadow-sm resize-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-primary" htmlFor="profession">Profession</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-muted">
              <Briefcase size={18} />
            </div>
            <select
              name="profession"
              id="profession"
              required
              defaultValue={defaultValues.profession}
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
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-muted">
              <IdCard size={18} />
            </div>
            <input
              name="aadhaarNumber"
              id="aadhaarNumber"
              type="text"
              defaultValue={defaultValues.aadhaarNumber}
              placeholder="12-digit Aadhaar number"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm text-primary placeholder:text-on-surface-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all shadow-sm"
            />
          </div>
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}
