"use client";

import Link from "next/link";
import { ArrowRight, Plus, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ClientWelcomeBanner() {
  const { user } = useAuth();
  const firstName = user?.name ? user.name.split(" ")[0] : "John";

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-[#0b1329] to-violet-950 p-6 sm:p-8 lg:p-10 text-white border border-slate-800 shadow-xl">
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-violet-600/30 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-indigo-600/30 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        
        {/* Left: Headlines */}
        <div className="space-y-2.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 py-1 text-xs font-semibold text-violet-300 backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Escrow Milestone Protection Active</span>
          </div>

          <h1 className="font-headline text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Welcome back, {firstName}!
          </h1>

          <p className="font-sans text-sm sm:text-base text-slate-300 leading-relaxed">
            Manage your projects, review active milestone deliveries, and collaborate with top-tier verified specialists.
          </p>
        </div>

        {/* Right: Prominent Explore Gigs Button */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Link
            href="/explore"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-sans text-sm font-semibold shadow-lg shadow-violet-500/30 hover:from-violet-700 hover:to-indigo-700 active:scale-[0.99] transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Explore Gigs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
