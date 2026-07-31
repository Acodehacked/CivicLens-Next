export default function TrustedBy() {
  const municipalities = [
    { name: "Portland Metro", icon: "🏙️", color: "text-slate-600" },
    { name: "Austin City", icon: "⭐", color: "text-amber-600" },
    { name: "Miami-Dade", icon: "🌴", color: "text-blue-600" },
    { name: "Denver Gov", icon: "🏔️", color: "text-blue-600" },
    { name: "Chicago Dept", icon: "🌬️", color: "text-slate-600" },
    { name: "Seattle Works", icon: "🌧️", color: "text-slate-600" },
    { name: "Phoenix City", icon: "☀️", color: "text-orange-600" },
    { name: "Boston Metro", icon: "🦞", color: "text-red-600" },
  ];

  return (
    <section className="w-full py-14 border-y border-slate-100 bg-white overflow-hidden">
      <div className="max-w-[var(--container-max)] mx-auto px-6 mb-8">
        <p
          className="text-center text-xs font-semibold text-slate-400 uppercase tracking-widest"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Trusted by Innovative Municipalities &amp; Public Organizations
        </p>
      </div>

      {/* Logo Marquee */}
      <div className="relative flex overflow-hidden mask-horizontal-fade">
        <div className="animate-[marquee_35s_linear_infinite] flex items-center min-w-full justify-around gap-12 sm:gap-20">
          {municipalities.map((m, i) => (
            <div key={i} className="flex items-center gap-2.5 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 shrink-0">
              <span className="text-2xl" aria-hidden="true">{m.icon}</span>
              <span className={`font-bold text-lg tracking-tight ${m.color} whitespace-nowrap`} style={{ fontFamily: "var(--font-heading)" }}>
                {m.name}
              </span>
            </div>
          ))}
        </div>
        <div className="animate-[marquee_35s_linear_infinite] flex items-center min-w-full justify-around gap-12 sm:gap-20 absolute top-0 left-full">
          {municipalities.map((m, i) => (
            <div key={i + 8} className="flex items-center gap-2.5 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300 shrink-0">
              <span className="text-2xl" aria-hidden="true">{m.icon}</span>
              <span className={`font-bold text-lg tracking-tight ${m.color} whitespace-nowrap`} style={{ fontFamily: "var(--font-heading)" }}>
                {m.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .mask-horizontal-fade {
          -webkit-mask-image: linear-gradient(to right, transparent, black 12%, black 88%, transparent);
          mask-image: linear-gradient(to right, transparent, black 12%, black 88%, transparent);
        }
      `}} />
    </section>
  );
}
