"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "CivicLens has fundamentally changed how we operate. We're responding to critical infrastructure issues days faster than before.",
    author: "Sarah Jenkins",
    role: "Director of Public Works",
    city: "City of Portland"
  },
  {
    quote: "The AI duplicate detection alone saves our dispatchers over 15 hours a week. It's an indispensable tool for our municipality.",
    author: "David Chen",
    role: "City Manager",
    city: "Austin Metro"
  },
  {
    quote: "Citizens love the transparency, and our crews love the precise location and severity data. It's a win-win for the entire community.",
    author: "Maria Rodriguez",
    role: "Chief Innovation Officer",
    city: "Miami-Dade County"
  }
];

export default function Testimonials() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="testimonials" ref={ref} className="w-full py-24 md:py-32 px-6 bg-surface-muted">
      <div className="max-w-[var(--container-max)] mx-auto">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-primary tracking-tight mb-6">
            Loved by community leaders
          </h2>
          <p className="text-lg text-on-surface-muted">
            See how forward-thinking municipalities are transforming their operations with CivicLens.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
              className="bg-white p-8 rounded-3xl border border-border/50 shadow-sm flex flex-col justify-between"
            >
              <div>
                <Quote className="w-8 h-8 text-[#2563EB]/20 mb-6" />
                <p className="text-lg text-primary font-medium leading-relaxed mb-8">
                  "{t.quote}"
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB] font-bold text-lg">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <h5 className="font-bold text-primary text-sm">{t.author}</h5>
                  <p className="text-xs text-on-surface-muted">{t.role}, {t.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
