"use client";

import { useState } from "react";
import { ArrowRight, Check, Clock, MessageSquare, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

export const PACKAGES_DATA = {
  basic: {
    id: "basic",
    name: "Basic",
    title: "Simple Logo Design",
    price: 25,
    deliveryDays: 2,
    revisions: 2,
    description: "1 minimalist logo concept in high-res JPG & transparent PNG. Perfect for new personal projects or MVP tests.",
    features: [
      "1 Initial Logo Concept",
      "High-Resolution JPG (300 DPI)",
      "Transparent PNG File",
      "2 Revision Rounds",
      "2-Day Fast Delivery",
    ],
  },
  standard: {
    id: "standard",
    name: "Standard",
    title: "Professional Logo Design",
    price: 50,
    deliveryDays: 3,
    revisions: 5,
    popular: true,
    description: "3 polished modern logo concepts with full editable vector source files, 3D mockup, and priority turnaround.",
    features: [
      "3 Professional Logo Concepts",
      "Printable Vector Files (AI, EPS, SVG)",
      "High-Res JPG & Transparent PNG",
      "Realistic 3D Mockup Presentation",
      "5 Revision Rounds",
      "3-Day Delivery",
      "Commercial Use License",
    ],
  },
  premium: {
    id: "premium",
    name: "Premium",
    title: "Complete Brand Identity",
    price: 100,
    deliveryDays: 5,
    revisions: "Unlimited",
    description: "Full enterprise brand identity suite: 5 concepts, complete brand book, stationery, social media kit, and unlimited revisions.",
    features: [
      "5 Premium Logo Concepts",
      "Full Vector & Source Files (AI, EPS, SVG, PDF)",
      "Complete Brand Style Guide & Typography",
      "Social Media Kit (Banners & Profile Avatars)",
      "Stationery Designs (Business Card & Letterhead)",
      "Unlimited Revisions until 100% Satisfied",
      "5-Day Delivery",
      "VIP 24/7 Priority Support",
    ],
  },
};

export default function GigStickyOrderCard({
  activeTab = "standard",
  onTabChange,
  onOrderClick,
}) {
  const [selectedTier, setSelectedTier] = useState(activeTab);
  const { showToast } = useToast();

  const currentTier = selectedTier;
  const pkg = PACKAGES_DATA[currentTier] || PACKAGES_DATA.standard;

  function handleTabSelect(tier) {
    setSelectedTier(tier);
    if (onTabChange) onTabChange(tier);
  }

  function handleContinue() {
    if (onOrderClick) {
      onOrderClick(pkg);
    } else {
      showToast(`Selected ${pkg.name} Package ($${pkg.price}). Checkout flow will connect here!`, "info");
    }
  }

  function handleContact() {
    showToast("Messaging Elena Rostova... Direct chat modal opens here.", "info");
  }

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/50 overflow-hidden sticky top-24">
      {/* Package Tabs Header */}
      <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50/70 p-1.5 gap-1 text-center">
        {Object.values(PACKAGES_DATA).map((p) => {
          const isActive = selectedTier === p.id;

          return (
            <button
              key={p.id}
              type="button"
              onClick={() => handleTabSelect(p.id)}
              className={`relative py-2.5 px-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                isActive
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/60"
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                <span>{p.name}</span>
                {p.popular && (
                  <span className="hidden xl:inline-block w-1.5 h-1.5 rounded-full bg-violet-600" />
                )}
              </div>
              <p className="text-xs font-mono font-bold text-violet-600 mt-0.5">
                ${p.price}
              </p>
            </button>
          );
        })}
      </div>

      {/* Package Content Body */}
      <div className="p-6 sm:p-7 space-y-6">
        {/* Tier Title & Price */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-violet-600">
                {pkg.name} Package
              </span>
              <h3 className="font-headline text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                {pkg.title}
              </h3>
            </div>
            <div className="text-right shrink-0">
              <span className="font-headline text-3xl font-extrabold text-slate-900">
                ${pkg.price}
              </span>
              <span className="text-xs text-slate-400 block font-sans">USD</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
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
              {pkg.revisions === "Unlimited" ? "Unlimited Revisions" : `${pkg.revisions} Revisions`}
            </span>
          </div>
        </div>

        {/* Features Checklist */}
        <div className="space-y-2.5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            What&apos;s Included:
          </p>
          <ul className="space-y-2">
            {pkg.features.map((feat) => (
              <li key={feat} className="flex items-start gap-2 text-xs text-slate-600">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Primary Continue Button */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleContinue}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-sans text-sm font-semibold shadow-lg shadow-violet-500/25 hover:from-violet-700 hover:to-indigo-700 transition active:scale-[0.99] cursor-pointer"
          >
            <span>Continue (${pkg.price})</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="#pricing-packages"
            className="block text-center text-xs font-semibold text-violet-600 hover:text-violet-700 hover:underline transition"
          >
            Compare All 3 Packages
          </a>
        </div>

        {/* Contact Freelancer Button */}
        <button
          type="button"
          onClick={handleContact}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
          <span>Contact Elena Rostova</span>
        </button>

        {/* Escrow Guarantee Footer */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50/50 p-3.5 flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600 leading-snug">
            <span className="font-bold text-slate-900 block">100% Escrow Milestone Protection</span>
            Funds are held safely in escrow and released only after you review and approve the final files.
          </div>
        </div>
      </div>
    </div>
  );
}
