"use client";

import Link from "next/link";
import { use, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  ExternalLink,
  MapPin,
  MessageSquare,
  Share2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useToast } from "@/components/ui/ToastProvider";
import SafeImage from "@/components/ui/SafeImage";
import { formatPrice } from "@/lib/utils";

export default function FreelancerProfile({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { getFreelancer, getFreelancerReviews, getFreelancerGigs } = useMarketplace();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState("gigs");

  const gigsRef = useRef(null);
  const caseStudiesRef = useRef(null);
  const reviewsRef = useRef(null);
  const workHistoryRef = useRef(null);

  const freelancer = getFreelancer(id);
  const freelancerReviews = freelancer ? getFreelancerReviews(freelancer.id) : [];
  const freelancerGigs = freelancer ? getFreelancerGigs(freelancer.id) : [];

  function scrollToSection(tabName, ref) {
    setActiveTab(tabName);
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }

  function handleContact() {
    if (!freelancer) return;
    router.push(`/messages?freelancer=${freelancer.id}`);
  }

  function handleShare() {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      showToast("Profile link copied to clipboard!");
    }
  }

  if (!freelancer) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] py-16 px-4 text-center">
        <div className="max-w-md mx-auto border border-[#0b1c30] bg-white p-8 shadow-[4px_4px_0px_#0b1c30]">
          <h1 className="font-headline text-xl font-bold uppercase text-[#0b1c30]">
            Specialist Not Found
          </h1>
          <p className="mt-2 font-mono text-xs text-[#6e7a73]">
            No verified specialist found with ID: {id}
          </p>
          <Link
            href="/explore"
            className="mt-6 inline-flex items-center justify-center bg-[#005d42] px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white hover:bg-[#047857] shadow-[2px_2px_0px_#0b1c30]"
          >
            Explore All Specialists
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      {/* Top Protocol Strip (Black Bar matching image) */}
      <div className="border-b border-[#0b1c30] bg-[#0b1c30] px-4 py-2 font-mono text-[11px] text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-[#005d42]" />
            <span className="font-bold tracking-wider">
              CONTRACTOR // {freelancer.contractCode || `NODE-${freelancer.id?.toUpperCase() || "SPEC"}: ${(freelancer.name || "SPECIALIST").toUpperCase()}`}
            </span>
          </div>
          <div className="font-bold text-[#9ffdd3] uppercase">
            STATUS: AVAILABLE FOR SPRINT & DIRECT ESCROW
          </div>
          <div className="flex items-center gap-3 text-[#dae2fd]">
            <span>AVG RESPONSE: {freelancer.avgResponse || "18 MINS"}</span>
            <span className="text-white/30">|</span>
            <span>NEXT SPRINT WINDOW: {freelancer.nextSprint || "OCT 24"}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Profile Card */}
        <div className="border border-[#e5e7eb] bg-white p-6 sm:p-8 shadow-[3px_3px_0px_#0b1c30]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            {/* Left: Avatar with Top Rated Badge */}
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="relative shrink-0">
                <div className="h-32 w-32 border border-[#0b1c30] overflow-hidden bg-slate-100">
                  <SafeImage
                    src={freelancer.avatar}
                    alt={freelancer.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="absolute bottom-0 left-0 bg-[#005d42] px-2 py-0.5 font-mono text-[10px] font-bold text-white uppercase tracking-wider">
                  {freelancer.tier || "TOP RATED"}
                </span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-xs text-[#6e7a73]">ID: #11-008914</span>
                  <span className="border border-[#005d42] bg-[#eff4ff] px-2 py-0.5 font-mono text-[10px] font-bold text-[#005d42] uppercase">
                    TOP RATED SELLER
                  </span>
                  <span className="flex items-center gap-1 font-mono text-xs text-[#6e7a73]">
                    <MapPin className="h-3 w-3 text-[#005d42]" /> {freelancer.location}
                  </span>
                </div>

                <h1 className="mt-2 font-headline text-3xl font-bold tracking-tight text-[#0b1c30] uppercase">
                  {freelancer.name}
                </h1>

                <p className="mt-1 font-mono text-xs font-semibold text-[#3e4943]">
                  {freelancer.headline}
                </p>

                <p className="mt-3 max-w-2xl text-xs leading-relaxed text-[#3e4943]">
                  {freelancer.bio}
                </p>

                {/* Badge Pills */}
                <div className="mt-4 flex flex-wrap gap-2 font-mono text-[10px] font-bold uppercase text-[#0b1c30]">
                  <span className="border border-[#e5e7eb] bg-[#eff4ff] px-2.5 py-1">
                    🕒 40 HRS / WEEK CAP
                  </span>
                  <span className="border border-[#e5e7eb] bg-[#eff4ff] px-2.5 py-1">
                    📑 ESCROW READY
                  </span>
                  <span className="border border-[#005d42] bg-[#eff4ff] px-2.5 py-1 text-[#005d42]">
                    🛡️ DISPENSE PROTOCOL VERIFIED
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Rate Box & Actions */}
            <div className="border border-[#e5e7eb] bg-[#f8f9ff] p-5 lg:w-72 shrink-0 shadow-[2px_2px_0px_#0b1c30]">
              <div className="border-b border-[#e5e7eb] pb-3">
                <p className="font-mono text-[10px] uppercase text-[#6e7a73] font-semibold">
                  RATE INDICATOR
                </p>
                <p className="font-headline text-2xl font-bold text-[#0b1c30] mt-0.5">
                  ₹{freelancer.hourlyRate}.00 <span className="font-sans text-xs font-normal text-[#6e7a73]">/ HOUR</span>
                </p>
              </div>

              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  onClick={handleContact}
                  className="w-full bg-[#005d42] py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-[2px_2px_0px_#0b1c30] hover:bg-[#047857] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                >
                  CONTACT SELLER
                </button>
                <button
                  type="button"
                  onClick={() => router.push(`/messages?freelancer=${freelancer.id}&custom=1`)}
                  className="w-full border border-[#0b1c30] bg-white py-2 font-mono text-xs font-bold uppercase tracking-wider text-[#0b1c30] shadow-[2px_2px_0px_#0b1c30] hover:bg-[#eff4ff] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                >
                  REQUEST CUSTOM OFFER
                </button>
              </div>

              <div className="mt-3 flex justify-between border-t border-[#e5e7eb] pt-3 font-mono text-xs">
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex items-center gap-1 text-[#6e7a73] hover:text-[#005d42]"
                >
                  <Share2 className="h-3 w-3" /> SHARE PROFILE
                </button>
                <button
                  type="button"
                  onClick={handleContact}
                  className="flex items-center gap-1 text-[#6e7a73] hover:text-[#005d42]"
                >
                  <MessageSquare className="h-3 w-3" /> MESSAGE
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Telemetry Stats Strip matching image (5 columns) */}
        <div className="mt-6 grid grid-cols-2 gap-4 border border-[#e5e7eb] bg-white p-4 font-mono text-center sm:grid-cols-5 shadow-[3px_3px_0px_#0b1c30]">
          <div className="border-r border-[#e5e7eb] p-2">
            <p className="font-headline text-xl font-bold text-[#0b1c30]">★ 4.9</p>
            <p className="text-[10px] uppercase text-[#6e7a73] font-semibold">248 CLIENT REVIEWS</p>
          </div>
          <div className="border-r border-[#e5e7eb] p-2">
            <p className="font-headline text-xl font-bold text-[#005d42]">98%</p>
            <p className="text-[10px] uppercase text-[#6e7a73] font-semibold">JOB SUCCESS SCORE</p>
          </div>
          <div className="border-r border-[#e5e7eb] p-2">
            <p className="font-headline text-xl font-bold text-[#005d42]">100%</p>
            <p className="text-[10px] uppercase text-[#6e7a73] font-semibold">ON-TIME SETTLEMENT</p>
          </div>
          <div className="border-r border-[#e5e7eb] p-2">
            <p className="font-headline text-xl font-bold text-[#0b1c30]">1.2k+</p>
            <p className="text-[10px] uppercase text-[#6e7a73] font-semibold">HOURS LOGGED</p>
          </div>
          <div className="p-2">
            <p className="font-headline text-xl font-bold text-[#0b1c30]">{freelancer.totalEscrow || "₹7,999"}</p>
            <p className="text-[10px] uppercase text-[#6e7a73] font-semibold">TOTAL ESCROW EARNINGS</p>
          </div>
        </div>

        {/* 2-Column Split: Left Verification Sidebar (300px) + Right Stacked Modules */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* Left Sidebar */}
          <div className="space-y-6">
            {/* Card 1: ID Phase & Verification */}
            <div className="border border-[#e5e7eb] bg-white p-5 shadow-[3px_3px_0px_#0b1c30] font-mono text-xs">
              <div className="border-b border-[#e5e7eb] pb-3 font-bold uppercase tracking-wider text-[#0b1c30] flex justify-between items-center">
                <span>PHASE & VERIFICATION</span>
                <span className="border border-[#005d42] bg-[#eff4ff] px-1.5 py-0.5 text-[9px] font-bold text-[#005d42]">
                  L2 VERIFIED
                </span>
              </div>
              <ul className="mt-3 space-y-2.5">
                <li className="flex items-center justify-between">
                  <span className="text-[#3e4943]">Identity Document</span>
                  <span className="border border-[#005d42] bg-[#005d42] px-1.5 py-0.5 text-[9px] font-bold text-white uppercase">
                    VERIFIED
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-[#3e4943]">Payment & Escrow</span>
                  <span className="border border-[#005d42] bg-[#005d42] px-1.5 py-0.5 text-[9px] font-bold text-white uppercase">
                    VERIFIED
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-[#3e4943]">Phone & 2FA Authenticated</span>
                  <span className="border border-[#dae2fd] bg-[#eff4ff] px-1.5 py-0.5 text-[9px] font-bold text-[#0047bf] uppercase">
                    ACTIVE
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-[#3e4943]">Work Email Verified</span>
                  <span className="border border-[#dae2fd] bg-[#eff4ff] px-1.5 py-0.5 text-[9px] font-bold text-[#0047bf] uppercase">
                    ACTIVE
                  </span>
                </li>
              </ul>
            </div>

            {/* Card 2: Verified Skill Matrix */}
            <div className="border border-[#e5e7eb] bg-white p-5 shadow-[3px_3px_0px_#0b1c30] font-mono text-xs">
              <div className="border-b border-[#e5e7eb] pb-3 font-bold uppercase tracking-wider text-[#0b1c30] flex justify-between items-center">
                <span>VERIFIED SKILL MATRIX</span>
                <span className="text-[#6e7a73] font-normal text-[10px]">8 EVALUATED</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="border border-[#005d42] bg-[#005d42] px-2 py-0.5 text-[10px] font-bold text-white">
                  Figma [L9 98%]
                </span>
                <span className="border border-[#0b1c30] bg-[#0b1c30] px-2 py-0.5 text-[10px] font-bold text-white">
                  Design Systems [L9]
                </span>
                <span className="border border-[#e5e7eb] bg-[#eff4ff] px-2 py-0.5 text-[10px] text-[#0b1c30]">
                  UX Research
                </span>
                <span className="border border-[#e5e7eb] bg-[#eff4ff] px-2 py-0.5 text-[10px] text-[#0b1c30]">
                  Wireframing
                </span>
                <span className="border border-[#e5e7eb] bg-[#eff4ff] px-2 py-0.5 text-[10px] text-[#0b1c30]">
                  Design Tokens
                </span>
                <span className="border border-[#e5e7eb] bg-[#eff4ff] px-2 py-0.5 text-[10px] text-[#0b1c30]">
                  Prototyping
                </span>
                <span className="border border-[#0b1c30] bg-[#0b1c30] px-2 py-0.5 text-[10px] font-bold text-white">
                  SaaS UI [L8]
                </span>
                <span className="border border-[#e5e7eb] bg-[#eff4ff] px-2 py-0.5 text-[10px] text-[#0b1c30]">
                  Tailwind CSS
                </span>
              </div>
              <div className="mt-4 border-t border-[#e5e7eb] pt-3 text-[10px] text-[#6e7a73]">
                <p className="font-bold uppercase text-[#0b1c30]">PROOF OF WORK REPOSITORIES</p>
                <p className="mt-1 font-mono text-[#0047bf]">
                  Github: {freelancer.github || `${(freelancer.name || "specialist").toLowerCase().replace(/\s+/g, "-")}-repos`}
                </p>
              </div>
            </div>

            {/* Card 3: Accreditations */}
            <div className="border border-[#e5e7eb] bg-white p-5 shadow-[3px_3px_0px_#0b1c30] font-mono text-xs">
              <div className="border-b border-[#e5e7eb] pb-3 font-bold uppercase tracking-wider text-[#0b1c30] flex justify-between items-center">
                <span>ACCREDITATIONS</span>
                <span className="text-[#6e7a73] font-normal text-[10px]">AUDITED</span>
              </div>
              <div className="mt-3 space-y-3">
                {freelancer.accreditations?.map((acc, idx) => (
                  <div key={idx} className="border-l-2 border-[#005d42] pl-2.5">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-[#0b1c30] uppercase text-[11px]">{acc.title}</p>
                      <span className="text-[#6e7a73] text-[10px]">{acc.year}</span>
                    </div>
                    <p className="text-[10px] text-[#3e4943] mt-0.5">{acc.role}</p>
                    <p className="text-[9px] text-[#6e7a73]">{acc.details}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 4: Languages */}
            <div className="border border-[#e5e7eb] bg-white p-5 shadow-[3px_3px_0px_#0b1c30] font-mono text-xs">
              <div className="border-b border-[#e5e7eb] pb-3 font-bold uppercase tracking-wider text-[#0b1c30] flex justify-between items-center">
                <span>LANGUAGES</span>
                <span className="text-[#6e7a73] font-normal text-[10px]">VERIFIED</span>
              </div>
              <ul className="mt-3 space-y-2">
                <li className="flex justify-between items-center">
                  <span className="text-[#3e4943]">German</span>
                  <span className="border border-[#e5e7eb] bg-[#eff4ff] px-1.5 py-0.5 text-[9px] font-bold text-[#0b1c30]">
                    NATIVE
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-[#3e4943]">English</span>
                  <span className="border border-[#005d42] bg-[#eff4ff] px-1.5 py-0.5 text-[9px] font-bold text-[#005d42]">
                    FLUENT / VERIFIED
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-[#3e4943]">Spanish</span>
                  <span className="border border-[#e5e7eb] bg-white px-1.5 py-0.5 text-[9px] text-[#6e7a73]">
                    CONVERSATIONAL
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Main Content Column */}
          <div className="space-y-10">
            {/* Top Navigation Tabs matching screenshot */}
            <div className="flex border border-[#0b1c30] bg-white font-mono text-xs font-bold overflow-x-auto shadow-[3px_3px_0px_#0b1c30]">
              <button
                type="button"
                onClick={() => scrollToSection("gigs", gigsRef)}
                className={`px-5 py-3 whitespace-nowrap uppercase tracking-wider transition ${
                  activeTab === "gigs"
                    ? "bg-[#0b1c30] text-white"
                    : "text-[#0b1c30] hover:bg-[#eff4ff]"
                }`}
              >
                ACTIVE GIGS (03)
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("case-studies", caseStudiesRef)}
                className={`px-5 py-3 whitespace-nowrap uppercase tracking-wider border-l border-[#0b1c30] transition ${
                  activeTab === "case-studies"
                    ? "bg-[#0b1c30] text-white"
                    : "text-[#0b1c30] hover:bg-[#eff4ff]"
                }`}
              >
                PORTFOLIO & CASE STUDIES (04)
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("reviews", reviewsRef)}
                className={`px-5 py-3 whitespace-nowrap uppercase tracking-wider border-l border-[#0b1c30] transition ${
                  activeTab === "reviews"
                    ? "bg-[#0b1c30] text-white"
                    : "text-[#0b1c30] hover:bg-[#eff4ff]"
                }`}
              >
                CLIENT REVIEWS (248)
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("work-history", workHistoryRef)}
                className={`px-5 py-3 whitespace-nowrap uppercase tracking-wider border-l border-[#0b1c30] transition ${
                  activeTab === "work-history"
                    ? "bg-[#0b1c30] text-white"
                    : "text-[#0b1c30] hover:bg-[#eff4ff]"
                }`}
              >
                WORK HISTORY
              </button>
            </div>

            {/* MODULE 1: AVAILABLE DIRECT CONTRACTS */}
            <div ref={gigsRef} className="space-y-4">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-[#0b1c30] uppercase">AVAILABLE DIRECT CONTRACTS</span>
                <span className="border border-[#005d42] bg-[#eff4ff] px-2 py-0.5 text-[#005d42] font-bold">
                  {freelancerGigs.length} GIGS ACTIVE
                </span>
              </div>

              {freelancerGigs.length === 0 ? (
                <div className="border border-dashed border-[#e5e7eb] bg-white p-8 text-center font-mono text-xs">
                  <p className="text-[#6e7a73] uppercase">No active specifications published yet</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {freelancerGigs.map((g) => (
                    <article
                      key={g.id}
                      className="flex flex-col border border-[#e5e7eb] bg-white shadow-[3px_3px_0px_#0b1c30] hover:border-[#0b1c30] transition"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 border-b border-[#e5e7eb]">
                        <SafeImage src={g.image} alt={g.title} className="h-full w-full object-cover" />
                        <div className="absolute bottom-2 left-2 flex gap-1.5">
                          <span className="border border-[#0b1c30] bg-white px-2 py-0.5 font-mono text-[9px] font-bold text-[#0b1c30]">
                            ⚡ {g.deliveryBadge || `${g.deliveryDays || 2}-DAYS DELIVERY`}
                          </span>
                          <span className="border border-[#0b1c30] bg-white px-2 py-0.5 font-mono text-[9px] font-bold text-[#0b1c30]">
                            {g.revisions || 3} REVISIONS
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-4">
                        <Link href={`/gigs/${g.id}`} className="block">
                          <h3 className="line-clamp-2 font-headline text-sm font-bold uppercase leading-snug text-[#0b1c30] hover:text-[#005d42]">
                            {g.title}
                          </h3>
                        </Link>

                        <p className="mt-2 text-xs text-[#3e4943] line-clamp-2 leading-relaxed">
                          {g.description || g.desc}
                        </p>

                        <div className="mt-auto flex items-center justify-between border-t border-[#e5e7eb] pt-3.5 mt-4">
                          <div>
                            <p className="font-mono text-[9px] uppercase tracking-wider text-[#6e7a73] font-semibold">
                              STARTING FROM
                            </p>
                            <p className="font-headline text-lg font-bold text-[#0b1c30]">
                              {formatPrice(g.price)}
                            </p>
                          </div>
                          <Link
                            href={`/gigs/${g.id}`}
                            className="px-3 py-1.5 bg-white border border-[#0b1c30] font-mono font-bold text-[11px] uppercase tracking-wider text-[#0b1c30] shadow-[2px_2px_0px_#0b1c30] hover:bg-[#eff4ff] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                          >
                            SELECT SPEC
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* MODULE 2: FEATURED CASE STUDIES & PRODUCT PROOFS */}
            <div ref={caseStudiesRef} className="space-y-4">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-[#0b1c30] uppercase">
                  FEATURED CASE STUDIES & PRODUCT PROOFS
                </span>
                <span className="font-mono text-xs text-[#0047bf] font-bold">
                  {freelancer.caseStudies?.length ? `FULL ARCHIVE (${freelancer.caseStudies.length}) →` : "ARCHIVE (0)"}
                </span>
              </div>

              {!freelancer.caseStudies?.length ? (
                <div className="border border-dashed border-[#e5e7eb] bg-white p-8 text-center font-mono text-xs">
                  <p className="text-[#6e7a73] uppercase">No case studies or proofs submitted yet</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                  {freelancer.caseStudies.map((cs) => (
                    <div
                      key={cs.id}
                      className="border border-[#e5e7eb] bg-white p-4 shadow-[3px_3px_0px_#0b1c30] flex flex-col"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950 border border-[#e5e7eb]">
                        <SafeImage src={cs.image} alt={cs.title} className="h-full w-full object-cover" />
                        <span className="absolute top-2 left-2 border border-[#0b1c30] bg-white px-2 py-0.5 font-mono text-[9px] font-bold text-[#0b1c30] uppercase">
                          {cs.category} {"//"} {cs.sprint}
                        </span>
                      </div>

                      <h3 className="mt-3 font-headline text-base font-bold text-[#0b1c30] uppercase leading-tight">
                        {cs.title}
                      </h3>

                      <p className="mt-2 text-xs text-[#3e4943] leading-relaxed flex-1">
                        {cs.desc}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-1.5 border-t border-[#e5e7eb] pt-3">
                        {cs.tags?.map((t) => (
                          <span
                            key={t}
                            className="border border-[#dae2fd] bg-[#eff4ff] px-2 py-0.5 font-mono text-[10px] text-[#0047bf]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => showToast(`Opening audit spec for ${cs.title}`, "info")}
                        className="mt-3 text-left font-mono text-xs font-bold text-[#005d42] hover:underline"
                      >
                        VIEW DETAILED CASE STUDY ↗
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* MODULE 3: VERIFIED CLIENT TESTIMONIALS & AUDIT LOGS */}
            <div ref={reviewsRef} className="space-y-4">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-[#0b1c30] uppercase">
                  VERIFIED CLIENT TESTIMONIALS & AUDIT LOGS
                </span>
                <span className="font-mono text-xs text-[#005d42] font-bold">
                  TOTAL ({freelancerReviews.length})
                </span>
              </div>

              <div className="space-y-4">
                {freelancerReviews.length === 0 ? (
                  <div className="border border-[#e5e7eb] bg-white p-8 text-center shadow-[2px_2px_0px_#0b1c30]">
                    <p className="font-headline text-sm font-bold uppercase text-[#0b1c30]">
                      No Client Reviews Yet
                    </p>
                    <p className="mt-1 font-mono text-xs text-[#6e7a73]">
                      Verified reviews will be posted here once escrow contracts are successfully settled.
                    </p>
                  </div>
                ) : (
                  freelancerReviews.map((t) => (
                    <div
                      key={t.id}
                      className="border border-[#e5e7eb] bg-white p-5 shadow-[3px_3px_0px_#0b1c30]"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e5e7eb] pb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center border border-[#0b1c30] bg-[#0b1c30] font-mono text-xs font-bold text-white">
                            {t.clientName ? t.clientName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "CL"}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-[#0b1c30]">{t.clientName || "Client"}</span>
                              <span className="font-mono text-[10px] text-[#005d42]">{t.clientBadge || "VERIFIED"}</span>
                            </div>
                            <div className="flex items-center gap-1 font-mono text-xs text-amber-500 mt-0.5">
                              {"★".repeat(t.rating || 5)} <span className="font-bold text-[#0b1c30] ml-1">{t.rating || 5}.0</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right font-mono text-[11px]">
                          <span className="border border-[#dae2fd] bg-[#eff4ff] px-2 py-0.5 font-bold text-[#0047bf]">
                            PAID: {t.paidEscrow || "$0"} ESCROW
                          </span>
                          <p className="text-[10px] text-[#6e7a73] mt-1">{t.completedDate || "Recently"}</p>
                        </div>
                      </div>

                      <p className="mt-3 text-xs leading-relaxed text-[#0b1c30]">
                        "{t.comment}"
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-[#e5e7eb] pt-2 font-mono text-[10px] text-[#6e7a73]">
                        <span>PROJECT: {t.projectName || "Contract Spec"}</span>
                        <span>·</span>
                        <span className="text-[#005d42] font-bold">VERIFIED GIGCRAFT ESCROW</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {freelancerReviews.length > 3 && (
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-between border-t border-[#e5e7eb] pt-4 font-mono text-xs">
                  <span className="text-[#6e7a73]">DISPLAYING {freelancerReviews.length} OF {freelancerReviews.length} ENTRIES</span>
                </div>
              )}
            </div>

            {/* MODULE 4: WORK HISTORY & CAREER TRAJECTORY */}
            <div ref={workHistoryRef} className="space-y-4">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="font-bold text-[#0b1c30] uppercase">
                  WORK HISTORY & CAREER TRAJECTORY
                </span>
                <span className="border border-[#e5e7eb] bg-[#eff4ff] px-2 py-0.5 text-[#0047bf] font-bold">
                  {freelancer.workHistory?.length || 0} TRANS-CONTRACTS
                </span>
              </div>

              <div className="border border-[#e5e7eb] bg-white p-6 shadow-[3px_3px_0px_#0b1c30] space-y-6">
                {!freelancer.workHistory?.length ? (
                  <p className="font-mono text-xs text-[#6e7a73] text-center py-4">No verified work history records published yet</p>
                ) : (
                  freelancer.workHistory.map((wh, idx) => (
                    <div key={idx} className="border-l-2 border-[#005d42] pl-4">
                      <div className="flex flex-wrap items-baseline justify-between font-mono text-xs">
                        <h3 className="font-headline font-bold text-sm uppercase text-[#0b1c30]">
                          {wh.role}
                        </h3>
                        <span className="border border-[#dae2fd] bg-[#eff4ff] px-2 py-0.5 text-[10px] font-bold text-[#0047bf]">
                          {wh.period}
                        </span>
                      </div>
                      <p className="font-mono text-xs text-[#005d42] font-semibold mt-0.5">{wh.company}</p>
                      <p className="mt-2 text-xs text-[#3e4943] leading-relaxed">{wh.desc}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
