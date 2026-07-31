"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle, Search, BookOpen, MessageSquare, ShieldCheck,
  ChevronDown, Phone, Mail, FileText,
  CheckCircle2, Activity, LifeBuoy, Send, Cpu, Database, ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const FAQS = [
  {
    question: "How does the AI Vision detection system classify civic issues to official departments?",
    answer: "CivicLens runs a hybrid AI model combining YOLOv11 and Gemini Pro Vision. Detection mapping strictly assigns reports: Pothole → Road Maintenance Department, Garbage → Sanitation & Waste Management Department, Waterlogging → Drainage & Stormwater Department, Fallen Tree → Parks & Tree Maintenance Department, and Flood → Disaster Management & Emergency Response Department."
  },
  {
    question: "How do I reassign a report to a different official department?",
    answer: "Open the Priority Queue, locate the report, and click 'Change Department' or 'Dispatch'. A drop-down lets you reassign the issue to any of the 5 official municipal departments. Reassignments are logged in the immutable Audit Trail."
  },
  {
    question: "What are the 5 official departments handled by CivicLens?",
    answer: "The system strictly supports: (1) Road Maintenance Department, (2) Sanitation & Waste Management Department, (3) Drainage & Stormwater Department, (4) Parks & Tree Maintenance Department, and (5) Disaster Management & Emergency Response Department."
  },
  {
    question: "How do SLA rules work across official departments?",
    answer: "Each official department has pre-configured response targets (e.g., Disaster Management critical SLA is 1h, Road Maintenance critical SLA is 4h). When a report exceeds its SLA target without resolution, automatic escalations and notifications are sent to department leads."
  }
];

export default function HelpPage() {
  const [search, setSearch] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [ticketMsg, setTicketMsg] = useState("");
  const [ticketSent, setTicketSent] = useState(false);

  const filteredFaqs = FAQS.filter(f =>
    f.question.toLowerCase().includes(search.toLowerCase()) ||
    f.answer.toLowerCase().includes(search.toLowerCase())
  );

  const sendTicket = () => {
    if (!ticketMsg.trim()) return;
    setTicketSent(true);
    setTicketMsg("");
    setTimeout(() => setTicketSent(false), 4000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8FAFC]">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8 pb-20">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-[#2563EB] rounded-xl flex items-center justify-center shadow-sm">
                <HelpCircle size={16} className="text-white" />
              </div>
              <h1 className="text-2xl font-black text-primary tracking-tight">Admin Help Center</h1>
            </div>
            <p className="text-sm text-slate-500 font-medium">Documentation and guidance for municipal admin staff.</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search documentation and FAQs…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-border rounded-2xl text-sm focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 shadow-sm font-medium"
          />
        </div>

        {/* FAQ list */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden mb-6">
          <div className="p-4 border-b border-border">
            <h3 className="font-bold text-primary">Frequently Asked Questions</h3>
          </div>
          <div className="divide-y divide-border/60">
            {filteredFaqs.map((faq, idx) => (
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
            ))}
          </div>
        </div>

        {/* Support Ticket */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border flex items-center gap-2">
            <LifeBuoy size={16} className="text-[#2563EB]" />
            <h3 className="font-bold text-primary">Submit Platform Ticket</h3>
          </div>
          <div className="p-5 space-y-4">
            {ticketSent ? (
              <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-100 p-4 rounded-xl text-sm font-semibold">
                <CheckCircle2 size={16} /> Ticket submitted successfully.
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Issue Description</label>
                  <textarea value={ticketMsg} onChange={e => setTicketMsg(e.target.value)} rows={4}
                    placeholder="Describe any technical issue or department routing inquiry..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 resize-none" />
                </div>
                <button onClick={sendTicket} disabled={!ticketMsg.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#2563EB] text-white rounded-xl text-xs font-bold shadow-sm hover:bg-[#1D4ED8] disabled:opacity-50">
                  <Send size={13} /> Submit Ticket
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
