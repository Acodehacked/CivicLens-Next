"use client";

import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Mail, Phone, MapPin, MessageSquare, CheckCircle2, Send, HelpCircle } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 max-w-[var(--container-max)] mx-auto px-6 w-full">
        
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
            Contact Citizen Support
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Have questions about submitting a report, tracking an issue, or general inquiries? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          
          {/* Info cards */}
          <div className="space-y-4 lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 font-bold">
                <Mail size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-0.5">Email Support</h3>
                <p className="text-xs text-slate-500 mb-1">Response within 24 hours</p>
                <a href="mailto:citizens@civiclens.gov" className="text-xs font-bold text-[#2563EB]">support@civiclens.gov</a>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 font-bold">
                <Phone size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-0.5">Citizen Hotline</h3>
                <p className="text-xs text-slate-500 mb-1">Mon - Fri, 8am - 6pm</p>
                <span className="text-xs font-bold text-slate-900">1-800-CIVIC-LENS</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 font-bold">
                <MapPin size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-0.5">City Hall Helpdesk</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Civic Innovation Hub, Floor 1<br />100 Municipal Plaza, City Center
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-1 flex items-center gap-2">
              <MessageSquare className="text-[#2563EB]" size={20} /> Send a Message
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Fill out the form below and our team will get back to you shortly.
            </p>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center text-green-900">
                <CheckCircle2 size={40} className="mx-auto mb-3 text-green-600" />
                <h3 className="font-bold text-lg">Thank You!</h3>
                <p className="text-xs text-green-700 mt-1">Your inquiry has been received. Ticket ID #CIT-2941.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="jane@example.com"
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    placeholder="Question regarding a reported issue"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Message</label>
                  <textarea
                    rows={4}
                    placeholder="How can we assist you?"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#2563EB]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#2563EB] text-white rounded-xl font-bold text-xs hover:bg-[#1d4ed8] transition-colors shadow-sm flex items-center gap-2"
                >
                  <Send size={14} /> Send Inquiry
                </button>
              </form>
            )}
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
