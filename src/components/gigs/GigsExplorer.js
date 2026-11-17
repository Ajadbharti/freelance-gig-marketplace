"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, SlidersHorizontal, X } from "lucide-react";
import { useMarketplace } from "@/context/MarketplaceContext";
import GigCard from "@/components/gigs/GigCard";
import FilterSidebar from "@/components/gigs/FilterSidebar";

export default function GigsExplorer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { gigs, hydrated } = useMarketplace();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter states
  const [selectedServiceTypes, setSelectedServiceTypes] = useState(["Figma UI Design"]);
  const [deliveryTime, setDeliveryTime] = useState("any");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [selectedTiers, setSelectedTiers] = useState(["Pro Verified"]);
  const [minRating, setMinRating] = useState("4.5");
  const [sortMode, setSortMode] = useState("best-match");
  const [currentPage, setCurrentPage] = useState(1);

  const queryTerm = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "design-creative";

  // Active criteria chips
  const activeChips = [];
  if (selectedServiceTypes.length > 0) {
    selectedServiceTypes.forEach((st) => activeChips.push({ type: "service", label: `SKILL: ${st}` }));
  }
  if (selectedTiers.length > 0) {
    selectedTiers.forEach((tier) => activeChips.push({ type: "tier", label: `TIER: ${tier}` }));
  }
  if (minRating && minRating !== "0") {
    activeChips.push({ type: "rating", label: `RATING: ${minRating}+ & Up` });
  }

  function removeChip(chip) {
    if (chip.type === "service") {
      setSelectedServiceTypes((prev) => prev.filter((item) => `SKILL: ${item}` !== chip.label));
    } else if (chip.type === "tier") {
      setSelectedTiers((prev) => prev.filter((item) => `TIER: ${item}` !== chip.label));
    } else if (chip.type === "rating") {
      setMinRating("0");
    }
  }

  function clearAllFilters() {
    setSelectedServiceTypes([]);
    setSelectedTiers([]);
    setMinRating("0");
    setDeliveryTime("any");
    setMinBudget("");
    setMaxBudget("");
  }

  // Filtered gigs list
  const filteredGigs = useMemo(() => {
    let list = [...gigs];

    if (queryTerm) {
      const q = queryTerm.toLowerCase();
      list = list.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.skills.some((s) => s.toLowerCase().includes(q)) ||
          g.tags.some((t) => t.toLowerCase().includes(q))
      );
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
  }, [gigs, queryTerm, minBudget, maxBudget, minRating, sortMode]);

  return (
    <div className="min-h-screen bg-[#FBFBFB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Protocol Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 font-mono text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-slate-900">MARKETPLACE</Link>
            <span>/</span>
            <Link href="/gigs?category=design-creative" className="hover:text-slate-900">DESIGN & CREATIVE</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">UI/UX & WEB DESIGN</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-[#0a5c36]">
            <span className="text-[10px]">■</span>
            <span>VERIFIED CONTRACT CATALOG</span>
          </div>
        </div>

        {/* Title & Sort Bar */}
        <div className="mt-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              UI/UX & WEB DESIGN SERVICES
            </h1>
            <p className="mt-1 font-mono text-xs text-slate-600">
              Displaying <strong className="text-slate-900">1,428</strong> vetted enterprise design specs and production pipelines
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="border border-slate-200 bg-slate-50 px-2.5 py-1 uppercase text-slate-700">
              SORT
            </span>
            <select
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value)}
              className="border border-slate-200 bg-white px-3 py-1 text-slate-900 focus:outline-none"
            >
              <option value="best-match">Best Match</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Active Criteria Bar matching image */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border border-slate-200 bg-[#FAFBFB] p-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase text-slate-700">
              ACTIVE CRITERIA:
            </span>
            {activeChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => removeChip(chip)}
                className="flex items-center gap-1.5 border border-slate-300 bg-white px-2.5 py-1 font-mono text-[11px] text-slate-800 transition hover:border-slate-400"
              >
                <span>{chip.label}</span>
                <X className="h-3 w-3 text-slate-400" />
              </button>
            ))}
            {activeChips.length > 0 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="font-mono text-xs font-bold uppercase text-[#0a5c36] underline hover:text-[#084c2c]"
              >
                CLEAR ALL
              </button>
            )}
          </div>
          <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
            <span>FAST ESCROW CHECKOUT</span>
            <span className="text-[#0a5c36]">■</span>
          </div>
        </div>

        {/* Mobile filter toggle */}
        <div className="mt-4 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex w-full items-center justify-center gap-2 border border-slate-300 bg-white py-2 font-mono text-xs font-bold uppercase"
          >
            <SlidersHorizontal className="h-4 w-4" />
            {mobileFilterOpen ? "HIDE PARAMETERS" : "SHOW FILTERS"}
          </button>
        </div>

        {/* 2-Column Explorer: Left Filter Sidebar + Right Feed */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Left Filters */}
          <div className={mobileFilterOpen ? "block" : "hidden lg:block"}>
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

          {/* Right Feed */}
          <div>
            {/* Feed Status Header */}
            <div className="flex items-center justify-between border border-slate-200 bg-white px-4 py-2 font-mono text-xs text-slate-600 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#0a5c36]" />
                <span className="font-bold text-slate-900 uppercase">FEED STATUS: ESCROW ACTIVE</span>
                <span className="text-slate-400">|</span>
                <span>{filteredGigs.length} OF 1,428 CONTRACTS LOADED</span>
              </div>
              <div className="hidden sm:block text-slate-500 uppercase tracking-wider">
                GRID MODE: 3-COL BRUTALIST
              </div>
            </div>

            {/* 3-Column Brutalist Grid */}
            <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredGigs.map((gig) => (
                <GigCard key={gig.id} gig={gig} />
              ))}
            </div>

            {/* Escrow Banner matching Image 2 */}
            <div className="mt-10 border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-emerald-300 bg-emerald-50 text-[#0a5c36]">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-slate-950">
                      MILESTONE-BACKED ESCROW SYSTEM
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-600">
                      Contract payments are locked until deliverables pass technical automated checklists and code reviews.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="bg-slate-950 px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white transition hover:bg-slate-800"
                >
                  READ SECURITY PROTOCOL
                </button>
              </div>
            </div>

            {/* Pagination Bar */}
            <div className="mt-8 flex flex-col items-center justify-between gap-4 border border-slate-200 bg-white px-4 py-3 sm:flex-row shadow-sm">
              <span className="font-mono text-xs text-slate-600 uppercase">
                PAGE <strong>1</strong> OF <strong>48</strong> (1,428 ENTRIES)
              </span>
              <div className="flex items-center gap-1 font-mono text-xs">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  className="border border-slate-200 px-3 py-1 hover:bg-slate-50 disabled:opacity-30"
                >
                  &lt;
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(1)}
                  className={`border px-3 py-1 ${
                    currentPage === 1
                      ? "border-[#0a5c36] bg-[#0a5c36] font-bold text-white"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  1
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(2)}
                  className={`border px-3 py-1 ${
                    currentPage === 2
                      ? "border-[#0a5c36] bg-[#0a5c36] font-bold text-white"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  2
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage(3)}
                  className={`border px-3 py-1 ${
                    currentPage === 3
                      ? "border-[#0a5c36] bg-[#0a5c36] font-bold text-white"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  3
                </button>
                <span className="px-2 text-slate-400">...</span>
                <button
                  type="button"
                  onClick={() => setCurrentPage(48)}
                  className={`border px-3 py-1 ${
                    currentPage === 48
                      ? "border-[#0a5c36] bg-[#0a5c36] font-bold text-white"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  48
                </button>
                <button
                  type="button"
                  className="border border-slate-200 px-3 py-1 hover:bg-slate-50"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
