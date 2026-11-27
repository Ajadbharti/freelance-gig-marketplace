"use client";

import { useState } from "react";
import { MessageSquare, Send, Sparkles, X } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

export default function ContactFreelancerModal({ gig, onClose }) {
  const { showToast } = useToast();
  const [message, setMessage] = useState("");

  const quickPills = [
    "Are you available for a project this week?",
    "Can you provide a custom quote for specific scope?",
    "Do you offer rush 24-hour turnaround?",
  ];

  function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim()) return;

    showToast(`Inquiry sent to ${gig.freelancer.name}! They typically respond within an hour.`, "success");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <img
              src={gig.freelancer.avatar}
              alt={gig.freelancer.name}
              className="h-10 w-10 rounded-full object-cover border border-slate-200"
            />
            <div>
              <h4 className="font-headline text-base font-bold text-slate-900">
                Contact {gig.freelancer.name}
              </h4>
              <p className="font-sans text-xs text-slate-500">
                Regarding: <span className="font-semibold text-slate-700">{gig.title}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Quick Prompt Pills */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans block">
              Quick Suggestions
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickPills.map((pill) => (
                <button
                  key={pill}
                  type="button"
                  onClick={() => setMessage((prev) => (prev ? `${prev} ${pill}` : pill))}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-600 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-700 transition cursor-pointer text-left"
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Your Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder={`Hi ${gig.freelancer.name}, I found your gig in my saved favorites and would love to discuss...`}
              className="w-full rounded-2xl border border-slate-200 p-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-4 focus:ring-violet-500/10"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!message.trim()}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-xs transition disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <span>Send Inquiry</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
