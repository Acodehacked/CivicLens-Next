"use client";

import { useActionState, useState, useTransition, startTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, MapPin, Phone, IdCard, Briefcase, Mail, Bell, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { updateCitizenProfile } from "../actions";
import { updateOwnNotificationPreference } from "@/lib/actions/settings";
import { completeProfileSchema, type CompleteProfileValues } from "@/app/complete-profile/schema";
import { PROFESSIONS } from "@/lib/constants/professions";

const Toggle = ({ checked, onChange, disabled }: { checked: boolean; onChange: () => void; disabled?: boolean }) => (
  <button
    onClick={onChange}
    disabled={disabled}
    className={cn(
      "w-10 h-5 rounded-full transition-colors relative shrink-0 disabled:opacity-50",
      checked ? "bg-primary" : "bg-slate-200"
    )}
  >
    <span
      className={cn(
        "absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform",
        checked ? "translate-x-5" : "translate-x-0.5"
      )}
    />
  </button>
);

export default function SettingsForm({
  email,
  defaultValues,
  emailNotificationsEnabled,
}: {
  email: string | null;
  defaultValues: CompleteProfileValues;
  emailNotificationsEnabled: boolean;
}) {
  const [state, formAction, isPending] = useActionState(updateCitizenProfile, undefined);
  const [notifEnabled, setNotifEnabled] = useState(emailNotificationsEnabled);
  const [notifPending, startNotifTransition] = useTransition();

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

  const toggleNotifications = () => {
    const next = !notifEnabled;
    setNotifEnabled(next);
    startNotifTransition(async () => {
      await updateOwnNotificationPreference(next);
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-black text-primary tracking-tight mb-1">Settings</h1>
        <p className="text-sm text-on-surface-muted">Your profile details and email notification preferences.</p>
      </div>

      <div className="bg-white border border-border rounded-2xl shadow-sm p-6 sm:p-8">
        <h2 className="text-base font-bold text-primary border-b border-border pb-3 mb-6">Profile</h2>

        <form onSubmit={handleSubmit(onValid)} className="flex flex-col gap-5" noValidate>
          {state?.error && (
            <div className="rounded-xl bg-error-bg border border-error/20 px-4 py-3 text-sm font-medium text-error">
              {state.error}
            </div>
          )}
          {state?.message && (
            <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-100 px-4 py-3 text-sm font-medium text-green-700">
              <CheckCircle2 size={16} /> {state.message}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-primary" htmlFor="email">Sign-in Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-muted">
                <Mail size={18} />
              </div>
              <input
                id="email"
                type="email"
                value={email ?? ""}
                disabled
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface-muted text-sm text-on-surface-muted"
              />
            </div>
          </div>

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
              "Save Changes"
            )}
          </button>
        </form>
      </div>

      <div className="bg-white border border-border rounded-2xl shadow-sm p-6 sm:p-8">
        <h2 className="text-base font-bold text-primary border-b border-border pb-3 mb-5">Email Notifications</h2>
        <div className="flex items-center justify-between p-4 bg-surface-muted rounded-xl border border-border">
          <div className="flex items-start gap-3">
            <Bell size={16} className="text-on-surface-muted mt-0.5" />
            <div>
              <div className="text-sm font-bold text-primary">Status-change alerts</div>
              <p className="text-xs text-on-surface-muted mt-0.5">
                Get an email whenever a department changes the status of an issue you reported.
              </p>
            </div>
          </div>
          <Toggle checked={notifEnabled} onChange={toggleNotifications} disabled={notifPending} />
        </div>
      </div>
    </div>
  );
}
