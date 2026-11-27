"use client";

import { useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Globe,
  Languages,
  Mail,
  MapPin,
  MessageSquare,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

export default function FreelancerContactCard({
  freelancer = {
    name: "Alex Morgan",
    title: "Full Stack Web Developer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    initials: "AM",
    location: "New York, USA",
    responseTime: "1 Hour",
    status: "Available for Projects",
    rate: "$65/hr",
    languages: ["English (Native)", "Spanish (Conversational)"],
  },
}) {
  const { showToast } = useToast();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  function handleSendMessage(e) {
    e.preventDefault();
    if (!message.trim()) {
      showToast("Please write a short project note before sending.", "error");
      return;
    }
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setMessage("");
      showToast(`Inquiry delivered to ${freelancer.name}! Alex usually responds within 1 hour.`, "success");
    }, 600);
  }

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xl shadow-slate-200/50 space-y-6 sticky top-24">
      {/* Profile Summary Header */}
      <div className="flex items-center gap-3.5 pb-5 border-b border-slate-100">
        <div className="relative h-14 w-14 shrink-0">
          <img
            src={freelancer.avatar}
            alt={freelancer.name}
            className="h-full w-full rounded-2xl object-cover border border-slate-200 shadow-2xs"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.classList.remove("hidden");
            }}
          />
          <div className="hidden h-full w-full rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center">
            {freelancer.initials}
          </div>
          <span
            className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white"
            title="Online Now"
          />
        </div>

        <div>
          <h3 className="font-headline text-lg font-bold text-slate-900">
            {freelancer.name}
          </h3>
          <p className="text-xs text-violet-700 font-semibold">{freelancer.title}</p>
          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3" />
            <span>{freelancer.location}</span>
          </p>
        </div>
      </div>

      {/* Availability & Response Metas */}
      <div className="space-y-3 text-xs">
        {/* Availability */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/60 text-emerald-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold">{freelancer.status}</span>
          </div>
          <span className="font-bold text-[11px] bg-emerald-100/80 px-2 py-0.5 rounded-md">
            Active Now
          </span>
        </div>

        {/* Typical Turnaround */}
        <div className="flex items-center justify-between text-slate-600 py-1">
          <span className="flex items-center gap-1.5 text-slate-500">
            <Clock className="w-3.5 h-3.5 text-violet-600" />
            <span>Response Time:</span>
          </span>
          <span className="font-bold text-slate-800">⚡ Under {freelancer.responseTime}</span>
        </div>

        {/* Hourly Rate Guidance */}
        <div className="flex items-center justify-between text-slate-600 py-1">
          <span className="flex items-center gap-1.5 text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-violet-600" />
            <span>Hourly Benchmark:</span>
          </span>
          <span className="font-bold text-slate-900 font-headline text-sm">
            {freelancer.rate}
          </span>
        </div>

        {/* Languages */}
        <div className="flex items-start justify-between text-slate-600 py-1 border-t border-slate-100 pt-2.5">
          <span className="flex items-center gap-1.5 text-slate-500">
            <Languages className="w-3.5 h-3.5 text-violet-600" />
            <span>Languages:</span>
          </span>
          <div className="text-right space-y-0.5 text-[11px] font-medium text-slate-700">
            {freelancer.languages.map((lang) => (
              <div key={lang}>{lang}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Message Form */}
      <form onSubmit={handleSendMessage} className="space-y-3 pt-2">
        <label
          htmlFor="freelancer-quick-note"
          className="block text-xs font-bold uppercase tracking-wider text-slate-600"
        >
          Send a Quick Inquiry
        </label>
        <textarea
          id="freelancer-quick-note"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder={`Hi ${freelancer.name}, I have an inquiry regarding a full-stack project...`}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-violet-600 focus:ring-4 focus:ring-violet-500/10 focus:outline-none transition resize-none"
        />

        <button
          type="submit"
          disabled={isSending}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-sans text-xs sm:text-sm font-semibold shadow-lg shadow-violet-500/25 hover:from-violet-700 hover:to-indigo-700 transition active:scale-[0.99] disabled:opacity-60 cursor-pointer"
        >
          {isSending ? (
            <span>Sending Inquiry...</span>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Contact {freelancer.name}</span>
            </>
          )}
        </button>
      </form>

      {/* Escrow Guarantee Badge */}
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/50 p-3.5 flex items-start gap-2.5 text-xs text-slate-600 leading-snug">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-900 block">Milestone Escrow Guarantee</span>
          All contract payments are held securely in simulated escrow until you review and approve deliverables.
        </div>
      </div>
    </div>
  );
}
