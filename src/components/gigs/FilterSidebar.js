"use client";

import { useState } from "react";

export const SERVICE_TYPES = [
  { label: "Figma UI Design", count: 742 },
  { label: "Webflow Dev", count: 314 },
  { label: "Mobile App UI", count: 265 },
  { label: "Brand Identity", count: 107 },
];

export const DELIVERY_OPTIONS = [
  { value: "any", label: "Anytime" },
  { value: "24h", label: "Up to 24 hours (Rush)" },
  { value: "3d", label: "Up to 3 days" },
  { value: "7d", label: "Up to 7 days" },
];

export const BUDGET_CHIPS = [
  { label: "UNDER ₹5,000", min: 0, max: 5000 },
  { label: "₹5K - ₹15K", min: 5000, max: 15000 },
  { label: "₹15K - ₹50K", min: 15000, max: 50000 },
  { label: "₹50K+", min: 50000, max: 500000 },
];

export const SELLER_TIERS = [
  { label: "Pro Verified", badge: "PRO", count: null },
  { label: "Top Rated", badge: null, count: 389 },
  { label: "Level 2", badge: null, count: 512 },
  { label: "Rising Talent", badge: null, count: 194 },
];

export default function FilterSidebar({
  selectedServiceTypes = [],
  setSelectedServiceTypes,
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
  onApply,
  onReset,
}) {
  function toggleServiceType(st) {
    if (setSelectedServiceTypes) {
      setSelectedServiceTypes((prev) =>
        prev.includes(st) ? prev.filter((item) => item !== st) : [...prev, st]
      );
    }
  }

  function toggleTier(tier) {
    if (setSelectedTiers) {
      setSelectedTiers((prev) =>
        prev.includes(tier) ? prev.filter((item) => item !== tier) : [...prev, tier]
      );
    }
  }

  const activeCount =
    (selectedServiceTypes?.length || 0) +
    (selectedTiers?.length || 0) +
    (deliveryTime !== "any" ? 1 : 0) +
    (minBudget || maxBudget ? 1 : 0) +
    (minRating !== "0" ? 1 : 0);

  return (
    <aside aria-label="Filters" className="border border-slate-200 bg-white p-5 shadow-sm">
      {/* Filters Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
          <span>🗂 FILTERS</span>
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
            <span className="text-slate-400">[01]</span>
          </div>
          <div className="mt-3 space-y-2">
            {SERVICE_TYPES.map((st) => {
              const checked = selectedServiceTypes?.includes(st.label);
              return (
                <label
                  key={st.label}
                  className="flex cursor-pointer items-center justify-between text-xs text-slate-700 hover:text-slate-900"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleServiceType(st.label)}
                      className="h-3.5 w-3.5 rounded-none accent-[#047857]"
                    />
                    <span className={checked ? "font-semibold text-slate-900" : ""}>
                      {st.label}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400">{st.count}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* [02] DELIVERY TIME */}
        <div className="border-t border-slate-100 pt-5">
          <div className="flex items-center justify-between font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
            <span>DELIVERY TIME</span>
            <span className="text-slate-400">[02]</span>
          </div>
          <div className="mt-3 space-y-2">
            {DELIVERY_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-center gap-2 text-xs text-slate-700 hover:text-slate-900"
              >
                <input
                  type="radio"
                  name="deliveryTime"
                  value={opt.value}
                  checked={deliveryTime === opt.value}
                  onChange={(e) => setDeliveryTime && setDeliveryTime(e.target.value)}
                  className="h-3.5 w-3.5 accent-[#047857]"
                />
                <span className={deliveryTime === opt.value ? "font-semibold text-slate-900" : ""}>
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* [03] BUDGET (INR / ₹) */}
        <div className="border-t border-slate-100 pt-5">
          <div className="flex items-center justify-between font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
            <span>BUDGET (INR / ₹)</span>
            <span className="text-slate-400">[03]</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex flex-1 items-center border border-slate-200 px-2 py-1">
              <span className="font-mono text-[10px] text-slate-400 mr-1">₹</span>
              <input
                type="number"
                placeholder="MIN"
                value={minBudget}
                onChange={(e) => setMinBudget && setMinBudget(e.target.value)}
                className="w-full font-mono text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
            <span className="font-mono text-xs text-slate-400">-</span>
            <div className="flex flex-1 items-center border border-slate-200 px-2 py-1">
              <span className="font-mono text-[10px] text-slate-400 mr-1">₹</span>
              <input
                type="number"
                placeholder="MAX"
                value={maxBudget}
                onChange={(e) => setMaxBudget && setMaxBudget(e.target.value)}
                className="w-full font-mono text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Quick chips matching image */}
          <div className="mt-2.5 grid grid-cols-2 gap-1.5">
            {BUDGET_CHIPS.map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => {
                  setMinBudget && setMinBudget(chip.min);
                  setMaxBudget && setMaxBudget(chip.max === 10000 ? "" : chip.max);
                }}
                className="border border-slate-200 bg-[#FAFBFB] py-1 font-mono text-[10px] text-slate-700 hover:border-slate-300 hover:bg-white"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* [04] SELLER TIER */}
        <div className="border-t border-slate-100 pt-5">
          <div className="flex items-center justify-between font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
            <span>SELLER TIER</span>
            <span className="text-slate-400">[04]</span>
          </div>
          <div className="mt-3 space-y-2">
            {SELLER_TIERS.map((tier) => {
              const checked = selectedTiers?.includes(tier.label);
              return (
                <label
                  key={tier.label}
                  className="flex cursor-pointer items-center justify-between text-xs text-slate-700 hover:text-slate-900"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleTier(tier.label)}
                      className="h-3.5 w-3.5 rounded-none accent-[#047857]"
                    />
                    <span className={checked ? "font-semibold text-slate-900" : ""}>
                      {tier.label}
                    </span>
                  </div>
                  {tier.badge ? (
                    <span className="border border-emerald-300 bg-emerald-50 px-1 font-mono text-[9px] font-bold text-[#047857]">
                      {tier.badge}
                    </span>
                  ) : (
                    <span className="font-mono text-[11px] text-slate-400">{tier.count}</span>
                  )}
                </label>
              );
            })}
          </div>
        </div>

        {/* [05] REVIEW SCORE */}
        <div className="border-t border-slate-100 pt-5">
          <div className="flex items-center justify-between font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
            <span>REVIEW SCORE</span>
            <span className="text-slate-400">[05]</span>
          </div>
          <div className="mt-3 space-y-2">
            <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-700 hover:text-slate-900">
              <input
                type="radio"
                name="minRating"
                value="4.5"
                checked={minRating === "4.5"}
                onChange={(e) => setMinRating && setMinRating(e.target.value)}
                className="h-3.5 w-3.5 accent-[#047857]"
              />
              <span>★ 4.5 & above</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-700 hover:text-slate-900">
              <input
                type="radio"
                name="minRating"
                value="4.0"
                checked={minRating === "4.0"}
                onChange={(e) => setMinRating && setMinRating(e.target.value)}
                className="h-3.5 w-3.5 accent-[#047857]"
              />
              <span>★ 4.0 & above</span>
            </label>
          </div>
        </div>

        {/* Filter Action Buttons */}
        <div className="space-y-2 border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={onApply}
            className="w-full bg-[#047857] py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#065f46]"
          >
            APPLY FILTER STATE
          </button>
          <button
            type="button"
            onClick={onReset}
            className="w-full border border-slate-300 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-slate-700 transition hover:bg-slate-50"
          >
            RESET PARAMETERS
          </button>
        </div>
      </div>
    </aside>
  );
}
