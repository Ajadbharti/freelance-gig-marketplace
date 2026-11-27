"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function ClientOrdersHeader({ totalCount = 18 }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2">
      {/* Title & Subtitle */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50/80 px-3 py-1 text-xs font-semibold text-violet-700">
          <ShieldCheck className="w-3.5 h-3.5 text-violet-600" />
          <span>Client Milestone Portal · 100% Escrow Protected</span>
        </div>

        <h1 className="font-headline text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          My Orders
        </h1>

        <p className="font-sans text-sm sm:text-base text-slate-500 max-w-xl">
          Track and manage all your freelance orders, review active deliverables, and disburse milestone payments securely.
        </p>
      </div>

      {/* Prominent Explore Gigs Button */}
      <div className="shrink-0">
        <Link
          href="/explore"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-sans text-xs sm:text-sm font-semibold shadow-lg shadow-violet-500/25 hover:from-violet-700 hover:to-indigo-700 active:scale-[0.99] transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Explore Gigs</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
