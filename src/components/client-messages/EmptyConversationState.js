"use client";

import { MessageSquare, ShieldCheck, Sparkles } from "lucide-react";

export default function EmptyConversationState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-3xl lg:rounded-none border-x border-slate-200/90 space-y-4 h-full min-h-[480px]">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-50 text-violet-600 border border-violet-100 shadow-sm">
        <MessageSquare className="w-8 h-8 text-violet-600 fill-violet-100" />
      </div>

      <div className="space-y-1.5 max-w-sm">
        <h3 className="font-headline text-lg sm:text-xl font-bold text-slate-900">
          Select a Conversation
        </h3>
        <p className="font-sans text-xs sm:text-sm text-slate-500 leading-relaxed">
          Choose a conversation from the left inbox to view chat history, discuss active orders, and exchange project deliverables.
        </p>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-mono">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>All conversations are protected by GigMarket escrow policies</span>
      </div>
    </div>
  );
}
