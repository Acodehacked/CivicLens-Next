"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, Bot, User, ArrowRight, RefreshCw, ChevronDown, CheckCircle2, ShieldCheck, MapPin, Zap } from "lucide-react";
import Link from "next/link";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  { label: "🚧 Report a pothole", prompt: "How do I report a pothole or road damage?" },
  { label: "🗺️ View community map", prompt: "Where can I view active community reports on the map?" },
  { label: "🏛️ 5 Official Departments", prompt: "What are the 5 official municipal departments?" },
  { label: "⚡ How AI vision works", prompt: "How does the AI vision engine triage issues?" },
];

export default function CivicAIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "Hello! 👋 I'm **CivicAI**, your municipal assistant powered by Groq Llama-3. How can I help you report an issue, track city infrastructure, or learn about our AI routing today?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    if (!textToSend) setInputValue("");
    setIsTyping(true);

    try {
      // Format messages payload for Groq OpenAI endpoint format
      const payloadMessages = newMessages.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payloadMessages }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch response from Groq AI API");
      }

      const data = await res.json();
      const botText = data.reply || "Thank you! You can submit a photo of the defect directly at /report.";

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: botText,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: "I can help with that! You can report any civic issue directly via our [Report Issue Page](/report) or explore active reports on our [Community Map](/community-map).",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        sender: "bot",
        text: "Conversation reset! Feel free to ask me anything about CivicLens.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  // Format bot response text with interactive links if /report or /community-map are mentioned
  const renderMessageContent = (text: string, sender: "bot" | "user") => {
    if (sender === "user") {
      return <p className="whitespace-pre-line">{text}</p>;
    }

    const hasReportLink = text.includes("/report");
    const hasMapLink = text.includes("/community-map");

    // Clean text format
    const cleanText = text
      .replace(/\[Report Issue Page\]\(\/report\)/g, "our Report Issue page")
      .replace(/\[Community Map\]\(\/community-map\)/g, "our Community Map")
      .replace(/\*\*(.*?)\*\*/g, "$1");

    return (
      <div className="space-y-2.5">
        <p className="whitespace-pre-line leading-relaxed">{cleanText}</p>

        {/* Action Link Buttons */}
        {(hasReportLink || hasMapLink) && (
          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2">
            {hasReportLink && (
              <Link
                href="/report"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#2563EB] px-3 py-1.5 rounded-xl shadow-sm hover:bg-[#1D4ED8] transition-colors"
              >
                Report an Issue <ArrowRight size={13} />
              </Link>
            )}
            {hasMapLink && (
              <Link
                href="/community-map"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors"
              >
                View Community Map <MapPin size={13} />
              </Link>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      
      {/* ── CHAT DRAWER PANEL ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto w-[350px] sm:w-[400px] h-[540px] max-h-[82vh] bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-3xl shadow-[0_30px_90px_rgba(37,99,235,0.22)] flex flex-col overflow-hidden mb-4"
          >
            {/* Ultra-Modern Header */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white p-4 flex items-center justify-between shadow-md shrink-0 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#2563EB] via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                    <Sparkles size={19} />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-slate-950" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-white flex items-center gap-2 tracking-tight">
                    CivicAI Assistant
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-[9px] font-extrabold rounded-full border border-blue-400/30 flex items-center gap-1">
                      <Zap size={10} className="text-yellow-400" /> Groq AI
                    </span>
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium">Real-Time Municipal Intelligence</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={resetChat}
                  title="Reset conversation"
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
                >
                  <RefreshCw size={15} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-gradient-to-b from-slate-50/60 to-slate-100/40">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[86%] p-3.5 rounded-2xl text-xs sm:text-sm ${
                      msg.sender === "user"
                        ? "bg-[#2563EB] text-white font-semibold rounded-br-none shadow-md shadow-blue-500/10"
                        : "bg-white text-slate-800 border border-slate-200/90 shadow-sm rounded-bl-none font-medium"
                    }`}
                  >
                    {renderMessageContent(msg.text, msg.sender)}
                  </div>

                  <span className="text-[9px] text-slate-400 font-bold mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 bg-white border border-slate-200/80 px-4 py-3 rounded-2xl rounded-bl-none max-w-[120px] shadow-sm"
                >
                  <span className="text-[10px] font-bold text-slate-400 mr-1">Thinking</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-bounce" style={{ animationDelay: "300ms" }} />
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions Pills */}
            <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              {QUICK_PROMPTS.map((q) => (
                <button
                  key={q.label}
                  onClick={() => handleSend(q.prompt)}
                  disabled={isTyping}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-[#2563EB] text-slate-700 text-[11px] font-bold rounded-full whitespace-nowrap transition-colors border border-slate-200/60 shrink-0 disabled:opacity-50"
                >
                  {q.label}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3.5 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask CivicAI anything..."
                disabled={isTyping}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/30 focus:border-[#2563EB] transition-all disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="w-10 h-10 rounded-2xl bg-[#2563EB] disabled:bg-slate-200 text-white flex items-center justify-center shadow-md hover:bg-[#1D4ED8] active:scale-95 transition-all shrink-0"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FLOATING TRIGGER BUTTON ── */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="pointer-events-auto relative px-5 py-3.5 rounded-full bg-gradient-to-r from-[#2563EB] via-indigo-600 to-blue-600 text-white font-black text-xs sm:text-sm shadow-[0_12px_40px_rgba(37,99,235,0.4)] flex items-center gap-2.5 border border-white/30 backdrop-blur-md group"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
        </span>
        <Sparkles className="w-4 h-4 text-white group-hover:rotate-12 transition-transform duration-300" />
        <span>Ask CivicAI</span>
        {isOpen ? <ChevronDown size={16} /> : null}
      </motion.button>

    </div>
  );
}
