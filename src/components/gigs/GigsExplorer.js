"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useMarketplace } from "@/context/MarketplaceContext";
import GigCard from "@/components/gigs/GigCard";
import FilterSidebar from "@/components/gigs/FilterSidebar";

export default function GigsExplorer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { gigs } = useMarketplace();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Read URL parameters
  const queryTerm = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";

  // Filter states matching screenshot defaults
  const [selectedServiceTypes, setSelectedServiceTypes] = useState(["figma"]);
  const [deliveryTime, setDeliveryTime] = useState("any");
  const [minBudget, setMinBudget] = useState("50");
  const [maxBudget, setMaxBudget] = useState("600");
  const [selectedTiers, setSelectedTiers] = useState(["pro", "top_rated"]);
  const [minRating, setMinRating] = useState("4.5");
  const [sortMode, setSortMode] = useState("best-match");

  // Active criteria chips matching screenshot
  const activeChips = useMemo(() => {
    const chips = [];
    if (selectedServiceTypes.includes("figma")) {
      chips.push({ id: "st-figma", label: "SKILL: Figma UI" });
    }
    if (selectedTiers.includes("pro")) {
      chips.push({ id: "tier-pro", label: "TIER: Pro Verified" });
    }
    if (minRating === "4.5") {
      chips.push({ id: "rating-4.5", label: "RATING: 4.5★ & Up" });
    }
    if (queryTerm) {
      chips.push({ id: "q", label: `SEARCH: ${queryTerm}` });
    }
    return chips;
  }, [selectedServiceTypes, selectedTiers, minRating, queryTerm]);

  function removeChip(id) {
    if (id === "st-figma") {
      setSelectedServiceTypes((prev) => prev.filter((k) => k !== "figma"));
    } else if (id === "tier-pro") {
      setSelectedTiers((prev) => prev.filter((k) => k !== "pro"));
    } else if (id === "rating-4.5") {
      setMinRating("0");
    } else if (id === "q") {
      router.push("/gigs");
    }
  }

  function clearAllFilters() {
    setSelectedServiceTypes([]);
    setDeliveryTime("any");
    setMinBudget("");
    setMaxBudget("");
    setSelectedTiers([]);
    setMinRating("0");
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

    if (sortMode === "price-low") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortMode === "price-high") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortMode === "rating") {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    // Default to the 6 spec cards from image if no specific aggressive filter is active
    return list;
  }, [gigs, queryTerm, deliveryTime, minBudget, maxBudget, sortMode]);

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      {/* Top Header Section matching screenshot */}
      <section className="w-full border-b border-[#e5e7eb] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          {/* Breadcrumb */}
          <nav className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-[#6e7a73]">
            <Link href="/gigs" className="hover:text-[#005d42]">
              MARKETPLACE
            </Link>
            <span className="text-[#6e7a73]/50">/</span>
            <Link href="/gigs?category=graphics-design" className="hover:text-[#005d42]">
              DESIGN & CREATIVE
            </Link>
            <span className="text-[#6e7a73]/50">/</span>
            <span className="font-bold text-[#0b1c30]">UI/UX & WEB DESIGN</span>
          </nav>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              {/* Verified Contract Catalog Badge */}
              <div className="mb-2 flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-[#0047bf]">
                <span className="h-2 w-2 bg-[#0047bf]" />
                <span>VERIFIED CONTRACT CATALOG</span>
              </div>

              {/* Title */}
              <h1 className="font-headline text-3xl font-bold uppercase tracking-tight text-[#0b1c30] sm:text-4xl">
                UI/UX & WEB DESIGN SERVICES
              </h1>

              {/* Subtitle */}
              <p className="mt-1 font-sans text-xs text-[#3e4943]">
                Displaying 1,428 vetted enterprise design specs and production pipelines
              </p>
            </div>

            {/* Brutalist Sort Box */}
            <div className="flex items-center self-start border border-[#0b1c30] bg-white md:self-auto">
              <label
                htmlFor="sortSelect"
                className="border-r border-[#0b1c30] bg-[#eff4ff] px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-[#0b1c30]"
              >
                SORT
              </label>
              <div className="relative">
                <select
                  id="sortSelect"
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value)}
                  className="cursor-pointer appearance-none bg-white py-1.5 pl-3 pr-8 font-mono text-xs font-semibold text-[#0b1c30] focus:outline-none"
                >
                  <option value="best-match">Best Match</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-2 h-3.5 w-3.5 text-[#565e74]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Active Criteria Bar matching screenshot */}
      <section className="w-full border-b border-[#e5e7eb] bg-white py-2.5">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#3e4943]">
              ACTIVE CRITERIA:
            </span>
            {activeChips.map((chip) => (
              <div
                key={chip.id}
                className="inline-flex items-center border border-[#0b1c30] bg-white px-2 py-0.5 shadow-[2px_2px_0px_#0b1c30]"
              >
                <span className="mr-1.5 font-mono text-[11px] font-bold text-[#0b1c30]">
                  {chip.label}
                </span>
                <button
                  type="button"
                  aria-label={`Remove ${chip.label}`}
                  onClick={() => removeChip(chip.id)}
                  className="flex items-center text-[#565e74] hover:text-[#ba1a1a]"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={clearAllFilters}
              className="ml-2 font-mono text-[11px] font-bold uppercase text-[#0b1c30] underline hover:text-[#005d42]"
            >
              CLEAR ALL
            </button>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-[#005d42]">
            <span>FAST ESCROW CHECKOUT</span>
            <span className="h-2 w-2 bg-[#005d42]" />
          </div>
        </div>
      </section>

      {/* Body Section: Filters Sidebar + 3-Col Feed Grid */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Mobile filter toggle */}
        <div className="mb-4 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex w-full items-center justify-center gap-2 border border-[#0b1c30] bg-white py-2 font-mono text-xs font-bold uppercase text-[#0b1c30] shadow-[2px_2px_0px_#0b1c30]"
          >
            <SlidersHorizontal className="h-4 w-4 text-[#005d42]" />
            {mobileFilterOpen ? "HIDE FILTERS" : "SHOW FILTERS"}
          </button>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Left Column: Filter Sidebar (col-span-3) */}
          <div className={`lg:col-span-3 ${mobileFilterOpen ? "block" : "hidden lg:block"}`}>
            <FilterSidebar
              selectedServiceTypes={selectedServiceTypes}
              setSelectedServiceTypes={setSelectedServiceTypes}
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
              onApply={() => setMobileFilterOpen(false)}
              onReset={clearAllFilters}
            />
          </div>

          {/* Right Column: Feed Grid (col-span-9) */}
          <div className="lg:col-span-9">
            {/* Feed Status Header matching screenshot */}
            <div className="mb-4 flex items-center justify-between border border-[#e5e7eb] bg-white px-3 py-2 shadow-[2px_2px_0px_#0b1c30]">
              <div className="flex items-center gap-2 font-mono text-xs text-[#0b1c30]">
                <span className="h-2 w-2 bg-[#005d42]" />
                <span className="font-bold">FEED STATUS: ESCROW ACTIVE</span>
                <span className="text-[#6e7a73]/40">|</span>
                <span className="text-[#565e74] uppercase">
                  6 OF 1,428 CONTRACTS LOADED
                </span>
              </div>
              <span className="hidden sm:inline font-mono text-xs font-semibold uppercase text-[#6e7a73]">
                GRID MODE: 3-COL BRUTALIST
              </span>
            </div>

            {/* Empty State */}
            {filteredGigs.length === 0 ? (
              <div className="border border-[#e5e7eb] bg-white p-12 text-center shadow-[3px_3px_0px_#0b1c30]">
                <h3 className="font-headline text-lg font-bold uppercase text-[#0b1c30]">
                  NO GIGS MATCH THESE CRITERIA
                </h3>
                <p className="mt-1 font-sans text-sm text-[#3e4943]">
                  Try adjusting or clearing your filters to see more results.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-4 px-5 py-2.5 bg-[#005d42] text-white border border-[#005d42] font-semibold text-xs uppercase tracking-wide hover:bg-[#047857] shadow-[2px_2px_0px_#0b1c30] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                >
                  CLEAR ALL FILTERS
                </button>
              </div>
            ) : (
              /* 3-Column Brutalist Gig Grid matching screenshot */
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredGigs.map((gig) => (
                  <GigCard key={gig.id} gig={gig} />
                ))}
              </div>
            )}

            {/* Protocol Banner Below Grid matching screenshot */}
            <div className="mt-8 flex flex-col md:flex-row items-center justify-between border border-[#e5e7eb] bg-white p-5 shadow-[3px_3px_0px_#0b1c30] gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#005d42] text-white shadow-[2px_2px_0px_#0b1c30]">
                  <span className="material-symbols-outlined text-2xl">verified_user</span>
                </div>
                <div>
                  <h3 className="font-headline text-sm font-bold uppercase tracking-wider text-[#0b1c30]">
                    MILESTONE-BACKED ESCROW SYSTEM
                  </h3>
                  <p className="text-xs text-[#3e4943] mt-0.5">
                    Contract payments are locked until deliverables pass technical automated checklists and code reviews.
                  </p>
                </div>
              </div>
              <Link
                href="/#escrow"
                className="shrink-0 px-4 py-2 bg-[#0b1c30] text-white font-mono text-xs font-bold uppercase tracking-wide hover:bg-[#1a2e45] shadow-[2px_2px_0px_#0b1c30] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
              >
                READ SECURITY PROTOCOL
              </Link>
            </div>

            {/* Pagination Footer matching screenshot */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between border-t border-[#e5e7eb] pt-6 font-mono text-xs">
              <span className="font-mono text-xs uppercase tracking-wider text-[#0b1c30] font-bold">
                PAGE 1 OF 48 (1,428 ENTRIES)
              </span>
              <div className="flex items-center gap-1.5 mt-3 sm:mt-0">
                <button
                  type="button"
                  aria-label="Previous Page"
                  className="h-8 w-8 border border-[#0b1c30] bg-white text-[#0b1c30] flex items-center justify-center font-bold hover:bg-[#eff4ff]"
                >
                  &lt;
                </button>
                <button
                  type="button"
                  className="h-8 w-8 bg-[#005d42] text-white flex items-center justify-center font-bold shadow-[1px_1px_0px_#0b1c30]"
                >
                  1
                </button>
                <button
                  type="button"
                  className="h-8 w-8 border border-[#e5e7eb] bg-white text-[#0b1c30] flex items-center justify-center font-bold hover:bg-[#eff4ff]"
                >
                  2
                </button>
                <button
                  type="button"
                  className="h-8 w-8 border border-[#e5e7eb] bg-white text-[#0b1c30] flex items-center justify-center font-bold hover:bg-[#eff4ff]"
                >
                  3
                </button>
                <span className="px-1 text-[#6e7a73]">...</span>
                <button
                  type="button"
                  className="h-8 w-8 border border-[#e5e7eb] bg-white text-[#0b1c30] flex items-center justify-center font-bold hover:bg-[#eff4ff]"
                >
                  48
                </button>
                <button
                  type="button"
                  aria-label="Next Page"
                  className="h-8 w-8 border border-[#0b1c30] bg-white text-[#0b1c30] flex items-center justify-center font-bold hover:bg-[#eff4ff]"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
