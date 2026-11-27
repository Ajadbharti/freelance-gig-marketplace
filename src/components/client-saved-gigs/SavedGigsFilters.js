"use client";

import { ChevronDown, Filter, RotateCcw, Search, SlidersHorizontal, Star } from "lucide-react";

export const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "Web Development", label: "Web Development" },
  { value: "Graphics & Design", label: "Graphics & Design" },
  { value: "Data & AI", label: "Data & AI" },
  { value: "Video & Animation", label: "Video & Animation" },
  { value: "Programming & Tech", label: "Programming & Tech" },
  { value: "Digital Marketing", label: "Digital Marketing" },
];

export const PRICE_OPTIONS = [
  { value: "all", label: "All Prices" },
  { value: "under50", label: "Under $50" },
  { value: "50to100", label: "$50 to $100" },
  { value: "100to200", label: "$100 to $200" },
  { value: "200plus", label: "$200 & Above" },
];

export const RATING_OPTIONS = [
  { value: "all", label: "All Ratings" },
  { value: "5.0", label: "5.0 Stars (Perfect)" },
  { value: "4.8", label: "4.8+ Stars" },
];

export const SORT_OPTIONS = [
  { value: "recent", label: "Recently Saved" },
  { value: "highest_rated", label: "Highest Rated" },
  { value: "price_low", label: "Lowest Price" },
  { value: "price_high", label: "Highest Price" },
];

export default function SavedGigsFilters({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  priceFilter,
  onPriceChange,
  ratingFilter,
  onRatingChange,
  sortBy,
  onSortChange,
  onResetFilters,
  totalResults = 0,
}) {
  const isFiltered =
    searchQuery.trim() !== "" ||
    categoryFilter !== "all" ||
    priceFilter !== "all" ||
    ratingFilter !== "all" ||
    sortBy !== "recent";

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs space-y-4">
      {/* Top Filter Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        
        {/* 1. Search Saved Gigs Input (4 Cols on Desktop) */}
        <div className="lg:col-span-4 relative">
          <div className="relative flex items-center rounded-2xl border border-slate-200 bg-slate-50/70 focus-within:bg-white focus-within:border-violet-600 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all">
            <span className="pl-3.5 pr-1 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search saved gigs or freelancers..."
              className="w-full bg-transparent px-2.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="pr-3 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 2. Category Filter (2 Cols) */}
        <div className="lg:col-span-2 relative">
          <div className="relative flex items-center rounded-2xl border border-slate-200 bg-slate-50/70 focus-within:bg-white focus-within:border-violet-600 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all">
            <select
              value={categoryFilter}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full bg-transparent px-3 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none appearance-none cursor-pointer font-medium"
            >
              {CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 text-slate-400">
              <ChevronDown className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* 3. Price Filter (2 Cols) */}
        <div className="lg:col-span-2 relative">
          <div className="relative flex items-center rounded-2xl border border-slate-200 bg-slate-50/70 focus-within:bg-white focus-within:border-violet-600 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all">
            <select
              value={priceFilter}
              onChange={(e) => onPriceChange(e.target.value)}
              className="w-full bg-transparent px-3 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none appearance-none cursor-pointer font-medium"
            >
              {PRICE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 text-slate-400">
              <ChevronDown className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* 4. Rating Filter (2 Cols) */}
        <div className="lg:col-span-2 relative">
          <div className="relative flex items-center rounded-2xl border border-slate-200 bg-slate-50/70 focus-within:bg-white focus-within:border-violet-600 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all">
            <select
              value={ratingFilter}
              onChange={(e) => onRatingChange(e.target.value)}
              className="w-full bg-transparent px-3 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none appearance-none cursor-pointer font-medium"
            >
              {RATING_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 text-slate-400">
              <ChevronDown className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* 5. Sort Dropdown (2 Cols) */}
        <div className="lg:col-span-2 relative">
          <div className="relative flex items-center rounded-2xl border border-slate-200 bg-slate-50/70 focus-within:bg-white focus-within:border-violet-600 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full bg-transparent px-3 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none appearance-none cursor-pointer font-medium"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 text-slate-400">
              <ChevronDown className="w-4 h-4" />
            </span>
          </div>
        </div>

      </div>

      {/* Filter Status Strip & Reset Button */}
      {isFiltered && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <span>
              Found <strong className="text-slate-900 font-semibold">{totalResults}</strong> matching saved {totalResults === 1 ? "gig" : "gigs"}
            </span>
          </div>

          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 font-semibold text-violet-700 hover:text-violet-900 hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
}
