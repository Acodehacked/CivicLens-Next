export default function TrustedBy() {
  return (
    <section className="w-full py-16 border-y border-border/50 bg-surface-muted overflow-hidden">
      <div className="max-w-[var(--container-max)] mx-auto px-6">
        <p className="text-center text-sm font-semibold text-on-surface-muted uppercase tracking-widest mb-8">
          Trusted by Innovative Municipalities & Organizations
        </p>
        
        {/* Logo Marquee Container */}
        <div className="relative flex overflow-hidden mask-horizontal-fade">
          <div className="animate-[marquee_40s_linear_infinite] flex items-center min-w-full justify-around gap-12 sm:gap-20">
            {/* Logo placeholders */}
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300">
                <div className="w-8 h-8 rounded-md bg-on-surface-muted/20" />
                <span className="font-bold text-xl tracking-tighter text-on-surface-muted">GovTech</span>
              </div>
            ))}
          </div>
          <div className="animate-[marquee_40s_linear_infinite] flex items-center min-w-full justify-around gap-12 sm:gap-20 absolute top-0 left-full">
            {/* Logo placeholders (duplicate for infinite scroll) */}
            {[...Array(6)].map((_, i) => (
              <div key={i+6} className="flex items-center gap-3 opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300">
                <div className="w-8 h-8 rounded-md bg-on-surface-muted/20" />
                <span className="font-bold text-xl tracking-tighter text-on-surface-muted">GovTech</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .mask-horizontal-fade {
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}} />
    </section>
  );
}
