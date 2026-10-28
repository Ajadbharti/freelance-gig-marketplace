"use client";

import { categories } from "@/data/categories";

export const PRICE_RANGES = [
  { value: "any", label: "Any price", min: 0, max: Infinity },
  { value: "0-100", label: "Under $100", min: 0, max: 100 },
  { value: "100-200", label: "$100 – $199", min: 100, max: 200 },
  { value: "200-400", label: "$200 – $399", min: 200, max: 400 },
  { value: "400-up", label: "$400 and above", min: 400, max: Infinity },
];

export const RATING_OPTIONS = [
  { value: "0", label: "Any rating" },
  { value: "4", label: "4.0 & up" },
  { value: "4.5", label: "4.5 & up" },
];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Highest rated" },
];

function RadioGroup({ legend, name, options, value, onChange }) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-semibold text-slate-900">{legend}</legend>
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="h-4 w-4 accent-indigo-600"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function FilterSidebar({ category, price, rating, onChange, onClear, hasActiveFilters }) {
  const categoryOptions = [
    { value: "", label: "All categories" },
    ...categories.map((c) => ({ value: c.slug, label: c.name })),
  ];

  return (
    <aside
      aria-label="Filters"
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">Filters</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
          >
            Clear all
          </button>
        )}
      </div>

      <RadioGroup
        legend="Category"
        name="category"
        options={categoryOptions}
        value={category}
        onChange={(v) => onChange("category", v)}
      />
      <RadioGroup
        legend="Price"
        name="price"
        options={PRICE_RANGES}
        value={price}
        onChange={(v) => onChange("price", v)}
      />
      <RadioGroup
        legend="Minimum rating"
        name="rating"
        options={RATING_OPTIONS}
        value={rating}
        onChange={(v) => onChange("rating", v)}
      />
    </aside>
  );
}