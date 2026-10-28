"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SearchX, SlidersHorizontal } from "lucide-react";
import { categories } from "@/data/categories";
import { useMarketplace } from "@/context/MarketplaceContext";
import GigCard from "@/components/gigs/GigCard";
import FilterSidebar, { PRICE_RANGES, RATING_OPTIONS, SORT_OPTIONS } from "@/components/gigs/FilterSidebar";
import { GigGridSkeleton } from "@/components/ui/LoadingSkeleton";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 9;
const DEFAULTS = { q: "", category: "", price: "any", rating: "0", sort: "newest" };

function SearchInput({ initial, onSubmit }) {
  const [value, setValue] = useState(initial);

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value.trim());
      }}
      className="flex w-full max-w-xl items-center overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100"
    >
      <Search className="ml-3 h-4 w-4 shrink-0 text-slate-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search by title, skill or freelancer name"
        aria-label="Search gigs"
        className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
      />
      <button
        type="submit"
        className="m-1 rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        Search
      </button>
    </form>
  );
}

function ResultsGrid({ items, onClear }) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const shown = items.slice(0, visible);
  const remaining = items.length - shown.length;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <SearchX className="h-12 w-12 text-slate-300" />
        <h3 className="mt-4 text-lg font-semibold text-slate-900">No gigs match your search</h3>
        <p className="mt-2 max-w-sm text-sm text-slate-600">
          Try a different keyword, or remove some filters to see more results.
        </p>
        <button
          type="button"
          onClick={onClear}
          className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Clear filters
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((gig) => (
          <GigCard key={gig.id} gig={gig} />
        ))}
      </div>
      {remaining > 0 && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            Show more ({remaining} left)
          </button>
        </div>
      )}
    </>
  );
}

export default function GigsExplorer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { gigs, hydrated, getFreelancer, getGigRating } = useMarketplace();
  const [filtersOpen, setFiltersOpen] = useState(false);

  // URL se values lo (galat values ko default par laa do)
  const q = searchParams.get("q") ?? "";
  const rawCategory = searchParams.get("category") ?? "";
  const category = categories.some((c) => c.slug === rawCategory) ? rawCategory : "";
  const rawPrice = searchParams.get("price") ?? "any";
  const price = PRICE_RANGES.some((r) => r.value === rawPrice) ? rawPrice : "any";
  const rawRating = searchParams.get("rating") ?? "0";
  const rating = RATING_OPTIONS.some((r) => r.value === rawRating) ? rawRating : "0";
  const rawSort = searchParams.get("sort") ?? "newest";
  const sort = SORT_OPTIONS.some((s) => s.value === rawSort) ? rawSort : "newest";

  const hasActiveFilters = Boolean(q) || Boolean(category) || price !== "any" || rating !== "0";

  function setParams(updates) {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === DEFAULTS[key]) next.delete(key);
      else next.set(key, value);
    });
    const qs = next.toString();
    router.replace(qs ? `/gigs?${qs}` : "/gigs", { scroll: false });
  }

  function clearAll() {
    router.replace("/gigs", { scroll: false });
  }

  const results = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const range = PRICE_RANGES.find((r) => r.value === price) ?? PRICE_RANGES[0];
    const minRating = Number(rating);

    const items = gigs
      .map((gig) => ({
        gig,
        freelancer: getFreelancer(gig.freelancerId),
        rating: getGigRating(gig.id),
      }))
      .filter(({ gig, freelancer, rating: r }) => {
        if (category && gig.category !== category) return false;
        if (gig.price < range.min || gig.price >= range.max) return false;
        if (minRating > 0 && r.average < minRating) return false;
        if (words.length > 0) {
          const categoryName = categories.find((c) => c.slug === gig.category)?.name ?? "";
          const haystack = [gig.title, ...gig.skills, ...gig.tags, freelancer?.name ?? "", categoryName]
            .join(" ")
            .toLowerCase();
          if (!words.every((word) => haystack.includes(word))) return false;
        }
        return true;
      });

    items.sort((a, b) => {
      if (sort === "price-asc") return a.gig.price - b.gig.price;
      if (sort === "price-desc") return b.gig.price - a.gig.price;
      if (sort === "rating") {
        return b.rating.average - a.rating.average || b.rating.count - a.rating.count;
      }
      return new Date(b.gig.createdAt) - new Date(a.gig.createdAt);
    });

    return items.map((item) => item.gig);
  }, [gigs, q, category, price, rating, sort, getFreelancer, getGigRating]);

  const activeCategory = categories.find((c) => c.slug === category);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          {activeCategory ? activeCategory.name : "Explore gigs"}
        </h1>
        <p className="mt-2 text-slate-600">
          {activeCategory ? activeCategory.description : "Search, filter and sort to find the perfect service."}
        </p>
        <div className="mt-5">
          <SearchInput key={q} initial={q} onSubmit={(value) => setParams({ q: value })} />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <div>
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            aria-expanded={filtersOpen}
            className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {filtersOpen ? "Hide filters" : "Show filters"}
          </button>
          <div className={cn(filtersOpen ? "block" : "hidden", "lg:block")}>
            <FilterSidebar
              category={category}
              price={price}
              rating={rating}
              hasActiveFilters={hasActiveFilters}
              onChange={(key, value) => setParams({ [key]: value })}
              onClear={clearAll}
            />
          </div>
        </div>

        <section aria-live="polite">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-600">
              {hydrated ? (
                <>
                  <strong className="text-slate-900">{results.length}</strong>{" "}
                  {results.length === 1 ? "gig" : "gigs"} found
                  {q && <> for “{q}”</>}
                </>
              ) : (
                "Loading gigs…"
              )}
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-slate-600">
                Sort by
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setParams({ sort: e.target.value })}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {hydrated ? (
            <ResultsGrid key={searchParams.toString()} items={results} onClear={clearAll} />
          ) : (
            <GigGridSkeleton count={6} />
          )}
        </section>
      </div>
    </div>
  );
}