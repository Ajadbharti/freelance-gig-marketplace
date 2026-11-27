"use client";

import Link from "next/link";
import { ArrowRight, Heart, RotateCcw, Sparkles } from "lucide-react";

export default function SavedGigsEmptyState({
  isFiltered = false,
  onResetFilters,
}) {
  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-12 sm:p-16 text-center shadow-xs space-y-5 max-w-2xl mx-auto my-6">
      {/* Heart Icon Circle */}
      <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-3xl bg-violet-50 text-violet-600 border border-violet-100 shadow-sm">
        <Heart className="w-8 h-8 fill-violet-200 text-violet-600" />
      </div>

      {/* Headings */}
      <div className="space-y-2">
        <h3 className="font-headline text-xl sm:text-2xl font-bold text-slate-900">
          {isFiltered ? "No Matching Saved Gigs" : "No Saved Gigs Yet"}
        </h3>
        <p className="font-sans text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          {isFiltered
            ? "We couldn't find any saved gigs matching your keyword search or category filters. Try resetting filters to view all your bookmarks."
            : "You haven't bookmarked any freelance gigs yet. Browse our curated marketplace and tap the heart icon on any service to save it here for later."}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        {isFiltered ? (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 hover:bg-slate-100 transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        ) : null}

        <Link
          href="/explore"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-sans text-xs sm:text-sm font-semibold shadow-lg shadow-violet-500/25 hover:from-violet-700 hover:to-indigo-700 transition"
        >
          <Sparkles className="w-4 h-4" />
          <span>Explore Gigs</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
