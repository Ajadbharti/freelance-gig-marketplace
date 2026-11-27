"use client";

import Link from "next/link";
import { ArrowRight, Briefcase, Sparkles, UserPlus } from "lucide-react";

export default function CtaSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main Banner Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-[#0b1329] to-violet-950 p-8 sm:p-12 lg:p-16 text-center text-white border border-slate-800 shadow-2xl">
          
          {/* Ambient Lighting Orbs */}
          <div
            className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-violet-600/25 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            
            {/* Top pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="font-sans text-xs font-semibold tracking-wider text-violet-200 uppercase">
                Zero Platform Commission for Buyers
              </span>
            </div>

            {/* Headline & Description */}
            <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Ready to Start Your Next Project?
            </h2>
            <p className="font-sans text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto">
              Join thousands of fast-moving companies and top-tier technical freelancers collaborating securely on GigMarket.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/explore"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-slate-900 font-sans text-sm sm:text-base font-semibold shadow-xl shadow-slate-950/20 hover:bg-slate-100 transition active:scale-[0.99] cursor-pointer"
              >
                <span>Find a Freelancer</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/register?role=freelancer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-violet-400/40 bg-violet-600/30 text-white font-sans text-sm sm:text-base font-semibold backdrop-blur-md hover:bg-violet-600/50 transition active:scale-[0.99] cursor-pointer"
              >
                <Briefcase className="w-4 h-4 text-violet-300" />
                <span>Become a Freelancer</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-sans">
              <span>✓ 100% Escrow Protection</span>
              <span>✓ Verified Portfolios</span>
              <span>✓ 24/7 Dispute Resolution</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
