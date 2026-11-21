"use client";

import { categories } from "@/data/categories";

export const DELIVERY_OPTIONS = [
  { value: "any", label: "Anytime" },
  { value: "1", label: "Up to 24 hours (Rush)" },
  { value: "3", label: "Up to 3 days" },
  { value: "7", label: "Up to 7 days" },
];

export const BUDGET_CHIPS = [
  { label: "Under ₹1,000", min: "", max: "1000" },
  { label: "₹1,000 - ₹5,000", min: "1000", max: "5000" },
  { label: "₹5,000 - ₹20,000", min: "5000", max: "20000" },
  { label: "₹20,000+", min: "20000", max: "" },
];

export const SELLER_TIERS = [
  { key: "top_rated", label: "Top Rated" },
  { key: "pro", label: "Pro Verified" },
  { key: "level2", label: "Level 2" },
  { key: "rising", label: "Rising Talent" },
];

export default function FilterSidebar({
  selectedCategory = "",
  setSelectedCategory,
  categoryCounts = {},
  deliveryTime = "any",
  setDeliveryTime,
  minBudget = "",
  setMinBudget,
  maxBudget = "",
  setMaxBudget,
  selectedTiers = [],
  setSelectedTiers,
  minRating = "0",
  setMinRating,
  sellerExperience = "",
  setSellerExperience,
  onApply,
  onReset,
}) {
  function toggleTier(tierKey) {
    if (setSelectedTiers) {
      setSelectedTiers((prev) =>
        prev.includes(tierKey) ? prev.filter((item) => item !== tierKey) : [...prev, tierKey]
      );
    }
  }

  const activeCount =
    (selectedCategory ? 1 : 0) +
    (deliveryTime !== "any" ? 1 : 0) +
    (selectedTiers?.length || 0) +
    (minRating !== "0" && minRating ? 1 : 0) +
    (minBudget || maxBudget ? 1 : 0) +
    (sellerExperience ? 1 : 0);

  return (
    <aside aria-label="Filters" className="border border-slate-300 bg-white p-5">
      {/* Filters Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-base text-[#047857]">tune</span>
          <h2 className="font-headline text-base font-bold uppercase tracking-wider text-slate-950">
            FILTERS
          </h2>
        </div>
        <span className="border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700">
          ACTIVE: {activeCount}
        </span>
      </div>

      <div className="space-y-6 pt-4">
        {/* [01] SERVICE TYPE */}
        <div>
          <div className="flex items-center justify-between font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
            <span>SERVICE TYPE</span>
            <span className="text-slate-400 font-mono">[01]</span>
          </div>
          <div className="mt-3 space-y-2">
            <label className="flex cursor-pointer items-center justify-between text-xs text-slate-800 hover:text-[#047857]">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="serviceType"
                  value=""
                  checked={selectedCategory === ""}
                  onChange={() => setSelectedCategory && setSelectedCategory("")}
                  className="h-3.5 w-3.5 accent-[#047857]"
                />
                <span className={selectedCategory === "" ? "font-bold text-slate-950" : ""}>
                  All services
                </span>
              </div>
            </label>

            {categories.map((cat) => {
              const count = categoryCounts[cat.slug] ?? 0;
              const isChecked = selectedCategory === cat.slug;
              return (
                <label
                  key={cat.slug}
                  className="flex cursor-pointer items-center justify-between text-xs text-slate-800 hover:text-[#047857]"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="serviceType"
                      value={cat.slug}
                      checked={isChecked}
                      onChange={() => setSelectedCategory && setSelectedCategory(cat.slug)}
                      className="h-3.5 w-3.5 accent-[#047857]"
                    />
                    <span className={isChecked ? "font-bold text-slate-950" : ""}>
                      {cat.name}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">{count}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* [02] DELIVERY TIME */}
        <div className="border-t border-slate-200 pt-5">
          <div className="flex items-center justify-between font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
            <span>DELIVERY TIME</span>
            <span className="text-slate-400 font-mono">[02]</span>
          </div>
          <div className="mt-3 space-y-2">
            {DELIVERY_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 text-xs text-slate-800 hover:text-[#047857]"
              >
                <input
                  type="radio"
                  name="deliveryTime"
                  value={opt.value}
                  checked={deliveryTime === opt.value}
                  onChange={(e) => setDeliveryTime && setDeliveryTime(e.target.value)}
                  className="h-3.5 w-3.5 accent-[#047857]"
                />
                <span className={deliveryTime === opt.value ? "font-bold text-slate-950" : ""}>
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* [03] BUDGET (INR / ₹) */}
        <div className="border-t border-slate-200 pt-5">
          <div className="flex items-center justify-between font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
            <span>BUDGET (₹ INR)</span>
            <span className="text-slate-400 font-mono">[03]</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex flex-1 items-center border border-slate-300 bg-white px-2 py-1">
              <span className="font-mono text-xs font-bold text-slate-500 mr-1">₹</span>
              <input
                type="number"
                placeholder="MIN"
                value={minBudget}
                onChange={(e) => setMinBudget && setMinBudget(e.target.value)}
                className="w-full font-mono text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
            <span className="font-mono text-xs text-slate-400">-</span>
            <div className="flex flex-1 items-center border border-slate-300 bg-white px-2 py-1">
              <span className="font-mono text-xs font-bold text-slate-500 mr-1">₹</span>
              <input
                type="number"
                placeholder="MAX"
                value={maxBudget}
                onChange={(e) => setMaxBudget && setMaxBudget(e.target.value)}
                className="w-full font-mono text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Quick chips */}
          <div className="mt-2.5 grid grid-cols-2 gap-1.5">
            {BUDGET_CHIPS.map((chip) => {
              const active = minBudget === chip.min && maxBudget === chip.max;
              return (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => {
                    setMinBudget && setMinBudget(chip.min);
                    setMaxBudget && setMaxBudget(chip.max);
                  }}
                  className={`border py-1 font-mono text-[10px] uppercase transition ${
                    active
                      ? "border-slate-950 bg-slate-950 text-white font-bold"
                      : "border-slate-200 bg-[#FAFBFB] text-slate-700 hover:border-slate-300 hover:bg-white"
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* [04] SELLER TIER */}
        <div className="border-t border-slate-200 pt-5">
          <div className="flex items-center justify-between font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
            <span>SELLER TIER</span>
            <span className="text-slate-400 font-mono">[04]</span>
          </div>
          <div className="mt-3 space-y-2">
            {SELLER_TIERS.map((tier) => {
              const checked = selectedTiers?.includes(tier.key);
              return (
                <label
                  key={tier.key}
                  className="flex cursor-pointer items-center justify-between text-xs text-slate-800 hover:text-[#047857]"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleTier(tier.key)}
                      className="h-3.5 w-3.5 accent-[#047857]"
                    />
                    <span className={checked ? "font-bold text-slate-950" : ""}>
                      {tier.label}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* [05] REVIEW SCORE */}
        <div className="border-t border-slate-200 pt-5">
          <div className="flex items-center justify-between font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
            <span>REVIEW SCORE</span>
            <span className="text-slate-400 font-mono">[05]</span>
          </div>
          <div className="mt-3 space-y-2">
            <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-800 hover:text-[#047857]">
              <input
                type="radio"
                name="minRating"
                value="0"
                checked={minRating === "0" || !minRating}
                onChange={() => setMinRating && setMinRating("0")}
                className="h-3.5 w-3.5 accent-[#047857]"
              />
              <span>Any rating</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-800 hover:text-[#047857]">
              <input
                type="radio"
                name="minRating"
                value="4.5"
                checked={minRating === "4.5"}
                onChange={(e) => setMinRating && setMinRating(e.target.value)}
                className="h-3.5 w-3.5 accent-[#047857]"
              />
              <span className="flex items-center gap-1">
                <span className="text-amber-500">★</span> 4.5 & above
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-800 hover:text-[#047857]">
              <input
                type="radio"
                name="minRating"
                value="4.0"
                checked={minRating === "4.0"}
                onChange={(e) => setMinRating && setMinRating(e.target.value)}
                className="h-3.5 w-3.5 accent-[#047857]"
              />
              <span className="flex items-center gap-1">
                <span className="text-amber-500">★</span> 4.0 & above
              </span>
            </label>
          </div>
        </div>

        {/* [06] SELLER EXPERIENCE */}
        <div className="border-t border-slate-200 pt-5">
          <div className="flex items-center justify-between font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
            <span>SELLER EXPERIENCE</span>
            <span className="text-slate-400 font-mono">[06]</span>
          </div>
          <div className="mt-3 space-y-2">
            {[
              ["", "Any experience"],
              ["2", "2+ years"],
              ["5", "5+ years"],
              ["8", "8+ years"],
            ].map(([val, label]) => (
              <label
                key={val}
                className="flex cursor-pointer items-center gap-2 text-xs text-slate-800 hover:text-[#047857]"
              >
                <input
                  type="radio"
                  name="sellerExperience"
                  value={val}
                  checked={(sellerExperience || "") === val}
                  onChange={() => setSellerExperience && setSellerExperience(val)}
                  className="h-3.5 w-3.5 accent-[#047857]"
                />
                <span className={(sellerExperience || "") === val ? "font-bold text-slate-950" : ""}>
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Filter Action Buttons */}
        <div className="space-y-2 border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={onApply}
            className="w-full bg-[#047857] py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-[2px_2px_0px_#0b1c30] transition hover:bg-[#065f46]"
          >
            APPLY FILTER STATE
          </button>
          <button
            type="button"
            onClick={onReset}
            className="w-full border border-slate-900 bg-white py-2 font-mono text-xs font-bold uppercase tracking-wider text-slate-900 transition hover:bg-slate-50"
          >
            RESET PARAMETERS
          </button>
        </div>
      </div>
    </aside>
  );
}
