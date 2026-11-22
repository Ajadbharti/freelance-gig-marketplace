"use client";

import Link from "next/link";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Clock,
  Lock,
  RefreshCw,
  Search,
  Share2,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useToast } from "@/components/ui/ToastProvider";
import SafeImage from "@/components/ui/SafeImage";
import OrderModal from "@/components/orders/OrderModal";

export default function GigDetails({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const { getGig, getFreelancer, getGigReviews, getGigRating } = useMarketplace();
  const { showToast } = useToast();

  const gig = getGig(id) || getGig("g1");
  const freelancer = gig ? getFreelancer(gig.freelancerId) : null;
  const reviews = gig ? getGigReviews(gig.id) : [];
  const ratingData = gig ? getGigRating(gig.id) : { average: 4.9, count: 248 };

  const [activePackageTab, setActivePackageTab] = useState("standard");
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(0);

  const basePrice = Number(gig?.price) || 24000;
  const rawPackages = gig?.packages && typeof gig.packages === "object" ? gig.packages : {};

  const packages = {
    basic: rawPackages.basic || {
      name: "STARTER SPEC",
      price: Math.round(basePrice * 0.6),
      deliveryDays: Math.max(1, (gig?.deliveryDays || 3) - 1),
      revisions: 2,
      screens: "Up to 3 Screens",
      features: [
        "Core user flow layout",
        "Responsive breakpoint stacking",
        "Source files included",
        "2 Business Days delivery",
        "2 Iteration revisions",
      ],
    },
    standard: rawPackages.standard || {
      name: "STANDARD CORE SUITE",
      price: basePrice,
      deliveryDays: gig?.deliveryDays || 3,
      revisions: gig?.revisions || 4,
      screens: "4 to 8 Screens",
      recommended: true,
      features: [
        "Complete feature environment",
        "Strict Auto-Layout architecture",
        "Interactive micro-prototypes included",
        "Source files + variables",
        "Design system token exports",
        "Developer handoff blueprints",
      ],
    },
    premium: rawPackages.premium || {
      name: "ENTERPRISE SYSTEM",
      price: Math.round(basePrice * 1.6),
      deliveryDays: (gig?.deliveryDays || 3) + 2,
      revisions: 999,
      screens: "10+ Complete Views",
      features: [
        "Full platform spec (10+ views)",
        "Design Tokens & JSON theme schema",
        "Clickable hi-fi user flow prototype",
        "Direct developer handoff",
        "Unlimited revisions during sprint",
      ],
    },
  };

  const selectedPkg = packages[activePackageTab] || packages.standard || packages.basic || {};


  function handleOrderClick() {
    if (!user) {
      showToast("Please log in as client to initiate escrow contract.", "info");
      router.push(`/login?next=${encodeURIComponent(`/gigs/${gig?.id || "g1"}`)}`);
      return;
    }
    setOrderModalOpen(true);
  }

  function handleContactSeller() {
    router.push(`/messages?freelancer=${freelancer?.id || "f1"}`);
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Protocol Shortcut Header matching image */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 font-mono text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Link href="/gigs" className="flex items-center gap-1 hover:text-slate-900">
              <ArrowLeft className="h-3.5 w-3.5" /> BACK TO CATALOG
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">SHORTCUT: S484-X</span>
            <span>|</span>
            <span className="text-[#047857] font-bold">SAFE ESCROW LISTING</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-700">
            <span className="border border-emerald-300 bg-emerald-50 px-2 py-0.5 font-bold text-[#047857]">
              FAST AUDIT COMPLIANT
            </span>
          </div>
        </div>

        {/* Gig Title */}
        <div className="mt-6">
          <h1 className="font-headline text-2xl font-bold tracking-tight text-[#0b1c30] sm:text-3xl md:text-4xl uppercase">
            {gig?.title}
          </h1>

          {/* Author line with badges */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/freelancers/${freelancer?.id || "f1"}`}
                className="flex items-center gap-2"
              >
                <SafeImage
                  src={freelancer?.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80"}
                  alt=""
                  className="h-8 w-8 border border-[#0b1c30] object-cover"
                />
                <span className="font-sans text-sm font-bold text-[#0b1c30] hover:underline">
                  {freelancer?.name || "Ananya Sharma"} <span className="text-[#005d42]">✓</span>
                </span>
              </Link>
              <span className="bg-[#0b1c30] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white">
                {gig?.tier || "TOP RATED"}
              </span>
              <div className="flex items-center gap-1 font-mono text-xs font-bold text-[#0b1c30]">
                <span className="text-amber-500">★</span>
                <span>{Number(ratingData.average || 4.9).toFixed(1)}</span>
                <span className="font-normal text-[#3e4943]">({ratingData.count || 248} reviews)</span>
              </div>
              <span className="text-slate-300">|</span>
              <span className="font-mono text-xs text-[#3e4943]">3 Orders in Queue</span>
              <span className="text-slate-300">|</span>
              <span className="font-mono text-xs font-semibold text-[#005d42]">Escrow Safe</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  showToast("Contract link copied to clipboard!");
                }}
                className="btn-secondary flex items-center gap-1.5 px-3 py-1.5 text-xs"
              >
                <Share2 className="h-3.5 w-3.5" /> SHARE
              </button>
              <button
                type="button"
                onClick={handleContactSeller}
                className="btn-primary px-4 py-1.5 text-xs"
              >
                CONTACT SELLER
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column Split: Content (Left) + Sticky Order Box (Right) */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Left Column: Spec Details */}
          <div className="space-y-10">
            {/* Gallery Preview Box */}
            <div className="border border-[#e5e7eb] bg-white p-3 shadow-[3px_3px_0px_#0b1c30]">
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                <SafeImage
                  src={gig?.image}
                  alt={gig?.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-black/80 px-2 py-0.5 font-mono text-[10px] font-bold text-white uppercase backdrop-blur">
                    UI/UX FIDELITY: HIGH
                  </span>
                  <span className="bg-[#047857]/90 px-2 py-0.5 font-mono text-[10px] font-bold text-white uppercase backdrop-blur">
                    FIGMA ENGINE
                  </span>
                </div>
              </div>
              {/* Thumbnails */}
              <div className="mt-3 grid grid-cols-4 gap-2">
                <div className="border-2 border-[#047857] aspect-[16/10] overflow-hidden">
                  <SafeImage src={gig?.image} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="border border-slate-200 aspect-[16/10] overflow-hidden opacity-70 hover:opacity-100 cursor-pointer">
                  <SafeImage src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80" alt="" className="h-full w-full object-cover" />
                </div>
                <div className="border border-slate-200 aspect-[16/10] overflow-hidden opacity-70 hover:opacity-100 cursor-pointer">
                  <SafeImage src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=400&q=80" alt="" className="h-full w-full object-cover" />
                </div>
                <div className="border border-slate-200 aspect-[16/10] overflow-hidden opacity-70 hover:opacity-100 cursor-pointer">
                  <SafeImage src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80" alt="" className="h-full w-full object-cover" />
                </div>
              </div>
            </div>

            {/* About This Gig Section */}
            <div className="card-neo sm:p-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="font-headline text-2xl font-bold uppercase tracking-wide text-[#0b1c30]">ABOUT THIS GIG</h2>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#3e4943]">
                  MODULE: SCALED VISUAL SPEC & ASSETS
                </span>
              </div>
              <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-[#0b1c30]">
                {gig?.description}
              </div>

              {/* Feature Checklist Box */}
              <div className="mt-8 border border-[#e5e7eb] bg-[#eff4ff] p-5">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b1c30]">
                  WHAT YOU WILL RECEIVE (PRODUCTION READY)
                </h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {(gig?.featuresList || [
                    "MODULAR COMPONENTS & DSN",
                    "STRICT AUTO-LAYOUT 5.0",
                    "INTERACTIVE PROTOTYPING",
                    "FULL DESIGN SYSTEM/TOKENS",
                    "DEVELOPER HANDOFF BLUEPRINTS",
                  ]).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 font-mono text-xs text-[#0b1c30]">
                      <span className="flex h-4 w-4 items-center justify-center bg-[#005d42] text-[10px] text-white">
                        ✓
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrics Row matching image */}
              <div className="mt-8 grid grid-cols-3 gap-4 border-t border-slate-200 pt-6">
                <div className="border border-[#e5e7eb] bg-[#eff4ff] p-4 text-center">
                  <p className="font-headline text-2xl font-bold text-[#0b1c30]">8+ YRS</p>
                  <p className="mt-1 font-mono text-[10px] uppercase text-[#3e4943]">
                    RETURNING CLIENT EXPERIENCE
                  </p>
                </div>
                <div className="border border-[#e5e7eb] bg-[#eff4ff] p-4 text-center">
                  <p className="font-headline text-2xl font-bold text-[#005d42]">100%</p>
                  <p className="mt-1 font-mono text-[10px] uppercase text-[#3e4943]">
                    ON-TIME SETTLEMENT
                  </p>
                </div>
                <div className="border border-[#e5e7eb] bg-[#eff4ff] p-4 text-center">
                  <p className="font-headline text-2xl font-bold text-[#0b1c30]">DAILY</p>
                  <p className="mt-1 font-mono text-[10px] uppercase text-[#3e4943]">
                    ASYNC ASYNCHRONY
                  </p>
                </div>
              </div>
            </div>

            {/* Compare Packages Table matching Image 3 */}
            <div className="card-neo sm:p-8">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="font-headline text-2xl font-bold uppercase tracking-wide text-[#0b1c30]">COMPARE PACKAGES</h2>
              </div>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full border-collapse font-mono text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-left">
                      <th className="p-3 text-slate-500 font-normal">FEATURES / PRODUCTION</th>
                      <th className="p-3 font-bold text-[#0b1c30]">
                        BASIC
                        <p className="text-sm font-headline font-bold text-[#0b1c30]">
                          ${(packages?.basic?.price ?? Math.round(basePrice * 0.6)).toLocaleString("en-US")}
                        </p>
                      </th>
                      <th className="border-x border-t border-[#005d42] bg-[#eff4ff] p-3 font-bold text-[#005d42]">
                        STANDARD (RECOMMENDED)
                        <p className="text-sm font-headline font-bold text-[#0b1c30]">
                          ${(packages?.standard?.price ?? basePrice).toLocaleString("en-US")}
                        </p>
                      </th>
                      <th className="p-3 font-bold text-[#0b1c30]">
                        PREMIUM
                        <p className="text-sm font-headline font-bold text-[#0b1c30]">
                          ${(packages?.premium?.price ?? Math.round(basePrice * 1.6)).toLocaleString("en-US")}
                        </p>
                      </th>

                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="p-3 font-semibold text-slate-900">Delivery Time</td>
                      <td className="p-3">2 Business Days</td>
                      <td className="border-x border-[#047857] bg-[#eaf6ee] p-3 font-semibold text-slate-900">
                        3 Business Days
                      </td>
                      <td className="p-3">5 Business Days</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-900">Number of Screens</td>
                      <td className="p-3">Up to 3 Screens</td>
                      <td className="border-x border-[#047857] bg-[#eaf6ee] p-3 font-semibold text-slate-900">
                        4 to 8 Screens
                      </td>
                      <td className="p-3">10+ Complete Views</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-900">Responsive/Breakpoint Stacking</td>
                      <td className="p-3 text-[#047857]">✓ Included</td>
                      <td className="border-x border-[#047857] bg-[#eaf6ee] p-3 font-semibold text-[#047857]">
                        ✓ Included
                      </td>
                      <td className="p-3 text-[#047857]">✓ Included</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-900">Source Figma (.fig) file</td>
                      <td className="p-3 text-[#047857]">✓ Included</td>
                      <td className="border-x border-[#047857] bg-[#eaf6ee] p-3 font-semibold text-[#047857]">
                        ✓ Included
                      </td>
                      <td className="p-3 text-[#047857]">✓ Included</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-900">Interactive Micro-Prototypes</td>
                      <td className="p-3 text-slate-400">—</td>
                      <td className="border-x border-[#047857] bg-[#eaf6ee] p-3 font-semibold text-[#047857]">
                        ✓ Included
                      </td>
                      <td className="p-3 text-[#047857]">✓ Included</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-900">Design System Tokens (JSON)</td>
                      <td className="p-3 text-slate-400">—</td>
                      <td className="border-x border-[#047857] bg-[#eaf6ee] p-3 text-slate-400">—</td>
                      <td className="p-3 text-[#047857]">✓ Included</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-slate-900">Revisions Included</td>
                      <td className="p-3">2 Revisions</td>
                      <td className="border-x border-[#047857] bg-[#eaf6ee] p-3 font-semibold text-slate-900">
                        4 Revisions
                      </td>
                      <td className="p-3">Unlimited</td>
                    </tr>
                    <tr className="border-t border-slate-200">
                      <td className="p-3" />
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => {
                            setActivePackageTab("basic");
                            handleOrderClick();
                          }}
                          className="btn-secondary w-full py-1.5 text-xs"
                        >
                          SELECT SPEC
                        </button>
                      </td>
                      <td className="border-x border-b border-[#005d42] bg-[#eff4ff] p-3">
                        <button
                          type="button"
                          onClick={() => {
                            setActivePackageTab("standard");
                            handleOrderClick();
                          }}
                          className="btn-primary w-full py-1.5 text-xs"
                        >
                          SELECT PACKAGE
                        </button>
                      </td>
                      <td className="p-3">
                        <button
                          type="button"
                          onClick={() => {
                            setActivePackageTab("premium");
                            handleOrderClick();
                          }}
                          className="btn-secondary w-full py-1.5 text-xs"
                        >
                          SELECT SPEC
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Client Verification & Reviews matching Image 3 */}
            <div className="card-neo sm:p-8">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="font-headline text-2xl font-bold uppercase tracking-wide text-[#0b1c30]">
                  CLIENT VERIFICATION & REVIEWS
                </h2>
              </div>

              {/* Rating summary & breakdown bars */}
              <div className="mt-6 grid gap-6 sm:grid-cols-[140px_1fr]">
                <div className="text-center sm:text-left">
                  <p className="font-headline text-5xl font-bold text-[#0b1c30]">4.9</p>
                  <div className="mt-1 flex items-center justify-center sm:justify-start gap-1 text-amber-500 text-sm">
                    ★★★★★
                  </div>
                  <p className="mt-1 font-mono text-[10px] uppercase text-slate-500">
                    248 VERIFIED ESCROW REVIEWS
                  </p>
                </div>

                {/* Bars */}
                <div className="space-y-1.5 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-12 text-slate-500">5 Star</span>
                    <div className="h-2 flex-1 bg-slate-100">
                      <div className="h-full bg-[#047857] w-[92%]" />
                    </div>
                    <span className="w-10 text-right text-slate-500">92%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-12 text-slate-500">4 Star</span>
                    <div className="h-2 flex-1 bg-slate-100">
                      <div className="h-full bg-[#047857] w-[7%]" />
                    </div>
                    <span className="w-10 text-right text-slate-500">7%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-12 text-slate-500">3 Star</span>
                    <div className="h-2 flex-1 bg-slate-100">
                      <div className="h-full bg-[#047857] w-[1%]" />
                    </div>
                    <span className="w-10 text-right text-slate-500">1%</span>
                  </div>
                </div>
              </div>

              {/* Review Filter Pills */}
              <div className="mt-8 flex flex-wrap gap-2 border-b border-slate-100 pb-4">
                <div className="flex flex-1 items-center border border-slate-200 px-3 py-1.5 min-w-[200px]">
                  <Search className="h-3.5 w-3.5 text-slate-400 mr-2" />
                  <input
                    type="text"
                    placeholder="Filter by keyword or skill..."
                    className="w-full font-mono text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
                <button type="button" className="border border-slate-900 bg-slate-900 px-3 py-1.5 font-mono text-[11px] font-bold text-white">
                  Most Recent
                </button>
                <button type="button" className="border border-slate-200 bg-white px-3 py-1.5 font-mono text-[11px] text-slate-700 hover:bg-slate-50">
                  Communication
                </button>
                <button type="button" className="border border-slate-200 bg-white px-3 py-1.5 font-mono text-[11px] text-slate-700 hover:bg-slate-50">
                  Quality of Work
                </button>
                <button type="button" className="border border-slate-200 bg-white px-3 py-1.5 font-mono text-[11px] text-slate-700 hover:bg-slate-50">
                  Speed
                </button>
              </div>

              {/* Verified Review Cards */}
              <div className="mt-6 space-y-6">
                {reviews.map((rev) => (
                  <div key={rev.id} className="border border-slate-100 bg-[#FAFBFB] p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center bg-slate-900 font-mono text-xs font-bold text-white">
                          {rev.clientName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">{rev.clientName}</span>
                            <span className="border border-emerald-300 bg-emerald-50 px-1.5 font-mono text-[9px] font-bold text-[#047857]">
                              {rev.clientBadge || "VERIFIED BUYER"}
                            </span>
                          </div>
                          <p className="font-mono text-[10px] text-slate-500">{rev.clientRole}</p>
                        </div>
                      </div>
                      <div className="text-right font-mono text-[11px]">
                        <span className="text-amber-500">★★★★★</span>
                        <p className="text-[10px] text-slate-400">{rev.completedDate || "Oct 2024"}</p>
                      </div>
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-slate-800">
                      {rev.comment}
                    </p>

                    {/* Nested Seller Response */}
                    {rev.reply && (
                      <div className="mt-3 border-l-2 border-[#047857] bg-white p-3 pl-4">
                        <p className="font-mono text-[10px] font-bold uppercase text-[#047857]">
                          ↳ {rev.replyAuthor || "ELENA ROSTOVA (SELLER)"}
                        </p>
                        <p className="mt-1 text-xs text-slate-700">
                          {rev.reply}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Frequently Asked Questions */}
            <div className="card-neo sm:p-8">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="font-headline text-2xl font-bold uppercase tracking-wide text-[#0b1c30]">
                  FREQUENTLY ASKED QUESTIONS
                </h2>
              </div>
              <div className="mt-6 divide-y divide-slate-100">
                {(gig?.faqs || []).map((faq, idx) => {
                  const isOpen = expandedFaq === idx;
                  return (
                    <div key={idx} className="py-4">
                      <button
                        type="button"
                        onClick={() => setExpandedFaq(isOpen ? -1 : idx)}
                        className="flex w-full items-center justify-between text-left text-sm font-bold text-[#0b1c30]"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={`h-4 w-4 transition ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                      {isOpen && (
                        <p className="mt-2 text-xs leading-relaxed text-[#3e4943]">
                          {faq.a}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Sticky Column: Package Selector & Seller Card */}
          <div className="space-y-6 lg:sticky lg:top-20 lg:self-start">
            {/* Box 1: Package Selector Card */}
            <div className="card-neo">
              {/* Package Tabs matching image */}
              <div className="grid grid-cols-3 border border-[#0b1c30] font-mono text-xs font-bold text-center">
                <button
                  type="button"
                  onClick={() => setActivePackageTab("basic")}
                  className={`py-2 transition-colors ${
                    activePackageTab === "basic"
                      ? "bg-[#005d42] text-white"
                      : "bg-white text-[#0b1c30] hover:bg-[#eff4ff]"
                  }`}
                >
                  BASIC ${(packages?.basic?.price ?? Math.round(basePrice * 0.6)).toLocaleString("en-US")}
                </button>
                <button
                  type="button"
                  onClick={() => setActivePackageTab("standard")}
                  className={`py-2 border-x border-[#0b1c30] transition-colors ${
                    activePackageTab === "standard"
                      ? "bg-[#005d42] text-white"
                      : "bg-white text-[#0b1c30] hover:bg-[#eff4ff]"
                  }`}
                >
                  STANDARD ${(packages?.standard?.price ?? basePrice).toLocaleString("en-US")}
                </button>
                <button
                  type="button"
                  onClick={() => setActivePackageTab("premium")}
                  className={`py-2 transition-colors ${
                    activePackageTab === "premium"
                      ? "bg-[#005d42] text-white"
                      : "bg-white text-[#0b1c30] hover:bg-[#eff4ff]"
                  }`}
                >
                  PREMIUM ${(packages?.premium?.price ?? Math.round(basePrice * 1.6)).toLocaleString("en-US")}
                </button>
              </div>

              {/* Selected Tier Title & Price */}
              <div className="mt-5 flex items-baseline justify-between border-b border-slate-100 pb-3">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b1c30]">
                  {selectedPkg?.name || "STANDARD SUITE"}
                </h3>
                <span className="font-headline text-2xl font-bold text-[#0b1c30]">
                  ${(selectedPkg?.price ?? basePrice).toLocaleString("en-US")}
                </span>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-[#3e4943]">
                Complete UI environment for {selectedPkg?.screens || "4 to 8 Screens"} with responsive layout, handoff specs and interactive prototype.
              </p>

              {/* Delivery & Revisions row */}
              <div className="mt-4 flex items-center justify-between border-y border-slate-100 py-2.5 font-mono text-xs text-[#0b1c30]">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#005d42]" /> {selectedPkg?.deliveryDays || 3}-Day Delivery
                </span>
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="h-3.5 w-3.5 text-[#005d42]" /> {selectedPkg?.revisions || 3} Revisions
                </span>
              </div>

              {/* Checklist */}
              <ul className="mt-4 space-y-2 text-xs text-[#0b1c30]">
                {selectedPkg.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <Check className="h-3.5 w-3.5 text-[#005d42]" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              {/* Big CTA Button */}
              <button
                type="button"
                onClick={handleOrderClick}
                className="btn-primary mt-6 flex h-12 w-full items-center justify-center gap-2 text-xs"
              >
                CONTINUE (${selectedPkg.price?.toLocaleString("en-US")}) →
              </button>

              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.querySelector("table");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="font-mono text-xs text-[#3e4943] underline hover:text-[#005d42]"
                >
                  COMPARE PACKAGES
                </button>
              </div>

              {/* Escrow Guarantee Box */}
              <div className="mt-5 border border-[#005d42]/30 bg-[#eff4ff] p-3 text-center font-mono text-[11px] text-[#005d42]">
                <ShieldCheck className="mx-auto h-4 w-4 mb-1" />
                <strong>GIGCRAFT ESCROW PROTECTION</strong>
                <p className="mt-0.5 text-[10px] text-[#3e4943]">
                  100% Milestone-backed money-back guarantee
                </p>
              </div>
            </div>

            {/* Box 2: Seller Profile Card */}
            <div className="card-neo">
              <div className="flex items-center gap-3">
                <SafeImage
                  src={freelancer?.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"}
                  alt=""
                  className="h-12 w-12 border border-[#0b1c30] object-cover"
                />
                <div>
                  <Link
                    href={`/freelancers/${freelancer?.id || "f1"}`}
                    className="font-sans text-sm font-bold text-[#0b1c30] hover:underline"
                  >
                    {freelancer?.name || "Ananya Sharma"}
                  </Link>
                  <p className="font-mono text-xs text-[#3e4943]">Design Systems Specialist</p>
                </div>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-3 space-y-2 font-mono text-xs text-[#3e4943]">
                <div className="flex justify-between">
                  <span className="text-slate-400">Location</span>
                  <span className="text-[#0b1c30]">{freelancer?.location || "Bengaluru, India 🇮🇳"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Member since</span>
                  <span className="text-[#0b1c30]">October 2021</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Avg. response time</span>
                  <span className="text-[#0b1c30]">18 mins</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Last delivery</span>
                  <span className="text-[#0b1c30]">2 hours ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Languages</span>
                  <span className="text-[#0b1c30]">English, Hindi (Fluent)</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleContactSeller}
                className="btn-secondary mt-5 w-full py-2.5 text-xs"
              >
                CONTACT {freelancer?.name?.split(" ")[0]?.toUpperCase() || "ANANYA"}
              </button>
            </div>

            {/* Box 3: Escrow Protocol Explanation */}
            <div className="card-neo bg-[#eff4ff] p-5 font-mono text-xs text-[#3e4943]">
              <div className="flex items-center gap-2 text-[#0b1c30] font-bold uppercase">
                <Lock className="h-3.5 w-3.5 text-[#005d42]" />
                <span>GIGCRAFT ESCROW METHOD</span>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-[#3e4943]">
                Contract funds are locked in neutral escrow before work starts. Deliverables pass automated quality checklist verification before release.
              </p>
            </div>
          </div>
        </div>

        {/* Order Modal */}
        {gig && (
          <OrderModal
            gig={gig}
            selectedPackage={selectedPkg}
            open={orderModalOpen}
            onClose={() => setOrderModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
