"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Lock,
  Search,
  ShieldCheck,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useMarketplace } from "@/context/MarketplaceContext";
import GigCard from "@/components/gigs/GigCard";
import { NAV_CATEGORIES } from "@/data/categories";
import SafeImage from "@/components/ui/SafeImage";

export default function Landing() {
  const router = useRouter();
  const { user } = useAuth();
  const { gigs, freelancers } = useMarketplace();
  const [query, setQuery] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/gigs?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/gigs");
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      {/* Top Protocol Header Bar */}
      <section className="border-b border-slate-200 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 border border-slate-200 bg-slate-50 px-3 py-1 font-mono text-xs font-semibold text-slate-800">
            <span className="h-2 w-2 rounded-full bg-[#047857]" />
            <span>PROTOCOL v2.4 ACTIVE // NEXT SPRINT RECONCILIATION LIVE</span>
          </div>

          <h1 className="mt-5 font-serif text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl max-w-4xl">
            Contract High-Output Engineers & Designers Under Escrow.
          </h1>

          <p className="mt-4 max-w-2xl font-mono text-xs sm:text-sm text-slate-600 leading-relaxed">
            Deterministic milestone vault releases, cryptographic deliverables inspection, and zero upfront platform commissions. Verified top 1.4% technical talent contracting across Next.js, Figma, Rust & AI architectures.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-8 flex max-w-2xl border border-slate-300 bg-white shadow-sm focus-within:border-slate-800">
            <div className="flex flex-1 items-center px-4">
              <Search className="h-4 w-4 text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search technical specs, Figma UI, Next.js, or engineers..."
                className="w-full font-mono text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-[#047857] px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#065f46]"
            >
              SEARCH CATALOG
            </button>
          </form>

          {/* Quick Category Chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2 font-mono text-xs text-slate-600">
            <span className="text-slate-400">Popular Sprints:</span>
            <Link href="/gigs?q=Figma" className="border border-slate-200 bg-white px-2 py-0.5 hover:border-slate-400">
              #Figma UI/UX
            </Link>
            <Link href="/gigs?q=Next.js" className="border border-slate-200 bg-white px-2 py-0.5 hover:border-slate-400">
              #Next.js Fullstack
            </Link>
            <Link href="/gigs?q=Design+System" className="border border-slate-200 bg-white px-2 py-0.5 hover:border-slate-400">
              #Design Systems
            </Link>
            <Link href="/gigs?q=3D" className="border border-slate-200 bg-white px-2 py-0.5 hover:border-slate-400">
              #3D Blender
            </Link>
          </div>
        </div>
      </section>

      {/* Network Telemetry Banner */}
      <section className="border-b border-slate-200 bg-[#FAFBFB] py-6 font-mono">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 text-center">
            <div className="p-2 border-r border-slate-200 last:border-none">
              <p className="text-[10px] uppercase text-slate-500">ESCROW LIQUIDITY</p>
              <p className="font-serif text-2xl font-bold text-slate-950">₹24,20,00,000</p>
              <p className="text-[10px] text-emerald-700">Q1 VERIFIED</p>
            </div>
            <div className="p-2 border-r border-slate-200 last:border-none">
              <p className="text-[10px] uppercase text-slate-500">AVG CONTRACT FILL TIME</p>
              <p className="font-serif text-2xl font-bold text-slate-950">3.8 Hours</p>
              <p className="text-[10px] text-emerald-700">▲ 14% FASTER</p>
            </div>
            <div className="p-2 border-r border-slate-200 last:border-none">
              <p className="text-[10px] uppercase text-slate-500">DISPUTE RATE</p>
              <p className="font-serif text-2xl font-bold text-[#047857]">0.08%</p>
              <p className="text-[10px] text-slate-500">DETERMINISTIC SLA</p>
            </div>
            <div className="p-2">
              <p className="text-[10px] uppercase text-slate-500">APPLICANT ACCEPTANCE</p>
              <p className="font-serif text-2xl font-bold text-slate-950">Top 1.4%</p>
              <p className="text-[10px] text-slate-500">CODE AUDIT PASS</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Production Specs Section */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#047857]">
                VERIFIED CONTRACT CATALOG
              </span>
              <h2 className="mt-1 font-serif text-3xl font-bold text-slate-950">
                Featured Engineering & UI/UX Specs
              </h2>
            </div>
            <Link
              href="/gigs"
              className="font-mono text-xs font-bold uppercase tracking-wider text-slate-800 hover:text-[#047857]"
            >
              EXPLORE ALL 1,428 SPECS →
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gigs.slice(0, 6).map((gig) => (
              <GigCard key={gig.id} gig={gig} />
            ))}
          </div>
        </div>
      </section>

      {/* Top Rated Specialists Section */}
      <section className="border-t border-slate-200 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#047857]">
                AUDITED CONTRACTORS
              </span>
              <h2 className="mt-1 font-serif text-3xl font-bold text-slate-950">
                Vetted Technical Specialists
              </h2>
            </div>
            <Link
              href="/freelancers/f1"
              className="font-mono text-xs font-bold uppercase tracking-wider text-slate-800 hover:text-[#047857]"
            >
              INSPECT SAMPLE ARCHITECT (ELENA) →
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {freelancers.slice(0, 3).map((f) => (
              <div key={f.id} className="border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <SafeImage
                        src={f.avatar}
                        alt={f.name}
                        className="h-12 w-12 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <Link
                          href={`/freelancers/${f.id}`}
                          className="font-sans text-sm font-bold text-slate-950 hover:underline"
                        >
                          {f.name} <span className="text-[#047857]">✓</span>
                        </Link>
                        <p className="font-mono text-[10px] text-slate-500">{f.location}</p>
                      </div>
                    </div>
                    <span className="border border-emerald-300 bg-emerald-50 px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#047857]">
                      {f.tier || "TOP RATED"}
                    </span>
                  </div>

                  <p className="mt-3 font-mono text-xs font-semibold text-slate-800">
                    {f.headline}
                  </p>
                  <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-slate-600">
                    {f.bio}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1">
                    {(f.skills?.slice(0, 4) || []).map((s) => (
                      <span key={s} className="border border-slate-200 bg-[#FAFBFB] px-2 py-0.5 font-mono text-[9px] text-slate-700">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400">RATE</span>
                    <p className="font-bold text-slate-900">${f.hourlyRate || 95}/hr</p>
                  </div>
                  <Link
                    href={`/freelancers/${f.id}`}
                    className="border border-slate-300 bg-white px-3 py-1 font-bold uppercase text-slate-800 hover:bg-slate-50"
                  >
                    VIEW SPECS
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Escrow Guarantee Architecture Banner */}
      <section className="border-t border-slate-200 bg-[#FAFBFB] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="border border-slate-200 bg-white p-6 shadow-sm">
              <ShieldCheck className="h-8 w-8 text-[#047857]" />
              <h3 className="mt-4 font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
                100% ESCROW VAULT SETTLEMENT
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Client funds remain safely in cold multi-signature escrow vaults until pull requests, Figma deliverables, or architectural milestones pass verification.
              </p>
            </div>

            <div className="border border-slate-200 bg-white p-6 shadow-sm">
              <Lock className="h-8 w-8 text-[#047857]" />
              <h3 className="mt-4 font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
                SOC-2 TYPE II PROTOCOL SECURITY
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Full enterprise compliance with automated tax reporting, zero-leak credential isolation, and verified 256-bit hardware session tokens.
              </p>
            </div>

            <div className="border border-slate-200 bg-white p-6 shadow-sm">
              <Zap className="h-8 w-8 text-[#047857]" />
              <h3 className="mt-4 font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
                AUTOMATED GIT REPO DISBURSEMENT
              </h3>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Auto-sync pull requests with GitHub actions and automated code quality suites for zero-friction milestone releases.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
