"use client";

import { MessageSquare, ShieldCheck, Sparkles } from "lucide-react";

export default function MessagesHeader({ unreadCount = 2 }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50/80 px-3 py-1 text-xs font-semibold text-violet-700">
          <MessageSquare className="w-3.5 h-3.5 fill-violet-600 text-violet-600" />
          <span>Active Direct Channels · {unreadCount > 0 ? `${unreadCount} Unread Messages` : "All Caught Up"}</span>
        </div>

        <h1 className="font-headline text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Messages
        </h1>

        <p className="font-sans text-xs sm:text-sm text-slate-500 max-w-xl">
          Stay connected with your freelancers and manage project conversations under bilateral milestone audits.
        </p>
      </div>

      <div className="hidden sm:flex items-center gap-2 text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 self-start sm:self-auto">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>End-to-End Escrow Audited</span>
      </div>
    </div>
  );
}
