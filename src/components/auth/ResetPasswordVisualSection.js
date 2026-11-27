"use client";

import { useState } from "react";
import { CheckCircle2, KeyRound, Lock, ShieldAlert, ShieldCheck, Sparkles } from "lucide-react";

export default function ResetPasswordVisualSection() {
  const [imgError, setImgError] = useState(false);

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
          <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
          <span className="font-sans text-[11px] font-semibold tracking-wider text-violet-200 uppercase">
            Cryptographic Vault Protection
          </span>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300 font-medium backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Hardware Security Standard</span>
        </div>
      </div>

      {/* Centerpiece: Laptop / Security Shield Showcase & Floating Cards */}
      <div className="relative my-8 z-10 px-2 py-4">
        
        {/* Device Frame */}
        <div className="relative mx-auto w-full max-w-[460px] rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-900">
          
          {/* Top Window Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/90 border-b border-slate-700/70">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
              <Lock className="w-3.5 h-3.5 text-violet-400" />
              <span>gigmarket.io/auth/reset-vault</span>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded">
              VERIFIED
            </span>
          </div>

          {/* Visual Showcase: Digital Lock and Shield Illustration */}
          <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-950 flex items-center justify-center">
            {!imgError ? (
              <img
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"
                alt="Cybersecurity digital lock and shield interface"
                className="w-full h-full object-cover object-center opacity-85 transition-transform duration-700 hover:scale-105"
                onError={() => setImgError(true)}
              />
            ) : (
              /* High-end vector SVG fallback if network blocks image */
              <div className="w-full h-full p-6 flex flex-col justify-between bg-gradient-to-br from-slate-900 via-indigo-950/90 to-violet-950/90">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-violet-600/30 border border-violet-500/40 text-violet-300">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Password Encryption Vault</p>
                      <p className="text-[10px] text-slate-400">Status: Secure Cipher Active</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400">256-Bit</span>
                </div>
                <div className="space-y-2 py-4">
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet-500 to-emerald-400 w-full rounded-full" />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Token Invalidation Protocol</span>
                    <span className="text-emerald-400 font-medium">One-Time Use Only</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-violet-400" /> Dynamic Salting
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" /> Zero Plaintext Storage
                  </span>
                </div>
              </div>
            )}

            {/* Gradient overlay on image */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

            {/* In-Card Status Pill */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-2 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/60 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-slate-300 text-[11px]">Vault Security: Synchronized</span>
              </div>
              <span className="text-violet-300 font-semibold text-[11px]">Token Revocation Active</span>
            </div>
          </div>
        </div>

        {/* Floating Card 1: Key Encryption (Top Right) */}
        <div className="absolute top-2 -right-2 xl:right-1 z-20 flex items-center gap-2.5 rounded-2xl bg-white/95 px-3.5 py-2.5 text-slate-900 shadow-xl shadow-slate-950/40 border border-white/50 backdrop-blur-md">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-sans text-xs font-bold text-slate-900">Cryptographic Hash</span>
              <span className="rounded-full bg-violet-50 px-1.5 py-0.2 text-[10px] font-bold text-violet-700">
                SHA-256
              </span>
            </div>
            <p className="font-sans text-[10px] text-slate-500">Zero plaintext storage</p>
          </div>
        </div>

        {/* Floating Card 2: Digital Shield (Top Left) */}
        <div className="absolute -top-1 -left-2 xl:left-1 z-20 flex items-center gap-2.5 rounded-2xl bg-white/95 px-3.5 py-2.5 text-slate-900 shadow-xl shadow-slate-950/40 border border-white/50 backdrop-blur-md">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-sans text-xs font-bold text-slate-900 leading-none">Vault Shield</span>
            </div>
            <p className="font-sans text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
              Single-Use Token
            </p>
          </div>
        </div>

        {/* Floating Card 3: Instant Invalidation (Bottom Left) */}
        <div className="absolute -bottom-2 -left-2 xl:left-2 z-20 flex items-center gap-2 rounded-xl bg-white/95 px-3 py-1.5 text-slate-900 shadow-lg shadow-slate-950/30 border border-white/50 backdrop-blur-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span className="font-sans text-xs font-bold text-slate-800">
            Token Auto-Invalidation
          </span>
        </div>

        {/* Floating Card 4: Multi-Device Security (Bottom Right) */}
        <div className="absolute -bottom-2 -right-2 xl:right-2 z-20 flex items-center gap-2.5 rounded-xl bg-white/95 px-3 py-1.5 text-slate-900 shadow-lg shadow-slate-950/30 border border-white/50 backdrop-blur-md">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="font-sans text-xs font-bold text-slate-900 leading-tight">Session Guard</p>
            <p className="font-sans text-[10px] text-slate-500 leading-tight">Revokes obsolete sessions</p>
          </div>
        </div>
      </div>

      {/* Bottom Section: Headings & Security Advisory */}
      <div className="relative z-10 space-y-5">
        <div>
          <h2 className="font-headline text-2xl xl:text-3xl font-bold tracking-tight text-white uppercase">
            SECURE YOUR ACCOUNT.
          </h2>
          <p className="mt-1.5 text-xs xl:text-sm text-slate-300 leading-relaxed max-w-lg">
            Create a strong password and continue your journey with GigMarket under deterministic escrow and identity protection.
          </p>
        </div>

        {/* Security Best Practices Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 xl:p-5 backdrop-blur-md">
          <p className="text-xs xl:text-sm text-slate-200 italic leading-relaxed">
            &ldquo;Resetting your credentials automatically invalidates the temporary reset token to prevent replay attacks and safeguard your marketplace balance.&rdquo;
          </p>
          <div className="mt-3.5 flex items-center justify-between gap-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> OWASP Compliance
            </span>
            <span>Deterministic Escrow Safety</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
