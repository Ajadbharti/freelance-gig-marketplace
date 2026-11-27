"use client";

import { useState } from "react";
import { ArrowRight, Check, Clock, Minus, RefreshCw, Sparkles } from "lucide-react";
import { PACKAGES_DATA } from "./GigStickyOrderCard";
import { useToast } from "@/components/ui/ToastProvider";

const FEATURE_COMPARISON_MATRIX = [
  { name: "Initial Concepts Included", basic: "1 Concept", standard: "3 Concepts", premium: "5 Concepts" },
  { name: "Logo Transparency (PNG)", basic: true, standard: true, premium: true },
  { name: "High-Resolution Printable (300 DPI)", basic: true, standard: true, premium: true },
  { name: "Printable Vector Files (AI, EPS, SVG)", basic: false, standard: true, premium: true },
  { name: "3D Mockup Presentation", basic: false, standard: true, premium: true },
  { name: "Brand Style Guide Book", basic: false, standard: false, premium: true },
  { name: "Social Media Kit (Avatars & Covers)", basic: false, standard: false, premium: true },
  { name: "Stationery Design (Business Cards)", basic: false, standard: false, premium: true },
  { name: "Commercial Use License", basic: true, standard: true, premium: true },
  { name: "Revisions", basic: "2 Revisions", standard: "5 Revisions", premium: "Unlimited" },
  { name: "Delivery Time", basic: "2 Days", standard: "3 Days", premium: "5 Days" },
];

export default function GigPricingPackages({ activeTab, onSelectPackage }) {
  const [selectedPackage, setSelectedPackage] = useState(activeTab || "standard");
  const { showToast } = useToast();

  function handleSelect(pkgId) {
    setSelectedPackage(pkgId);
    if (onSelectPackage) onSelectPackage(pkgId);
    showToast(`Selected ${PACKAGES_DATA[pkgId].name} Package ($${PACKAGES_DATA[pkgId].price})!`, "success");
  }

  return (
    <section id="pricing-packages" className="py-8 space-y-8 scroll-mt-24">
      {/* Section Header */}
      <div className="space-y-1.5">
        <span className="font-sans text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
          Transparent Pricing
        </span>
        <h2 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Compare Packages
        </h2>
        <p className="text-sm text-slate-500 max-w-xl">
          Choose the package that best fits your project scope. All tiers include 100% escrow protection and verified milestone delivery.
        </p>
      </div>

      {/* 3 Package Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {Object.values(PACKAGES_DATA).map((pkg) => {
          const isStandard = pkg.popular;
          const isSelected = selectedPackage === pkg.id;

          return (
            <div
              key={pkg.id}
              className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 ${
                isStandard
                  ? "bg-white border-2 border-violet-600 shadow-xl shadow-violet-500/10 md:-translate-y-2"
                  : "bg-white border border-slate-200/90 shadow-md hover:border-slate-300"
              }`}
            >
              {/* Most Popular Badge for Standard */}
              {isStandard && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-1 text-xs font-bold text-white shadow-md shadow-violet-500/30 flex items-center gap-1.5 whitespace-nowrap">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>MOST POPULAR · BEST VALUE</span>
                </div>
              )}

              <div className="space-y-5">
                {/* Header: Tier Name & Price */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-sans">
                      {pkg.name} Tier
                    </span>
                    <span className="font-sans text-xs text-slate-400">USD</span>
                  </div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-headline text-4xl font-extrabold text-slate-900">
                      ${pkg.price}
                    </span>
                  </div>
                  <h3 className="font-headline text-lg font-bold text-slate-900 mt-2">
                    {pkg.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {pkg.description}
                  </p>
                </div>

                {/* Delivery & Revision Metas */}
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 py-3 border-y border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-violet-600" />
                    <span>{pkg.deliveryDays}-Day Delivery</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <RefreshCw className="w-4 h-4 text-violet-600" />
                    <span>
                      {pkg.revisions === "Unlimited" ? "Unlimited" : `${pkg.revisions} Revisions`}
                    </span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-2.5 text-xs text-slate-600">
                  {pkg.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-6 mt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleSelect(pkg.id)}
                  className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-sans text-xs sm:text-sm font-semibold transition cursor-pointer ${
                    isStandard
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25 hover:from-violet-700 hover:to-indigo-700"
                      : "bg-slate-50 border border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300"
                  }`}
                >
                  <span>Select {pkg.name} Package</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Feature Comparison Table */}
      <div className="hidden md:block rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-sm">
        <div className="p-6 bg-slate-50/70 border-b border-slate-200">
          <h3 className="font-headline text-lg font-bold text-slate-900">
            Package Comparison Matrix
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Detailed breakdown of deliverables included across each tier.
          </p>
        </div>

        <div className="divide-y divide-slate-100 text-xs sm:text-sm">
          {/* Table Header */}
          <div className="grid grid-cols-12 p-4 bg-slate-50 font-bold text-slate-900 text-center">
            <div className="col-span-6 text-left pl-2">Feature / Deliverable</div>
            <div className="col-span-2">Basic ($25)</div>
            <div className="col-span-2 text-violet-600">Standard ($50)</div>
            <div className="col-span-2">Premium ($100)</div>
          </div>

          {/* Matrix Rows */}
          {FEATURE_COMPARISON_MATRIX.map((row) => (
            <div
              key={row.name}
              className="grid grid-cols-12 p-4 hover:bg-slate-50/50 transition items-center text-center"
            >
              <div className="col-span-6 text-left pl-2 font-medium text-slate-800">
                {row.name}
              </div>

              {/* Basic */}
              <div className="col-span-2 flex justify-center text-slate-600 font-medium">
                {typeof row.basic === "boolean" ? (
                  row.basic ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Minus className="w-4 h-4 text-slate-300" />
                  )
                ) : (
                  <span>{row.basic}</span>
                )}
              </div>

              {/* Standard */}
              <div className="col-span-2 flex justify-center font-bold text-violet-700 bg-violet-50/50 py-1 rounded-md">
                {typeof row.standard === "boolean" ? (
                  row.standard ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Minus className="w-4 h-4 text-slate-300" />
                  )
                ) : (
                  <span>{row.standard}</span>
                )}
              </div>

              {/* Premium */}
              <div className="col-span-2 flex justify-center text-slate-600 font-medium">
                {typeof row.premium === "boolean" ? (
                  row.premium ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Minus className="w-4 h-4 text-slate-300" />
                  )
                ) : (
                  <span>{row.premium}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
