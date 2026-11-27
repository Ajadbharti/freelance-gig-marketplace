"use client";

import { CheckCircle2, Code2, Layers, ShieldCheck, Sparkles, Star, TrendingUp, Users } from "lucide-react";

export default function RegisterVisualSection() {
  return (
    <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-[#0b1329] to-violet-950 p-8 xl:p-12 text-white border border-slate-800 shadow-2xl">
      {/* Ambient gradient lighting glow */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl"
        aria-hidden="true"
      />

      {/* Top Protocol Header Badges */}
      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3.5 py-1.5 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span className="font-sans text-[11px] font-semibold tracking-wider text-violet-200 uppercase">
            Curated Talent Network
          </span>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300 font-medium backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>1,420+ vetted specialists active</span>
        </div>
      </div>

      {/* Centerpiece: Professional Workspace Showcase & Floating UI Elements */}
      <div className="relative my-8 z-10 px-2 py-4">
        
        {/* Main Workspace Frame */}
        <div className="relative mx-auto w-full max-w-[460px] rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-900/90 backdrop-blur-md">
          
          {/* Top Window Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/90 border-b border-slate-700/70">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
              <Code2 className="w-3.5 h-3.5 text-violet-400" />
              <span>gigmarket.io/opportunities</span>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded">
              VERIFIED
            </span>
          </div>

          {/* Visual Workspace Canvas */}
          <div className="relative h-64 sm:h-72 w-full p-5 flex flex-col justify-between bg-gradient-to-br from-slate-900 via-[#0f172a] to-violet-950/70">
            
            {/* Project Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300">
                  <Layers className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">Full-Stack Mobile &amp; Web Project</h3>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                    <span>Client: Stellar Ventures</span>
                    <span>·</span>
                    <span className="text-emerald-400 font-medium">Sprint 1 Funded</span>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                  ₹75,000
                </span>
                <p className="text-[10px] text-slate-400 mt-1">Escrow Funded</p>
              </div>
            </div>

            {/* Code / Milestone Status Block */}
            <div className="my-2 rounded-xl border border-slate-700/60 bg-slate-950/70 p-3 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-300 font-mono">
                <span className="flex items-center gap-1.5 text-violet-300">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Escrow Milestone Payout</span>
                </span>
                <span className="text-emerald-400 font-semibold">95% Completed</span>
              </div>

              <div className="space-y-1">
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-violet-500 via-indigo-500 to-emerald-400 w-11/12 rounded-full" />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Milestone 4 of 4: Direct Transfer</span>
                  <span className="text-emerald-400 font-medium">Ready for Release</span>
                </div>
              </div>
            </div>

            {/* Bottom Status Bar in Workspace */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-amber-600 to-orange-600 border border-slate-900 text-[10px] font-bold text-white flex items-center justify-center">
                    AP
                  </div>
                  <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 border border-slate-900 text-[10px] font-bold text-white flex items-center justify-center">
                    ER
                  </div>
                  <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 border border-slate-900 text-[10px] font-bold text-white flex items-center justify-center">
                    PS
                  </div>
                </div>
                <span className="text-[11px] text-slate-300 font-medium">Instant Contract Activation</span>
              </div>

              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero Commission</span>
              </span>
            </div>

            {/* In-Card Workspace Status Pill */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/60 text-xs mt-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-300 text-[11px]">Instant Contract Activation</span>
              </div>
              <span className="text-violet-300 font-semibold text-[11px]">Milestone Guaranteed</span>
            </div>
          </div>
        </div>

        {/* Floating Card 1: Top Rated Talent (Top Left) */}
        <div className="absolute -top-1 -left-2 xl:left-1 z-20 flex items-center gap-2.5 rounded-2xl bg-white/95 px-3.5 py-2.5 text-slate-900 shadow-xl shadow-slate-950/40 border border-white/50 backdrop-blur-md">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-500">
            <Star className="w-4 h-4 fill-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-sans text-xs font-bold text-slate-900 leading-none">5.0</span>
              <div className="flex text-amber-400 text-[10px] leading-none">★★★★★</div>
            </div>
            <p className="font-sans text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
              Top Rated Talent
            </p>
          </div>
        </div>

        {/* Floating Card 2: Completed Milestone (Top Right) */}
        <div className="absolute top-2 -right-2 xl:right-1 z-20 flex items-center gap-2.5 rounded-2xl bg-white/95 px-3.5 py-2.5 text-slate-900 shadow-xl shadow-slate-950/40 border border-white/50 backdrop-blur-md">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-sans text-xs font-bold text-slate-900">Project Milestone</span>
              <span className="rounded-full bg-emerald-50 px-1.5 py-0.2 text-[10px] font-bold text-emerald-700">
                ₹75,000
              </span>
            </div>
            <p className="font-sans text-[10px] text-slate-500">Escrow Released Instantly</p>
          </div>
        </div>

        {/* Floating Card 3: 100% Escrow Protection (Bottom Left) */}
        <div className="absolute -bottom-2 -left-2 xl:left-2 z-20 flex items-center gap-2 rounded-xl bg-white/95 px-3 py-1.5 text-slate-900 shadow-lg shadow-slate-950/30 border border-white/50 backdrop-blur-md">
          <ShieldCheck className="w-4 h-4 text-violet-600" />
          <span className="font-sans text-xs font-bold text-slate-800">
            100% Escrow Protection
          </span>
        </div>

        {/* Floating Card 4: Active Collaboration (Bottom Right) */}
        <div className="absolute -bottom-2 -right-2 xl:right-2 z-20 flex items-center gap-2.5 rounded-xl bg-white/95 px-3 py-1.5 text-slate-900 shadow-lg shadow-slate-950/30 border border-white/50 backdrop-blur-md">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
            <Users className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="font-sans text-xs font-bold text-slate-900 leading-tight">Live Collaboration</p>
            <p className="font-sans text-[10px] text-slate-500 leading-tight">Fast Milestone Reviews</p>
          </div>
        </div>
      </div>

      {/* Bottom Section: Headings & Editorial Testimonial */}
      <div className="relative z-10 space-y-5">
        <div>
          <h2 className="font-headline text-2xl xl:text-3xl font-bold tracking-tight text-white uppercase">
            YOUR NEXT OPPORTUNITY STARTS HERE.
          </h2>
          <p className="mt-1.5 text-xs xl:text-sm text-slate-300 leading-relaxed max-w-lg">
            Whether you&apos;re hiring talent or offering your skills, GigMarket brings opportunities together under deterministic milestone contracts.
          </p>
        </div>

        {/* Testimonial Quote */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 xl:p-5 backdrop-blur-md">
          <p className="text-xs xl:text-sm text-slate-200 italic leading-relaxed">
            &ldquo;Signing up on GigMarket was the turning point for our engineering agency. We reached high-value international clients within 48 hours.&rdquo;
          </p>
          <div className="mt-3.5 flex items-center gap-3 pt-3 border-t border-slate-800">
            {/* Polished gradient initial avatar */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-600 text-white font-sans text-xs font-bold shadow-md border border-violet-400/40">
              AP
            </div>
            <div>
              <p className="font-sans text-xs font-bold text-white">Arjun Patel</p>
              <p className="font-sans text-[11px] text-slate-400">Founder, CloudScale Studio</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
