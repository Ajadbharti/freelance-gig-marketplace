"use client";

import { Calendar, ChevronDown, Filter, RotateCcw, Search, SlidersHorizontal } from "lucide-react";

export const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "Pending", label: "Pending" },
  { value: "In Progress", label: "In Progress" },
  { value: "Delivered", label: "Delivered" },
  { value: "Completed", label: "Completed" },
  { value: "Revision Requested", label: "Revision Requested" },
  { value: "Cancelled", label: "Cancelled" },
];

export const DATE_OPTIONS = [
  { value: "all", label: "All Time" },
  { value: "30days", label: "Last 30 Days" },
  { value: "3months", label: "Last 3 Months" },
  { value: "year", label: "This Year (2026)" },
];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "highest", label: "Highest Price" },
  { value: "lowest", label: "Lowest Price" },
];

export default function ClientOrderFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  dateFilter,
  onDateChange,
  sortBy,
  onSortChange,
  onResetFilters,
  totalResults = 0,
}) {
  const isFiltered =
    searchQuery.trim() !== "" ||
    statusFilter !== "all" ||
    dateFilter !== "all" ||
    sortBy !== "newest";

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        
        {/* 1. Search Input (5 Cols on Desktop) */}
        <div className="lg:col-span-5 relative">
          <div className="relative flex items-center rounded-2xl border border-slate-200 bg-slate-50/70 focus-within:bg-white focus-within:border-violet-600 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all">
            <span className="pl-3.5 pr-1 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by Order ID, Gig title, or Freelancer..."
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

        {/* 2. Status Dropdown (3 Cols) */}
        <div className="lg:col-span-3 relative">
          <div className="relative flex items-center rounded-2xl border border-slate-200 bg-slate-50/70 focus-within:bg-white focus-within:border-violet-600 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all">
            <span className="pl-3.5 pr-1 text-slate-400">
              <Filter className="w-4 h-4" />
            </span>
            <select
              value={statusFilter}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full bg-transparent px-2.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none appearance-none cursor-pointer font-medium"
            >
              {STATUS_OPTIONS.map((opt) => (
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

        {/* 3. Date Filter Dropdown (2 Cols) */}
        <div className="lg:col-span-2 relative">
          <div className="relative flex items-center rounded-2xl border border-slate-200 bg-slate-50/70 focus-within:bg-white focus-within:border-violet-600 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all">
            <span className="pl-3 pr-1 text-slate-400">
              <Calendar className="w-4 h-4" />
            </span>
            <select
              value={dateFilter}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full bg-transparent px-2 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none appearance-none cursor-pointer font-medium"
            >
              {DATE_OPTIONS.map((opt) => (
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

        {/* 4. Sort Dropdown (2 Cols) */}
        <div className="lg:col-span-2 relative">
          <div className="relative flex items-center rounded-2xl border border-slate-200 bg-slate-50/70 focus-within:bg-white focus-within:border-violet-600 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all">
            <span className="pl-3 pr-1 text-slate-400">
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </span>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="w-full bg-transparent px-2 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none appearance-none cursor-pointer font-medium"
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

      {/* Active Filter Indicators & Reset Row */}
      {isFiltered && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <span>Filtering active:</span>
            {searchQuery && (
              <span className="rounded-lg bg-violet-50 text-violet-700 px-2 py-0.5 font-semibold">
                &ldquo;{searchQuery}&rdquo;
              </span>
            )}
            {statusFilter !== "all" && (
              <span className="rounded-lg bg-violet-50 text-violet-700 px-2 py-0.5 font-semibold">
                Status: {statusFilter}
              </span>
            )}
            {dateFilter !== "all" && (
              <span className="rounded-lg bg-violet-50 text-violet-700 px-2 py-0.5 font-semibold">
                Date: {dateFilter}
              </span>
            )}
            {sortBy !== "newest" && (
              <span className="rounded-lg bg-violet-50 text-violet-700 px-2 py-0.5 font-semibold">
                Sort: {sortBy}
              </span>
            )}
            <span className="text-slate-400">({totalResults} matching)</span>
          </div>

          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 font-semibold text-rose-600 hover:text-rose-700 hover:underline transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
}
