"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Layers,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

const POPULAR_TAGS = [
  "Website Development",
  "Logo Design",
  "Video Editing",
  "SEO",
];

export default function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [imgError, setImgError] = useState(false);

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/explore?q=${encodeURIComponent(query.trim())}`);
    }
  }

  function handleTagClick(tag) {
    router.push(`/explore?q=${encodeURIComponent(tag)}`);
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/50 to-white py-16 sm:py-20 lg:py-24">
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-tr from-violet-500/10 to-indigo-500/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headings & Search */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Curated Platform Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50/80 px-4 py-1.5 text-xs font-semibold text-violet-700 shadow-2xs">
              <Sparkles className="w-4 h-4 text-violet-600" />
              <span>Over 10,000+ Verified Freelancers Worldwide</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.12]">
                Find the Right Talent for{" "}
                <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Every Project.
                </span>
              </h1>
              <p className="font-sans text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Discover skilled freelancers and quality services to bring your ideas to life under deterministic milestone escrow.
              </p>
            </div>

            {/* Large Search Bar */}
            <form
              onSubmit={handleSearch}
              className="relative mx-auto lg:mx-0 max-w-2xl rounded-2xl bg-white p-2 border border-slate-200/90 shadow-xl shadow-slate-200/60 flex flex-col sm:flex-row items-stretch gap-2 transition-all focus-within:border-violet-600 focus-within:ring-4 focus-within:ring-violet-500/10"
            >
              <div className="flex flex-1 items-center px-3.5 gap-3">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="What service are you looking for?"
                  className="w-full bg-transparent py-2.5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-sans text-sm sm:text-base font-semibold shadow-md shadow-violet-500/25 hover:from-violet-700 hover:to-indigo-700 transition active:scale-[0.99] cursor-pointer"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Popular Searches Tags */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 font-sans text-xs">
              <span className="font-semibold text-slate-500 mr-1">Popular:</span>
              {POPULAR_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-slate-700 hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50/50 transition cursor-pointer shadow-2xs"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Quick Metrics Strip */}
            <div className="pt-4 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <p className="font-headline text-2xl font-bold text-slate-900">4.9/5</p>
                <p className="font-sans text-xs text-slate-500">Average Client Rating</p>
              </div>
              <div>
                <p className="font-headline text-2xl font-bold text-slate-900">₹45M+</p>
                <p className="font-sans text-xs text-slate-500">Paid to Freelancers</p>
              </div>
              <div>
                <p className="font-headline text-2xl font-bold text-slate-900">99.4%</p>
                <p className="font-sans text-xs text-slate-500">On-Time Delivery</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Showcase & Floating UI Cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer Card with Gradient Border */}
              <div className="relative rounded-3xl p-1 bg-gradient-to-tr from-violet-600/30 via-slate-200 to-indigo-600/30 shadow-2xl">
                <div className="relative overflow-hidden rounded-[22px] bg-slate-900 border border-slate-800">
                  
                  {/* Laptop Window Bar */}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/90 border-b border-slate-700/80">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                      <Code2 className="w-3.5 h-3.5 text-violet-400" />
                      <span>gigmarket.io/talent</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider bg-emerald-950/60 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                      ACTIVE
                    </span>
                  </div>

                  {/* Collaboration Artwork */}
                  <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-slate-950 flex items-center justify-center">
                    {!imgError ? (
                      <img
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                        alt="Skilled freelancers and clients collaborating"
                        className="w-full h-full object-cover object-center opacity-85 transition-transform duration-700 hover:scale-105"
                        onError={() => setImgError(true)}
                      />
                    ) : (
                      <div className="w-full h-full p-6 flex flex-col justify-between bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-white">Full-Stack SaaS Sprint</span>
                          <span className="text-emerald-400 text-sm font-bold">₹65,000</span>
                        </div>
                        <div className="space-y-2 py-4">
                          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-violet-500 to-emerald-400 w-4/5 rounded-full" />
                          </div>
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>Milestone #2 Completed</span>
                            <span className="text-emerald-400">Escrow Released</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

                    {/* Bottom Status Tag inside image */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-2 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/60 text-xs text-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-[11px]">Sprint Delivery Approved</span>
                      </div>
                      <span className="text-violet-300 font-semibold text-[11px]">Milestone #3</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Card 1: Top Rated Freelancer (Top Left) */}
              <div className="absolute -top-4 -left-4 z-20 flex items-center gap-2.5 rounded-2xl bg-white/95 px-3.5 py-2.5 text-slate-900 shadow-xl shadow-slate-900/10 border border-slate-200/80 backdrop-blur-md">
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

              {/* Floating Card 2: Completed Milestone Released (Top Right) */}
              <div className="absolute -top-3 -right-4 z-20 flex items-center gap-2.5 rounded-2xl bg-white/95 px-3.5 py-2.5 text-slate-900 shadow-xl shadow-slate-900/10 border border-slate-200/80 backdrop-blur-md">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-sans text-xs font-bold text-slate-900">Project Delivered</span>
                    <span className="rounded-full bg-emerald-50 px-1.5 py-0.2 text-[10px] font-bold text-emerald-700">
                      ₹65,000
                    </span>
                  </div>
                  <p className="font-sans text-[10px] text-slate-500">Escrow Released</p>
                </div>
              </div>

              {/* Floating Card 3: 100% Escrow Protection (Bottom Left) */}
              <div className="absolute -bottom-4 -left-3 z-20 flex items-center gap-2 rounded-xl bg-white/95 px-3 py-1.5 text-slate-900 shadow-lg shadow-slate-900/10 border border-slate-200/80 backdrop-blur-md">
                <ShieldCheck className="w-4 h-4 text-violet-600" />
                <span className="font-sans text-xs font-bold text-slate-800">
                  100% Escrow Protection
                </span>
              </div>

              {/* Floating Card 4: Active Projects (Bottom Right) */}
              <div className="absolute -bottom-4 -right-3 z-20 flex items-center gap-2.5 rounded-xl bg-white/95 px-3 py-1.5 text-slate-900 shadow-lg shadow-slate-900/10 border border-slate-200/80 backdrop-blur-md">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="font-sans text-xs font-bold text-slate-900 leading-tight">12,400+ Gigs</p>
                  <p className="font-sans text-[10px] text-slate-500 leading-tight">Completed Worldwide</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
