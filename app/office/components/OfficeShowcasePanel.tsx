import { Building2, ShieldCheck, ListTodo } from "lucide-react";
import Link from "next/link";

export default function OfficeShowcasePanel() {
  return (
    <div className="relative hidden lg:flex flex-col w-[45%] h-full bg-gradient-to-br from-slate-900 to-primary overflow-hidden p-12 text-white">
      <div className="absolute inset-0 z-0 opacity-30 mix-blend-overlay pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-accent rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-0 w-[420px] h-[420px] bg-slate-500 rounded-full blur-[150px] opacity-30" />
      </div>

      <div className="relative z-10 flex flex-col gap-6 max-w-xl">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity w-fit">
          <div className="w-8 h-8 rounded-lg bg-white text-primary flex items-center justify-center font-bold text-xl tracking-tighter">
            C
          </div>
          <span className="text-2xl font-bold tracking-tight">CivicLens</span>
        </Link>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 w-fit backdrop-blur-md">
          <Building2 className="w-4 h-4 text-accent-light" />
          <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">
            Department Portal
          </span>
        </div>

        <h1 className="text-3xl xl:text-4xl font-bold leading-tight tracking-tight">
          Manage and resolve civic reports for your department
        </h1>

        <p className="text-lg text-white/70 leading-relaxed max-w-lg">
          Access the priority queue, track resolution times, and coordinate response across
          Roads, Sanitation, Drainage, Disaster Management, and Parks.
        </p>

        <div className="flex flex-col gap-3 mt-4">
          <div className="flex items-center gap-3 text-sm text-white/80">
            <ListTodo size={18} className="text-accent-light shrink-0" />
            AI-prioritized report queue for your department
          </div>
          <div className="flex items-center gap-3 text-sm text-white/80">
            <ShieldCheck size={18} className="text-accent-light shrink-0" />
            Restricted to verified department staff and administrators
          </div>
        </div>
      </div>
    </div>
  );
}
