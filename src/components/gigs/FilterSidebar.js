"use client";

export const SERVICE_TYPE_OPTIONS = [
  { key: "figma", label: "Figma UI Design", count: 742 },
  { key: "webflow", label: "Webflow Dev", count: 314 },
  { key: "mobile", label: "Mobile App UI", count: 265 },
  { key: "brand", label: "Brand Identity", count: 107 },
];

export const DELIVERY_OPTIONS = [
  { value: "any", label: "Anytime" },
  { value: "1", label: "Up to 24 hours (Rush)" },
  { value: "3", label: "Up to 3 days" },
  { value: "7", label: "Up to 7 days" },
];

export const BUDGET_CHIPS = [
  { label: "UNDER $50", min: "", max: "50" },
  { label: "$50 - $150", min: "50", max: "150" },
  { label: "$150 - $500", min: "150", max: "500" },
  { label: "$500+", min: "500", max: "" },
];

export const SELLER_TIERS = [
  { key: "pro", label: "Pro Verified", isPro: true },
  { key: "top_rated", label: "Top Rated", count: 389 },
  { key: "level2", label: "Level 2", count: 512 },
  { key: "rising", label: "Rising Talent", count: 194 },
];

export default function FilterSidebar({
  selectedServiceTypes = ["figma"],
  setSelectedServiceTypes,
  deliveryTime = "any",
  setDeliveryTime,
  minBudget = "50",
  setMinBudget,
  maxBudget = "600",
  setMaxBudget,
  selectedTiers = ["pro", "top_rated"],
  setSelectedTiers,
  minRating = "4.5",
  setMinRating,
  onApply,
  onReset,
}) {
  function toggleServiceType(key) {
    if (setSelectedServiceTypes) {
      setSelectedServiceTypes((prev) =>
        prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
      );
    }
  }

  function toggleTier(tierKey) {
    if (setSelectedTiers) {
      setSelectedTiers((prev) =>
        prev.includes(tierKey) ? prev.filter((item) => item !== tierKey) : [...prev, tierKey]
      );
    }
  }

  const activeCount =
    (selectedServiceTypes?.length || 0) +
    (deliveryTime !== "any" ? 1 : 0) +
    (selectedTiers?.length || 0) +
    (minRating && minRating !== "0" ? 1 : 0) +
    (minBudget || maxBudget ? 1 : 0);

  return (
    <aside aria-label="Filters" className="border border-[#e5e7eb] bg-white p-5 shadow-[3px_3px_0px_#0b1c30]">
      {/* Filters Header */}
      <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-base text-[#005d42]">tune</span>
          <h2 className="font-headline text-base font-bold uppercase tracking-wider text-[#0b1c30]">
            FILTERS
          </h2>
        </div>
        <span className="border border-[#e5e7eb] bg-[#eff4ff] px-2 py-0.5 font-mono text-[10px] font-bold text-[#0b1c30]">
          ACTIVE: {activeCount || 3}
        </span>
      </div>

      <div className="space-y-6 pt-4">
        {/* [01] SERVICE TYPE */}
        <div>
          <div className="flex items-center justify-between font-mono text-xs font-bold uppercase tracking-wider text-[#0b1c30]">
            <span>SERVICE TYPE</span>
            <span className="text-[#6e7a73] font-mono">[01]</span>
          </div>
          <div className="mt-3 space-y-2">
            {SERVICE_TYPE_OPTIONS.map((st) => {
              const isChecked = selectedServiceTypes?.includes(st.key);
              return (
                <label
                  key={st.key}
                  className="flex cursor-pointer items-center justify-between text-xs text-[#0b1c30] hover:text-[#005d42]"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleServiceType(st.key)}
                      className="h-3.5 w-3.5 accent-[#005d42] rounded-none"
                    />
                    <span className={isChecked ? "font-bold text-[#0b1c30]" : ""}>
                      {st.label}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-[#6e7a73]">{st.count}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* [02] DELIVERY TIME */}
        <div className="border-t border-[#e5e7eb] pt-5">
          <div className="flex items-center justify-between font-mono text-xs font-bold uppercase tracking-wider text-[#0b1c30]">
            <span>DELIVERY TIME</span>
            <span className="text-[#6e7a73] font-mono">[02]</span>
          </div>
          <div className="mt-3 space-y-2">
            {DELIVERY_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 text-xs text-[#0b1c30] hover:text-[#005d42]"
              >
                <input
                  type="radio"
                  name="deliveryTime"
                  value={opt.value}
                  checked={deliveryTime === opt.value}
                  onChange={(e) => setDeliveryTime && setDeliveryTime(e.target.value)}
                  className="h-3.5 w-3.5 accent-[#005d42]"
                />
                <span className={deliveryTime === opt.value ? "font-bold text-[#0b1c30]" : ""}>
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* [03] BUDGET (USD) */}
        <div className="border-t border-[#e5e7eb] pt-5">
          <div className="flex items-center justify-between font-mono text-xs font-bold uppercase tracking-wider text-[#0b1c30]">
            <span>BUDGET (USD)</span>
            <span className="text-[#6e7a73] font-mono">[03]</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-wider text-[#6e7a73] font-semibold mb-1">MIN</p>
              <div className="flex items-center border border-[#6e7a73] bg-white px-2 py-1.5 focus-within:border-2 focus-within:border-[#0b1c30]">
                <span className="font-mono text-xs font-bold text-[#6e7a73] mr-1">$</span>
                <input
                  type="number"
                  placeholder="50"
                  value={minBudget}
                  onChange={(e) => setMinBudget && setMinBudget(e.target.value)}
                  className="w-full font-mono text-xs text-[#0b1c30] placeholder:text-[#6e7a73] focus:outline-none"
                />
              </div>
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-wider text-[#6e7a73] font-semibold mb-1">MAX</p>
              <div className="flex items-center border border-[#6e7a73] bg-white px-2 py-1.5 focus-within:border-2 focus-within:border-[#0b1c30]">
                <span className="font-mono text-xs font-bold text-[#6e7a73] mr-1">$</span>
                <input
                  type="number"
                  placeholder="600"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget && setMaxBudget(e.target.value)}
                  className="w-full font-mono text-xs text-[#0b1c30] placeholder:text-[#6e7a73] focus:outline-none"
                />
              </div>
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
                      ? "border-[#0b1c30] bg-[#0b1c30] text-white font-bold"
                      : "border-[#e5e7eb] bg-[#eff4ff] text-[#0b1c30] hover:border-[#6e7a73] hover:bg-white"
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* [04] SELLER TIER */}
        <div className="border-t border-[#e5e7eb] pt-5">
          <div className="flex items-center justify-between font-mono text-xs font-bold uppercase tracking-wider text-[#0b1c30]">
            <span>SELLER TIER</span>
            <span className="text-[#6e7a73] font-mono">[04]</span>
          </div>
          <div className="mt-3 space-y-2">
            {SELLER_TIERS.map((tier) => {
              const checked = selectedTiers?.includes(tier.key);
              return (
                <label
                  key={tier.key}
                  className="flex cursor-pointer items-center justify-between text-xs text-[#0b1c30] hover:text-[#005d42]"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleTier(tier.key)}
                      className="h-3.5 w-3.5 accent-[#005d42] rounded-none"
                    />
                    <span className={checked ? "font-bold text-[#0b1c30]" : ""}>
                      {tier.label}
                    </span>
                  </div>
                  {tier.isPro ? (
                    <span className="border border-[#005d42] bg-[#005d42] px-1.5 py-0.2 font-mono text-[9px] font-bold text-white uppercase">
                      PRO
                    </span>
                  ) : (
                    <span className="font-mono text-[11px] text-[#6e7a73]">{tier.count}</span>
                  )}
                </label>
              );
            })}
          </div>
        </div>

        {/* [05] REVIEW SCORE */}
        <div className="border-t border-[#e5e7eb] pt-5">
          <div className="flex items-center justify-between font-mono text-xs font-bold uppercase tracking-wider text-[#0b1c30]">
            <span>REVIEW SCORE</span>
            <span className="text-[#6e7a73] font-mono">[05]</span>
          </div>
          <div className="mt-3 space-y-2">
            <label className="flex cursor-pointer items-center gap-2 text-xs text-[#0b1c30] hover:text-[#005d42]">
              <input
                type="radio"
                name="minRating"
                value="4.5"
                checked={minRating === "4.5" || !minRating}
                onChange={(e) => setMinRating && setMinRating(e.target.value)}
                className="h-3.5 w-3.5 accent-[#005d42]"
              />
              <span className="flex items-center gap-1">
                <span className="text-amber-500 font-bold">☆</span>
                <span className={minRating === "4.5" ? "font-bold text-[#0b1c30]" : ""}>
                  4.5 & above
                </span>
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-xs text-[#0b1c30] hover:text-[#005d42]">
              <input
                type="radio"
                name="minRating"
                value="4.0"
                checked={minRating === "4.0"}
                onChange={(e) => setMinRating && setMinRating(e.target.value)}
                className="h-3.5 w-3.5 accent-[#005d42]"
              />
              <span className="flex items-center gap-1">
                <span className="text-amber-500 font-bold">☆</span>
                <span className={minRating === "4.0" ? "font-bold text-[#0b1c30]" : ""}>
                  4.0 & above
                </span>
              </span>
            </label>
          </div>
        </div>

        {/* Filter Action Buttons */}
        <div className="space-y-2 border-t border-[#e5e7eb] pt-5">
          <button
            type="button"
            onClick={onApply}
            className="w-full px-5 py-2.5 bg-[#005d42] text-white border border-[#005d42] font-semibold text-xs uppercase tracking-wide hover:bg-[#047857] shadow-[2px_2px_0px_#0b1c30] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
          >
            APPLY FILTER STATE
          </button>
          <button
            type="button"
            onClick={onReset}
            className="w-full px-5 py-2.5 border border-[#0b1c30] text-[#0b1c30] font-semibold text-xs uppercase tracking-wide hover:bg-[#eff4ff] shadow-[2px_2px_0px_#0b1c30] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all bg-white"
          >
            RESET PARAMETERS
          </button>
        </div>
      </div>
    </aside>
  );
}
