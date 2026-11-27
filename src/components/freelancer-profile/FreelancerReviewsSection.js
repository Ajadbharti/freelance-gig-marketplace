"use client";

import { useState } from "react";
import { CheckCircle2, MessageSquare, Star, ThumbsUp } from "lucide-react";

const RATING_BREAKDOWN = [
  { star: 5, percentage: 92, count: 170 },
  { star: 4, percentage: 7, count: 12 },
  { star: 3, percentage: 1, count: 2 },
  { star: 2, percentage: 0, count: 0 },
  { star: 1, percentage: 0, count: 0 },
];

const CLIENT_REVIEWS = [
  {
    id: "rev-alex-1",
    author: "David Vance",
    role: "CTO, Northstar Platforms",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    initials: "DV",
    date: "3 days ago",
    rating: 5,
    projectTitle: "Next.js Multi-Tenant SaaS Dashboard",
    text: "Alex is in the top 1% of full-stack engineers I have ever hired. He architected our entire Next.js 15 client dashboard with clean server actions, zero hydration issues, and stellar Lighthouse scores. Communication was seamless from day one.",
    helpfulCount: 22,
  },
  {
    id: "rev-alex-2",
    author: "Claire Moreau",
    role: "Founder, Bloom Retail Group",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80",
    initials: "CM",
    date: "2 weeks ago",
    rating: 5,
    projectTitle: "Express & MongoDB High-Throughput REST API",
    text: "Delivered three days ahead of schedule! The backend code is modular, well-commented, and includes full integration test coverage. He even documented the entire API with Swagger without being asked.",
    helpfulCount: 16,
  },
  {
    id: "rev-alex-3",
    author: "Anand Kulkarni",
    role: "Product Lead, FinMatrix",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    initials: "AK",
    date: "1 month ago",
    rating: 5,
    projectTitle: "Figma to Responsive Tailwind Web App",
    text: "Pixel-perfect execution. Every single interaction state, dark mode token, and responsive breakpoint in our Figma design was converted exactly as specified. Will be working with Alex for all our upcoming sprints.",
    helpfulCount: 11,
  },
];

export default function FreelancerReviewsSection() {
  const [helpfulMap, setHelpfulMap] = useState({});

  function toggleHelpful(reviewId) {
    setHelpfulMap((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  }

  return (
    <section className="space-y-8 pt-4">
      {/* Section Headline */}
      <div className="space-y-1">
        <span className="font-sans text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
          Verified Feedback
        </span>
        <h2 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Client Reviews &amp; Ratings
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Real feedback from enterprise clients and startup founders who hired Alex Morgan on GigMarket.
        </p>
      </div>

      {/* Big Rating Summary Card */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Column: Big Score */}
        <div className="md:col-span-4 text-center md:text-left space-y-2 md:border-r md:border-slate-100 md:pr-8">
          <div className="flex items-baseline justify-center md:justify-start gap-2">
            <span className="font-headline text-5xl font-extrabold text-slate-900">
              5.0
            </span>
            <span className="text-slate-400 text-sm font-medium">/ 5.0</span>
          </div>

          <div className="flex justify-center md:justify-start text-amber-400 gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400" />
            ))}
          </div>

          <p className="text-xs text-slate-500 font-sans">
            Based on <strong>184 reviews</strong> across 142 completed projects with 100% 5-star rating reliability.
          </p>
        </div>

        {/* Right Column: Rating Breakdown Bars */}
        <div className="md:col-span-8 space-y-2.5">
          {RATING_BREAKDOWN.map((row) => (
            <div key={row.star} className="flex items-center gap-3 text-xs">
              <span className="w-12 font-medium text-slate-600 flex items-center gap-1 shrink-0">
                <span>{row.star}</span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              </span>

              <div className="h-2.5 flex-1 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
                  style={{ width: `${row.percentage}%` }}
                />
              </div>

              <span className="w-10 text-right font-mono text-slate-400 shrink-0">
                ({row.count})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Cards List */}
      <div className="space-y-4">
        {CLIENT_REVIEWS.map((rev) => {
          const isMarked = helpfulMap[rev.id];

          return (
            <div
              key={rev.id}
              className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-3"
            >
              {/* Header: Author + Star */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 shrink-0 rounded-full overflow-hidden border border-slate-200 bg-slate-100">
                    <img
                      src={rev.avatar}
                      alt={rev.author}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                    <div className="hidden h-full w-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                      {rev.initials}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {rev.author}
                    </h4>
                    <p className="text-xs text-slate-400">{rev.role}</p>
                    <p className="text-[11px] text-violet-700 font-semibold mt-0.5">
                      Project: {rev.projectTitle}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex text-amber-400 gap-0.5 justify-end">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5 font-sans">
                    {rev.date}
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                &ldquo;{rev.text}&rdquo;
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-600 font-medium text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified GigMarket Order
                </span>

                <button
                  type="button"
                  onClick={() => toggleHelpful(rev.id)}
                  className={`inline-flex items-center gap-1 font-semibold transition cursor-pointer ${
                    isMarked ? "text-violet-600" : "hover:text-slate-700"
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Helpful ({isMarked ? rev.helpfulCount + 1 : rev.helpfulCount})</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
