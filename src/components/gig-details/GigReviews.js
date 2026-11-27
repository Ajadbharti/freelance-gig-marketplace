"use client";

import { useState } from "react";
import { Check, CheckCircle2, Search, Star, ThumbsUp } from "lucide-react";

const RATING_BREAKDOWN = [
  { star: 5, percentage: 88, count: 250 },
  { star: 4, percentage: 9, count: 26 },
  { star: 3, percentage: 2, count: 5 },
  { star: 2, percentage: 1, count: 2 },
  { star: 1, percentage: 0, count: 1 },
];

const REVIEWS_DATA = [
  {
    id: "rev-1",
    author: "Sarah Jenkins",
    country: "United States",
    countryFlag: "🇺🇸",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    initials: "SJ",
    date: "2 days ago",
    rating: 5,
    packagePurchased: "Standard Package ($50)",
    text: "Elena exceeded every single expectation! She provided 3 distinct, thoughtful logo concepts that fit our health-tech venture perfectly. Communication was prompt, and the vector files were organized impeccably. Highly recommend her to any founder looking for a world-class brand presence.",
    helpfulCount: 14,
  },
  {
    id: "rev-2",
    author: "Michael Chang",
    country: "Canada",
    countryFlag: "🇨🇦",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    initials: "MC",
    date: "1 week ago",
    rating: 5,
    packagePurchased: "Premium Package ($100)",
    text: "The brand style guide alone was worth double the price. Elena took our rough napkin sketch and transformed it into a clean, geometric emblem that looks right at home on our app store icon and physical merchandise. Fast delivery and zero hassle.",
    helpfulCount: 9,
  },
  {
    id: "rev-3",
    author: "Alexandre Dubois",
    country: "France",
    countryFlag: "🇫🇷",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    initials: "AD",
    date: "3 weeks ago",
    rating: 5,
    packagePurchased: "Standard Package ($50)",
    text: "Remarkable talent. Elena listened carefully to our design requirements and delivered earlier than scheduled. The 3D mockups she included in the package helped us pitch our angel round with total confidence.",
    helpfulCount: 6,
  },
];

export default function GigReviews() {
  const [helpfulMap, setHelpfulMap] = useState({});
  const [filterRating, setFilterRating] = useState(0);

  function toggleHelpful(reviewId) {
    setHelpfulMap((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  }

  const filteredReviews = filterRating
    ? REVIEWS_DATA.filter((r) => r.rating === filterRating)
    : REVIEWS_DATA;

  return (
    <section className="space-y-8 py-6 border-t border-slate-200">
      {/* Section Headline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline text-2xl font-bold tracking-tight text-slate-900">
            Reviews &amp; Ratings
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Real feedback from verified marketplace orders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterRating(0)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              filterRating === 0
                ? "bg-violet-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Reviews ({REVIEWS_DATA.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterRating(5)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
              filterRating === 5
                ? "bg-violet-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <span>5 Stars</span>
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          </button>
        </div>
      </div>

      {/* Rating Score Breakdown Card */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Column: Overall Big Score */}
        <div className="md:col-span-4 text-center md:text-left space-y-2 md:border-r md:border-slate-100 md:pr-8">
          <div className="flex items-baseline justify-center md:justify-start gap-2">
            <span className="font-headline text-5xl font-extrabold text-slate-900">
              4.9
            </span>
            <span className="text-slate-400 text-sm font-medium">/ 5.0</span>
          </div>

          <div className="flex justify-center md:justify-start text-amber-400 gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400" />
            ))}
          </div>

          <p className="text-xs text-slate-500 font-sans">
            Based on <strong>284 verified client ratings</strong> across 340+ orders.
          </p>
        </div>

        {/* Right Column: 5-to-1 Star Distribution Bars */}
        <div className="md:col-span-8 space-y-2.5">
          {RATING_BREAKDOWN.map((row) => (
            <div key={row.star} className="flex items-center gap-3 text-xs">
              <span className="w-12 font-medium text-slate-600 flex items-center gap-1 shrink-0">
                <span>{row.star}</span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              </span>

              {/* Progress Bar Container */}
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

      {/* Client Review Cards List */}
      <div className="space-y-4">
        {filteredReviews.map((rev) => {
          const isMarkedHelpful = helpfulMap[rev.id];

          return (
            <div
              key={rev.id}
              className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-3"
            >
              {/* Reviewer Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden border border-slate-200 bg-slate-100">
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
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {rev.author}
                      </span>
                      <span className="text-xs text-slate-400">
                        {rev.countryFlag} {rev.country}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Purchased: {rev.packagePurchased}
                    </span>
                  </div>
                </div>

                <span className="text-xs text-slate-400 font-sans">
                  {rev.date}
                </span>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>

              {/* Review Body */}
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                &ldquo;{rev.text}&rdquo;
              </p>

              {/* Helpful Footer */}
              <div className="flex items-center gap-4 pt-2 border-t border-slate-100 text-xs text-slate-400">
                <span>Was this review helpful?</span>
                <button
                  type="button"
                  onClick={() => toggleHelpful(rev.id)}
                  className={`inline-flex items-center gap-1 font-semibold transition cursor-pointer ${
                    isMarkedHelpful ? "text-violet-600" : "hover:text-slate-700"
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>
                    Yes ({isMarkedHelpful ? rev.helpfulCount + 1 : rev.helpfulCount})
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
