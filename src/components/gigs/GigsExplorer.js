"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useMarketplace } from "@/context/MarketplaceContext";
import { categories } from "@/data/categories";
import GigCard from "@/components/gigs/GigCard";
import FilterSidebar from "@/components/gigs/FilterSidebar";

export default function GigsExplorer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { gigs, hydrated } = useMarketplace();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Read URL parameters
  const queryTerm = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [deliveryTime, setDeliveryTime] = useState("any");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [selectedTiers, setSelectedTiers] = useState([]);
  const [minRating, setMinRating] = useState("0");
  const [sellerExperience, setSellerExperience] = useState("");
  const [sortMode, setSortMode] = useState("best-match");

  // Keep selectedCategory in sync with URL category query parameter
  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  // Compute live category gig counts
  const categoryCounts = useMemo(() => {
    const counts = {};
    categories.forEach((cat) => {
      counts[cat.slug] = gigs.filter((g) => g.category === cat.slug).length;
    });
    return counts;
  }, [gigs]);

  // Active criteria chips
  const activeChips = [];
  if (queryTerm) {
    activeChips.push({ type: "q", label: `SEARCH: ${queryTerm}` });
  }
  if (selectedCategory) {
    const matched = categories.find((c) => c.slug === selectedCategory);
    activeChips.push({ type: "category", label: `CATEGORY: ${matched?.name || selectedCategory}` });
  }
  if (minBudget || maxBudget) {
    const minTxt = minBudget ? `₹${Number(minBudget).toLocaleString("en-IN")}` : "";
    const maxTxt = maxBudget ? `₹${Number(maxBudget).toLocaleString("en-IN")}` : "";
    activeChips.push({
      type: "budget",
      label: `BUDGET: ${minTxt && maxTxt ? `${minTxt} - ${maxTxt}` : minTxt ? `${minTxt}+` : `Up to ${maxTxt}`}`,
    });
  }
  if (deliveryTime && deliveryTime !== "any") {
    activeChips.push({ type: "delivery", label: `DELIVERY: ≤ ${deliveryTime} DAYS` });
  }
  if (selectedTiers.length > 0) {
    activeChips.push({ type: "tier", label: `TIER: ${selectedTiers.join(", ")}` });
  }
  if (minRating && minRating !== "0") {
    activeChips.push({ type: "rating", label: `RATING: ${minRating}★ & UP` });
  }
  if (sellerExperience) {
    activeChips.push({ type: "experience", label: `EXP: ${sellerExperience}+ YRS` });
  }

  function removeChip(chip) {
    if (chip.type === "q") {
      router.push("/gigs");
    } else if (chip.type === "category") {
      setSelectedCategory("");
      if (categoryParam) router.push("/gigs");
    } else if (chip.type === "budget") {
      setMinBudget("");
      setMaxBudget("");
    } else if (chip.type === "delivery") {
      setDeliveryTime("any");
    } else if (chip.type === "tier") {
      setSelectedTiers([]);
    } else if (chip.type === "rating") {
      setMinRating("0");
    } else if (chip.type === "experience") {
      setSellerExperience("");
    }
  }

  function clearAllFilters() {
    setSelectedCategory("");
    setDeliveryTime("any");
    setMinBudget("");
    setMaxBudget("");
    setSelectedTiers([]);
    setMinRating("0");
    setSellerExperience("");
    if (queryTerm || categoryParam) {
      router.push("/gigs");
    }
  }

  // Filtered gigs calculation
  const filteredGigs = useMemo(() => {
    let list = [...gigs];

    if (queryTerm) {
      const q = queryTerm.toLowerCase();
      list = list.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.skills?.some((s) => s.toLowerCase().includes(q)) ||
          g.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (selectedCategory) {
      list = list.filter((g) => g.category === selectedCategory);
    }

    if (deliveryTime && deliveryTime !== "any") {
      const maxDays = Number(deliveryTime);
      list = list.filter((g) => (g.deliveryDays || 1) <= maxDays);
    }

    if (minBudget) {
      list = list.filter((g) => g.price >= Number(minBudget));
    }
    if (maxBudget) {
      list = list.filter((g) => g.price <= Number(maxBudget));
    }

    if (minRating && minRating !== "0") {
      list = list.filter((g) => (g.rating || 5.0) >= Number(minRating));
    }

    if (sortMode === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortMode === "price-high") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortMode === "rating") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return list;
  }, [gigs, queryTerm, selectedCategory, deliveryTime, minBudget, maxBudget, minRating, sortMode]);

  const currentCategoryObj = categories.find((c) => c.slug === selectedCategory);
  const pageTitle = currentCategoryObj
    ? currentCategoryObj.name
    : queryTerm
    ? `RESULTS FOR "${queryTerm}"`
    : "ALL SERVICES";

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      {/* Top Header Section */}
      <section className="w-full border-b border-slate-300 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <nav className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-slate-500">
            <Link href="/gigs" className="hover:text-[#047857]">
              MARKETPLACE
            </Link>
            {currentCategoryObj && (
              <>
                <span className="text-slate-300">/</span>
                <span className="font-bold text-slate-900">{currentCategoryObj.name}</span>
              </>
            )}
          </nav>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              {/* Published Gig Catalog Badge */}
              <div className="mb-2 inline-flex items-center gap-1.5 bg-[#eff4ff] px-2 py-0.5">
                <span className="h-1.5 w-1.5 bg-[#005d42]" />
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-900">
                  PUBLISHED GIG CATALOG
                </span>
              </div>

              {/* Title */}
              <h1 className="font-headline text-3xl font-bold uppercase tracking-tight text-slate-950 sm:text-4xl">
                {pageTitle}
              </h1>

              {/* Subtext Count */}
              <p className="mt-1 font-sans text-sm text-slate-600">
                Displaying{" "}
                <strong className="font-bold text-slate-950">{filteredGigs.length}</strong>{" "}
                published {filteredGigs.length === 1 ? "gig" : "gigs"}
              </p>
            </div>

            {/* Brutalist Sort Box */}
            <div className="flex items-center self-start border border-slate-900 bg-white md:self-auto">
              <label
                htmlFor="sortSelect"
                className="border-r border-slate-900 bg-[#eff4ff] px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-slate-900"
              >
                SORT
              </label>
              <div className="relative">
                <select
                  id="sortSelect"
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value)}
                  className="cursor-pointer appearance-none bg-white py-1.5 pl-3 pr-8 font-mono text-xs font-semibold text-slate-900 focus:outline-none"
                >
                  <option value="best-match">Best Match</option>
                  <option value="rating">Highest Rated</option>
                  <option value="popular">Most Orders</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-2 h-3.5 w-3.5 text-slate-700" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Active Criteria Chips (only when filters applied) */}
      {activeChips.length > 0 && (
        <section className="w-full border-b border-slate-300 bg-[#eff4ff] py-2.5">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 sm:px-6">
            <span className="mr-1 font-mono text-xs font-bold uppercase tracking-wider text-slate-600">
              ACTIVE CRITERIA:
            </span>
            {activeChips.map((chip, idx) => (
              <div
                key={idx}
                className="inline-flex items-center border border-slate-900 bg-white px-2 py-0.5 shadow-[2px_2px_0px_#0b1c30]"
              >
                <span className="mr-1.5 font-mono text-[11px] font-bold text-slate-900">
                  {chip.label}
                </span>
                <button
                  type="button"
                  aria-label={`Remove ${chip.label}`}
                  onClick={() => removeChip(chip)}
                  className="flex items-center text-slate-600 hover:text-rose-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={clearAllFilters}
              className="ml-2 font-mono text-xs font-bold uppercase text-[#047857] underline hover:text-[#065f46]"
            >
              CLEAR ALL
            </button>
          </div>
        </section>
      )}

      {/* Body: 2 Columns (Filter Sidebar + Feed Grid) */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Mobile filter toggle */}
        <div className="mb-4 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex w-full items-center justify-center gap-2 border border-slate-900 bg-white py-2 font-mono text-xs font-bold uppercase"
          >
            <SlidersHorizontal className="h-4 w-4 text-[#047857]" />
            {mobileFilterOpen ? "HIDE FILTERS" : "SHOW FILTERS"}
          </button>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Left Column: Filter Sidebar */}
          <div className={`lg:col-span-3 ${mobileFilterOpen ? "block" : "hidden lg:block"}`}>
            <FilterSidebar
              selectedCategory={selectedCategory}
              setSelectedCategory={(slug) => {
                setSelectedCategory(slug);
                if (slug) {
                  router.push(`/gigs?category=${slug}`);
                } else {
                  router.push("/gigs");
                }
              }}
              categoryCounts={categoryCounts}
              deliveryTime={deliveryTime}
              setDeliveryTime={setDeliveryTime}
              minBudget={minBudget}
              setMinBudget={setMinBudget}
              maxBudget={maxBudget}
              setMaxBudget={setMaxBudget}
              selectedTiers={selectedTiers}
              setSelectedTiers={setSelectedTiers}
              minRating={minRating}
              setMinRating={setMinRating}
              sellerExperience={sellerExperience}
              setSellerExperience={setSellerExperience}
              onApply={() => setMobileFilterOpen(false)}
              onReset={clearAllFilters}
            />
          </div>

          {/* Right Column: Feed Grid */}
          <div className="lg:col-span-9">
            {/* Feed Status Header matching screenshot */}
            <div className="mb-4 flex items-center justify-between border border-slate-300 bg-white px-3 py-2">
              <div className="flex items-center gap-2 font-mono text-xs text-slate-900">
                <span className="h-2 w-2 bg-[#047857]" />
                <span>
                  FEED STATUS: <strong>LIVE</strong>
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 uppercase">
                  {filteredGigs.length} OF {gigs.length} GIGS LOADED
                </span>
              </div>
            </div>

            {/* Empty State */}
            {filteredGigs.length === 0 ? (
              <div className="border border-slate-300 bg-white p-12 text-center">
                <h3 className="font-headline text-lg font-bold uppercase text-slate-950">
                  NO GIGS MATCH THESE CRITERIA
                </h3>
                <p className="mt-1 font-sans text-sm text-slate-600">
                  Try adjusting or clearing your filters to see more results.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-4 border border-slate-900 bg-[#047857] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white hover:bg-[#065f46]"
                >
                  CLEAR ALL FILTERS
                </button>
              </div>
            ) : (
              /* 3-Column Brutalist Gig Grid */
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredGigs.map((gig) => (
                  <GigCard key={gig.id} gig={gig} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
