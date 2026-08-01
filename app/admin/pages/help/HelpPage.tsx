"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle, Search, ChevronDown, CheckCircle2, LifeBuoy, Send, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { submitSupportTicket } from "@/lib/actions/settings";

const FAQS = [
  {
    question: "How does the AI detection system route reports to departments?",
    answer:
      "Every photo goes through the YOLO11n + CLIP + Gemini pipeline, which classifies the issue and routes it by a fixed mapping: Pothole/Road Damage → Roads, Garbage/Illegal Dumping → Sanitation, Waterlogging/Blocked Drain → Drainage, Fallen Tree/Tree Hazard → Parks, Flood/Public Safety Hazard → Disaster Management. This mapping is fixed by the model's output classes and isn't manually editable.",
  },
  {
    question: "Why did two reports get merged into one entry?",
    answer:
      "When a new photo is visually similar (via CLIP embedding similarity) and close in location to an existing open complaint, it's merged into that complaint instead of creating a duplicate - the report count goes up and the complaint's priority score reflects the additional corroboration, but it stays a single entry in Issues/Priority Queue.",
  },
  {
    question: "What do the status values (Open, In Progress, Resolved, Rejected, Duplicate) mean?",
    answer:
      "Open: newly filed, awaiting action. In Progress: your department has started work. Resolved: marked complete - resolvedAt is stamped automatically the moment you set this status. Rejected: reviewed and found not actionable. Duplicate: manually identified as matching another complaint. Citizens who reported it get an email whenever you change the status, unless they've turned off notifications.",
  },
  {
    question: "How is the Priority Queue ordered?",
    answer:
      "By each complaint's priority score, which factors in severity, how long it's been open, and how many corroborating reports/similarity matches it has. It isn't manually reorderable - resolve the underlying complaint or its severity/age to change its position.",
  },
  {
    question: "Can I see reports from other departments?",
    answer:
      "If you're a department staff account, no - every page (Dashboard, Analytics, Issues, Priority Queue, Confirmations, History) is scoped to your own department automatically. Admin accounts see all departments everywhere.",
  },
  {
    question: "Where do the new-issue and status-change emails come from?",
    answer:
      "New-issue emails go to the department's contact email (set in Settings → Department Contacts, admin only) whenever the AI pipeline creates a fresh complaint for that department. Status-change emails go to everyone who reported that complaint and hasn't opted out in their own Settings.",
  },
];

export default function HelpPage() {
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [ticketMsg, setTicketMsg] = useState("");
  const [ticketSent, setTicketSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredFaqs = FAQS.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
  );

  const sendTicket = () => {
    if (!ticketMsg.trim()) return;
    setError(null);
    startTransition(async () => {
      try {
        await submitSupportTicket(ticketMsg);
        setTicketMsg("");
        setTicketSent(true);
        setTimeout(() => setTicketSent(false), 4000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to submit ticket.");
      }
    });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8 pb-20">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-sm">
                <HelpCircle size={16} className="text-white" />
              </div>
              <h1 className="text-2xl font-black text-primary tracking-tight">Help Center</h1>
            </div>
            <p className="text-sm text-slate-500 font-medium">How CivicLens actually works, and how to reach an admin.</p>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search FAQs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-border rounded-2xl text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 shadow-sm font-medium"
          />
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden mb-6">
          <div className="p-4 border-b border-border">
            <h3 className="font-bold text-primary">Frequently Asked Questions</h3>
          </div>
          <div className="divide-y divide-border/60">
            {filteredFaqs.length > 0 ? filteredFaqs.map((faq, idx) => (
              <div key={idx}>
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left flex items-center justify-between p-4 sm:p-5 hover:bg-slate-50/70 transition-colors"
                >
                  <span className="text-sm font-bold text-primary leading-snug pr-4">{faq.question}</span>
                  <ChevronDown size={16} className={cn("text-slate-400 shrink-0 transition-transform", openFaq === idx && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-border/60 pt-3">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )) : (
              <div className="p-8 text-center text-slate-400 text-xs font-semibold">No matching FAQs.</div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border flex items-center gap-2">
            <LifeBuoy size={16} className="text-[#2563EB]" />
            <h3 className="font-bold text-primary">Contact an Admin</h3>
          </div>
          <div className="p-5 space-y-4">
            {ticketSent ? (
              <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-100 p-4 rounded-xl text-sm font-semibold">
                <CheckCircle2 size={16} /> Sent to the admin team.
              </div>
            ) : (
              <>
                {error && (
                  <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-100 p-3 rounded-xl text-xs font-semibold">
                    <AlertCircle size={14} /> {error}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Message</label>
                  <textarea
                    value={ticketMsg}
                    onChange={(e) => setTicketMsg(e.target.value)}
                    rows={4}
                    placeholder="Describe a technical issue or question - this emails every admin account directly..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 resize-none"
                  />
                </div>
                <button
                  onClick={sendTicket}
                  disabled={!ticketMsg.trim() || isPending}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] text-white rounded-xl text-xs font-bold shadow-sm hover:bg-[#1D4ED8] disabled:opacity-50"
                >
                  <Send size={13} /> {isPending ? "Sending…" : "Send to Admins"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
