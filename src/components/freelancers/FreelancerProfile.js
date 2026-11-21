"use client";

import Link from "next/link";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Award,
  CheckCircle2,
  Clock,
  ExternalLink,
  Globe,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Share2,
  ShieldCheck,
  Star,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useToast } from "@/components/ui/ToastProvider";
import SafeImage from "@/components/ui/SafeImage";
import GigCard from "@/components/gigs/GigCard";

export default function FreelancerProfile({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const { getFreelancer, getFreelancerGigs, getFreelancerReviews } = useMarketplace();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState("gigs"); // gigs | case-studies | reviews | work-history

  const freelancer = getFreelancer(id) || getFreelancer("f1");
  const gigs = getFreelancerGigs(freelancer.id);
  const reviews = getFreelancerReviews(freelancer.id);

  function handleContact() {
    router.push(`/messages?freelancer=${freelancer.id}`);
  }

  function handleShare() {
    navigator.clipboard?.writeText(window.location.href);
    showToast("Profile link copied to clipboard!");
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Top Protocol Header matching Image 4 */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 font-mono text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="flex h-3.5 w-3.5 items-center justify-center bg-[#047857] text-[9px] text-white">■</span>
            <span className="font-bold text-slate-900">
              CONTRACTOR #{freelancer.contractCode || "PRO-08914-ELENA"}
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-[#047857] font-bold">STATUS: AVAILABLE FOR SPRINTS & DIRECT ESCROW</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>AVG RESPONSE: {freelancer.avgResponse || "18 MINS"}</span>
            <span className="text-slate-300">|</span>
            <span>NEXT SPRINT WINDOW: {freelancer.nextSprint || "OCT 24"}</span>
          </div>
        </div>

        {/* Hero Profile Card */}
        <div className="mt-6 border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            {/* Left: Avatar & Bio */}
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="relative shrink-0">
                <SafeImage
                  src={freelancer.avatar}
                  alt={freelancer.name}
                  className="h-28 w-28 object-cover border border-slate-200 shadow-sm"
                />
                <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center bg-[#047857] text-xs text-white">
                  ✓
                </span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="font-serif text-3xl font-bold tracking-tight text-slate-950">
                    {freelancer.name.toUpperCase()}
                  </h1>
                  <span className="border border-emerald-300 bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-[#047857]">
                    {freelancer.tier || "TOP RATED SELLER"}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-xs text-slate-500">
                    <MapPin className="h-3 w-3" /> {freelancer.location}
                  </span>
                </div>

                <p className="mt-1 font-mono text-xs font-semibold text-slate-800">
                  {freelancer.headline}
                </p>

                <p className="mt-3 max-w-2xl text-xs leading-relaxed text-slate-600">
                  {freelancer.bio}
                </p>

                {/* Pill Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[10px] text-slate-700">
                    # NEUMORPHIC EXP
                  </span>
                  <span className="border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[10px] text-slate-700">
                    # DESIGN SYS OPS
                  </span>
                  <span className="border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[10px] text-slate-700">
                    # FIGMA ARCHITECT
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Rate Box & Actions */}
            <div className="border border-slate-200 bg-[#FAFBFB] p-5 lg:w-72 shrink-0">
              <div className="border-b border-slate-200 pb-3">
                <p className="font-mono text-[10px] uppercase text-slate-500">RATE INDICATOR</p>
                <p className="font-serif text-2xl font-bold text-slate-950">
                  ₹{freelancer.hourlyRate?.toLocaleString("en-IN") || "3,500"} <span className="font-sans text-xs font-normal text-slate-500">/ HOUR</span>
                </p>
              </div>

              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  onClick={handleContact}
                  className="w-full bg-[#047857] py-2 font-mono text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#065f46]"
                >
                  CONTACT SELLER
                </button>
                <button
                  type="button"
                  onClick={() => router.push(`/messages?freelancer=${freelancer.id}&custom=1`)}
                  className="w-full border border-slate-300 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-slate-700 transition hover:bg-slate-50"
                >
                  REQUEST CUSTOM OFFER
                </button>
              </div>

              <div className="mt-3 flex justify-between border-t border-slate-200 pt-3 font-mono text-xs">
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center gap-1 text-slate-600 hover:text-[#047857]"
                >
                  <Share2 className="h-3 w-3" /> SHARE PROFILE
                </button>
                <button
                  type="button"
                  onClick={handleContact}
                  className="flex items-center gap-1 text-slate-600 hover:text-[#047857]"
                >
                  <MessageSquare className="h-3 w-3" /> MESSAGE
                </button>
              </div>
            </div>
          </div>

          {/* Stats Bar at bottom of hero card */}
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-200 pt-6 sm:grid-cols-5 font-mono text-center">
            <div className="border-r border-slate-100 last:border-none p-2">
              <p className="text-xs font-bold text-slate-950">★ 4.9</p>
              <p className="text-[10px] uppercase text-slate-500">248 CLIENT REVIEWS</p>
            </div>
            <div className="border-r border-slate-100 last:border-none p-2">
              <p className="text-xs font-bold text-[#047857]">98%</p>
              <p className="text-[10px] uppercase text-slate-500">JOB SUCCESS SCORE</p>
            </div>
            <div className="border-r border-slate-100 last:border-none p-2">
              <p className="text-xs font-bold text-[#047857]">100%</p>
              <p className="text-[10px] uppercase text-slate-500">ON-TIME SETTLEMENT</p>
            </div>
            <div className="border-r border-slate-100 last:border-none p-2">
              <p className="text-xs font-bold text-slate-950">{freelancer.hoursLogged || "1.2k+"}</p>
              <p className="text-[10px] uppercase text-slate-500">HOURS LOGGED</p>
            </div>
            <div className="p-2">
              <p className="text-xs font-bold text-slate-950">{freelancer.totalEscrow || "₹1.2 Cr+"}</p>
              <p className="text-[10px] uppercase text-slate-500">TOTAL ESCROW EARNINGS</p>
            </div>
          </div>
        </div>

        {/* 2-Column Split: Left Verification Sidebar + Right Tabbed Content */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* Left Sidebar */}
          <div className="space-y-6">
            {/* Card 1: ID Phase & Verification */}
            <div className="border border-slate-200 bg-white p-5 shadow-sm font-mono text-xs">
              <div className="border-b border-slate-100 pb-3 font-bold uppercase tracking-wider text-slate-900 flex justify-between">
                <span>ID PHASE & VERIFICATION</span>
                <span className="text-[#047857]">L2 VERIFIED</span>
              </div>
              <ul className="mt-3 space-y-2.5">
                <li className="flex items-center justify-between">
                  <span className="text-slate-600">Identity Document</span>
                  <span className="border border-emerald-300 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-[#047857]">
                    VERIFIED
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-slate-600">Payment & Escrow</span>
                  <span className="border border-emerald-300 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-[#047857]">
                    VERIFIED
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-slate-600">Phone & 2FA Authenticated</span>
                  <span className="border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-bold text-slate-700">
                    ACTIVE
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-slate-600">Work Trust Certified</span>
                  <span className="border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-bold text-slate-700">
                    ACTIVE
                  </span>
                </li>
              </ul>
            </div>

            {/* Card 2: Verified Skill Matrix */}
            <div className="border border-slate-200 bg-white p-5 shadow-sm font-mono text-xs">
              <div className="border-b border-slate-100 pb-3 font-bold uppercase tracking-wider text-slate-900 flex justify-between">
                <span>VERIFIED SKILL MATRIX</span>
                <span className="text-slate-400">EVALUATED</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="border border-[#047857] bg-[#eaf6ee] px-2 py-1 text-[11px] font-bold text-[#047857]">
                  Figma [PRO]
                </span>
                <span className="border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-800">
                  Design Systems [L4]
                </span>
                <span className="border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-800">
                  UX Research
                </span>
                <span className="border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-800">
                  Wireframing
                </span>
                <span className="border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-800">
                  Design Tokens
                </span>
                <span className="border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-800">
                  Prototyping
                </span>
                <span className="border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-800">
                  SaaS UI
                </span>
                <span className="border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-800">
                  Tailwind CSS
                </span>
              </div>
            </div>

            {/* Card 3: Accreditations */}
            <div className="border border-slate-200 bg-white p-5 shadow-sm font-mono text-xs">
              <div className="border-b border-slate-100 pb-3 font-bold uppercase tracking-wider text-slate-900 flex justify-between">
                <span>ACCREDITATIONS</span>
                <span className="text-slate-400">AUDITED</span>
              </div>
              <div className="mt-3 space-y-3">
                <div className="border-l-2 border-[#047857] pl-2.5">
                  <p className="font-bold text-slate-900">Golden Hummingbird Group / FDM</p>
                  <p className="text-[10px] text-slate-500">Design Sprint Facilitator · 2023</p>
                </div>
                <div className="border-l-2 border-slate-300 pl-2.5">
                  <p className="font-bold text-slate-900">Figma Certified Lead</p>
                  <p className="text-[10px] text-slate-500">Enterprise Architecture · 2022</p>
                </div>
              </div>
            </div>

            {/* Card 4: Languages */}
            <div className="border border-slate-200 bg-white p-5 shadow-sm font-mono text-xs">
              <div className="border-b border-slate-100 pb-3 font-bold uppercase tracking-wider text-slate-900">
                LANGUAGES
              </div>
              <ul className="mt-3 space-y-2">
                <li className="flex justify-between">
                  <span className="text-slate-600">German</span>
                  <span className="font-bold text-slate-900">NATIVE</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-600">English</span>
                  <span className="font-bold text-[#047857]">FLUENT / VERIFIED</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-slate-600">Spanish</span>
                  <span className="text-slate-500">CONVERSATIONAL</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Main Content Tabs */}
          <div>
            {/* Tabs Header */}
            <div className="flex border border-slate-200 bg-white font-mono text-xs font-bold overflow-x-auto shadow-sm">
              <button
                type="button"
                onClick={() => setActiveTab("gigs")}
                className={`px-5 py-3 whitespace-nowrap uppercase tracking-wider transition ${
                  activeTab === "gigs"
                    ? "bg-[#047857] text-white"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                ACTIVE GIGS ({gigs.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("case-studies")}
                className={`px-5 py-3 whitespace-nowrap uppercase tracking-wider border-l border-slate-200 transition ${
                  activeTab === "case-studies"
                    ? "bg-[#047857] text-white"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                PORTFOLIO & CASE STUDIES (6)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("reviews")}
                className={`px-5 py-3 whitespace-nowrap uppercase tracking-wider border-l border-slate-200 transition ${
                  activeTab === "reviews"
                    ? "bg-[#047857] text-white"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                CLIENT REVIEWS ({reviews.length || 242})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("work-history")}
                className={`px-5 py-3 whitespace-nowrap uppercase tracking-wider border-l border-slate-200 transition ${
                  activeTab === "work-history"
                    ? "bg-[#047857] text-white"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                WORK HISTORY
              </button>
            </div>

            {/* Tab 1: Active Gigs */}
            {activeTab === "gigs" && (
              <div className="mt-6">
                <div className="mb-4 flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-slate-900 uppercase">AVAILABLE DIRECT CONTRACTS</span>
                  <span className="border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[#047857] font-bold">
                    2 GIGS ACTIVE
                  </span>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  {gigs.map((g) => (
                    <GigCard key={g.id} gig={g} />
                  ))}
                </div>
              </div>
            )}

            {/* Tab 2: Case Studies */}
            {activeTab === "case-studies" && (
              <div className="mt-6 space-y-6">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-slate-900 uppercase">
                    FEATURED CASE STUDIES & PRODUCT PROOFS
                  </span>
                  <span className="text-slate-500 uppercase">FULL ARCHIVE (6)</span>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  {(freelancer.caseStudies || []).map((cs) => (
                    <div key={cs.id} className="border border-slate-200 bg-white p-4 shadow-sm flex flex-col">
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                        <SafeImage src={cs.image} alt={cs.title} className="h-full w-full object-cover" />
                        <span className="absolute top-2 left-2 bg-black/80 px-2 py-0.5 font-mono text-[9px] font-bold text-white uppercase">
                          {cs.category} {"//"} {cs.sprint}
                        </span>
                      </div>
                      <h3 className="mt-3 font-serif text-lg font-bold text-slate-950">
                        {cs.title}
                      </h3>
                      <p className="mt-1.5 text-xs text-slate-600 leading-relaxed flex-1">
                        {cs.desc}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-1.5 border-t border-slate-100 pt-3">
                        {cs.tags.map((t) => (
                          <span key={t} className="border border-slate-200 bg-[#FAFBFB] px-2 py-0.5 font-mono text-[9px] text-slate-700">
                            {t}
                          </span>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => showToast(`Opening audit spec for ${cs.title}`, "info")}
                        className="mt-3 text-left font-mono text-xs font-bold text-[#047857] hover:underline"
                      >
                        VIEW DETAILED CASE STUDY →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Client Reviews */}
            {activeTab === "reviews" && (
              <div className="mt-6 space-y-6">
                <div className="border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 font-mono text-xs">
                    <span className="font-bold uppercase text-slate-900">
                      VERIFIED CLIENT TESTIMONIALS & AUDIT LOGS
                    </span>
                    <span className="text-[#047857] font-bold">VIEW ALL (242)</span>
                  </div>

                  <div className="mt-4 space-y-4">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="border border-slate-100 bg-[#FAFBFB] p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">{rev.clientName}</span>
                            <span className="border border-emerald-300 bg-emerald-50 px-1 font-mono text-[9px] text-[#047857]">
                              VERIFIED GIGCRAFT ESCROW
                            </span>
                          </div>
                          <span className="font-mono text-xs text-amber-500">★★★★★</span>
                        </div>
                        <p className="mt-1 font-mono text-[10px] text-slate-500">
                          {rev.clientRole} · {rev.paidEscrow || "₹1,84,000"} Escrow Paid
                        </p>
                        <p className="mt-2 text-xs text-slate-700 leading-relaxed">
                          {rev.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Work History */}
            {activeTab === "work-history" && (
              <div className="mt-6 border border-slate-200 bg-white p-6 shadow-sm">
                <div className="border-b border-slate-100 pb-3 font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
                  WORK HISTORY & CAREER TRAJECTORY
                </div>
                <div className="mt-6 space-y-6">
                  {(freelancer.workHistory || []).map((wh, idx) => (
                    <div key={idx} className="border-l-2 border-[#047857] pl-4">
                      <div className="flex items-baseline justify-between font-mono text-xs">
                        <h3 className="font-bold uppercase text-slate-900">{wh.role}</h3>
                        <span className="text-slate-500">{wh.period}</span>
                      </div>
                      <p className="font-mono text-[11px] text-[#047857] font-semibold">{wh.company}</p>
                      <p className="mt-2 text-xs text-slate-600 leading-relaxed">{wh.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
