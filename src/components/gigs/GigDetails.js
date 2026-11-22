"use client";

import Link from "next/link";
import { use, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Clock,
  Heart,
  RefreshCw,
  Search,
  ShieldCheck,
  Zap,
  BarChart2,
  Mail,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useToast } from "@/components/ui/ToastProvider";
import SafeImage from "@/components/ui/SafeImage";
import OrderModal from "@/components/orders/OrderModal";

const SHOWCASE_GALLERY = [
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
];

const DEFAULT_REVIEWS = [
  {
    id: "rev-1",
    clientName: "Marcus Vance",
    clientRole: "VP INFRASTRUCTURE",
    clientBadge: "VERIFIED BUYER",
    rating: 5,
    packageUsed: "STANDARD PACKAGE",
    timeAgo: "2 WEEKS AGO",
    comment:
      "Elena's component architecture saved our engineering team weeks. She delivered full responsive Figma frames that matched our Tailwind tokens 1-to-1! No unnecessary fluff, just enterprise-grade product UX and clean token specifications.",
    replyAuthor: "TO: VP INFRASTRUCTURE, M. VANCE //",
    reply:
      "Thank you Marcus! It was an absolute pleasure collaborating with your engineering team. Looking forward to Sprint 2.",
    tags: ["component library", "speed"],
  },
  {
    id: "rev-2",
    clientName: "Sarah Jenkins",
    clientRole: "HEAD OF PRODUCT",
    clientBadge: "VERIFIED BUYER",
    rating: 5,
    packageUsed: "PREMIUM PACKAGE",
    timeAgo: "1 MONTH AGO",
    comment:
      "Outstanding execution across high-fidelity wireframing and UI screens. She didn't just design screens—she questioned UX assumptions and simplified our user onboarding flow drastically. Her strict Auto-Layout 5.0 practices made developer handoff effortless.",
    replyAuthor: "TO: SARAH JENKINS, HEAD OF PRODUCT //",
    reply:
      "Always a pleasure Sarah! Glad the design token JSON made the engineering handoff smooth. Thanks for your trust.",
    tags: ["design system"],
  },
  {
    id: "rev-3",
    clientName: "Rohit Deshmukh",
    clientRole: "VP ENGINEERING",
    clientBadge: "VERIFIED BUYER",
    rating: 5,
    packageUsed: "STANDARD PACKAGE",
    timeAgo: "2 MONTHS AGO",
    comment:
      "Elena is exceptional. She didn't just generate pretty wireframes; she actively dove into our token emissions, cleared up edge-case user error fallbacks, and gave our frontend team components they could implement on day one without asking 50 questions. Delivered 2 days ahead of schedule.",
    replyAuthor: null,
    reply: null,
    tags: ["speed", "component library"],
  },
];

const FAQS = [
  {
    q: "Do you write actual frontend code (React / Tailwind)?",
    a: "I focus purely on high-precision Figma design systems, tokens, and developer specs. However, every component is structured with flexbox Auto-Layout 5.0 and CSS variables that map 1-to-1 to Tailwind CSS classes.",
  },
  {
    q: "How do we handle confidential IP and NDA requirements?",
    a: "All contracts on GigCraft are protected under bilateral deterministic NDAs and mutual IP assignment upon escrow milestone disbursement.",
  },
  {
    q: "What assets do you require from our side to start?",
    a: "Brief overview of user personas, core feature requirements, any existing brand guidelines or vector logos, and your preferred tech stack (Next.js, Tailwind, etc.).",
  },
  {
    q: "Can I purchase additional screens later as an add-on?",
    a: "Yes, additional views, sub-pages, or design tokens can be added anytime through milestone scope extensions.",
  },
];

export default function GigDetails({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const { isSaved, toggle } = useFavorites();
  const { getGig, getFreelancer } = useMarketplace();
  const { showToast } = useToast();

  const gig = getGig(id) || getGig("g1");
  const freelancer = gig ? getFreelancer(gig.freelancerId) : null;
  const saved = gig ? isSaved(gig.id) : false;

  const [activePackageTab, setActivePackageTab] = useState("standard");
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(0);
  const [selectedGalleryIdx, setSelectedGalleryIdx] = useState(0);
  const [activeGalleryTab, setActiveGalleryTab] = useState(0);
  const [reviewSearch, setReviewSearch] = useState("");
  const [reviewTagFilter, setReviewTagFilter] = useState("all");

  const packages = {
    basic: {
      name: "BASIC SPEC",
      price: 180,
      deliveryDays: 2,
      revisions: 2,
      screens: "Up to 3 Screens",
      features: [
        "Core user flow layout",
        "Responsive breakpoint stacking",
        "Source Figma file (.fig)",
        "2 Business Days delivery",
        "2 Revisions included",
      ],
    },
    standard: {
      name: "STANDARD CORE SUITE",
      price: 280,
      deliveryDays: 3,
      revisions: 4,
      screens: "4 to 8 Screens",
      recommended: true,
      features: [
        "Custom SaaS Dashboard Screens",
        "Full Responsive Breakpoints (Web + Tablet)",
        "Figma Deliverable Full Data Embedding",
        "Interactive Clickable Prototype",
        "Source File + Export Assets Kit",
      ],
    },
    premium: {
      name: "PREMIUM SUITE",
      price: 520,
      deliveryDays: 5,
      revisions: 999,
      screens: "10+ Complete Views",
      features: [
        "Full platform spec (10+ views)",
        "Design System Tokens (JSON theme schema)",
        "Interactive micro-prototype",
        "Full Responsive Breakpoints (Desktop + Mobile)",
        "Unlimited revisions during sprint",
      ],
    },
  };

  const selectedPkg = packages[activePackageTab] || packages.standard;

  async function handleSave() {
    if (!user) {
      showToast("Please log in to save specs.", "info");
      router.push("/login");
      return;
    }
    const res = await toggle(gig.id);
    if (res.ok) {
      showToast(res.saved ? "Saved spec to vault." : "Removed spec from vault.");
    }
  }

  function handleOrderClick() {
    if (!user) {
      showToast("Please log in as client to initiate escrow contract.", "info");
      router.push(`/login?next=${encodeURIComponent(`/gigs/${gig?.id || "g1"}`)}`);
      return;
    }
    setOrderModalOpen(true);
  }

  function handleContactSeller() {
    router.push(`/messages?freelancer=${freelancer?.id || "f-elena"}`);
  }

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return DEFAULT_REVIEWS.filter((rev) => {
      const matchSearch =
        !reviewSearch ||
        rev.comment.toLowerCase().includes(reviewSearch.toLowerCase()) ||
        rev.clientName.toLowerCase().includes(reviewSearch.toLowerCase());
      const matchTag =
        reviewTagFilter === "all" || rev.tags.includes(reviewTagFilter);
      return matchSearch && matchTag;
    });
  }, [reviewSearch, reviewTagFilter]);

  return (
    <div className="min-h-screen bg-[#f8f9ff] py-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb & Header Meta Strip matching Image */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e5e7eb] pb-3 font-mono text-[11px] uppercase tracking-wider text-[#6e7a73]">
          <nav className="flex items-center gap-2">
            <Link href="/gigs" className="hover:text-[#005d42]">
              GIGS
            </Link>
            <span className="text-[#6e7a73]/50">/</span>
            <Link href="/gigs?category=graphics-design" className="hover:text-[#005d42]">
              DESIGN & CREATIVE
            </Link>
            <span className="text-[#6e7a73]/50">/</span>
            <span className="text-[#0b1c30] font-semibold">UI/UX & FIGMA DESIGN</span>
            <span className="text-[#6e7a73]/50">/</span>
            <span className="text-[#6e7a73]">SPEC #9810-ER</span>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-1.5 border border-[#e5e7eb] bg-white px-2.5 py-1 text-[11px] font-bold text-[#0047bf] shadow-[1px_1px_0px_#0b1c30] hover:bg-[#eff4ff]"
            >
              <BarChart2 className="h-3 w-3" />
              SPEC ANALYTICS
            </button>
            <div className="flex items-center gap-1 border border-[#005d42] bg-[#005d42] px-2.5 py-1 text-[11px] font-bold text-white shadow-[1px_1px_0px_#0b1c30]">
              <span className="h-1.5 w-1.5 bg-[#9ffdd3]" />
              FAST ESCROW SETTLEMENT
            </div>
          </div>
        </div>

        {/* Spec Kicker Badges & Main Title */}
        <div className="mt-5">
          <div className="flex items-center gap-2 mb-2 font-mono text-[10px] font-bold uppercase tracking-wider">
            <span className="border border-[#005d42] bg-[#eff4ff] px-2 py-0.5 text-[#005d42]">
              SPEC: TECH-INT
            </span>
            <span className="border border-[#e5e7eb] bg-white px-2 py-0.5 text-[#3e4943]">
              SAAS & DESIGN SYSTEM ARCH
            </span>
          </div>

          <h1 className="font-headline text-2xl font-bold uppercase tracking-tight text-[#0b1c30] sm:text-3xl lg:text-4xl leading-tight">
            I WILL DESIGN A CONVERSION-FOCUSED SAAS DASHBOARD AND RESPONSIVE WEB APP IN FIGMA
          </h1>

          {/* Author Row with Badges and Save/Contact Actions */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-b border-[#e5e7eb] pb-4">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/freelancers/${freelancer?.id || "f-elena"}`}
                className="flex items-center gap-2 group"
              >
                <div className="h-8 w-8 border border-[#0b1c30] overflow-hidden bg-slate-100 shrink-0">
                  <SafeImage
                    src={freelancer?.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80"}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-headline text-sm font-bold text-[#0b1c30] group-hover:text-[#005d42]">
                    {freelancer?.name || "Elena Rostova"}
                  </span>
                  <span className="material-symbols-outlined text-sm text-[#005d42] leading-none">
                    check_circle
                  </span>
                </div>
              </Link>

              <span className="border border-[#005d42] bg-[#005d42] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white">
                LEVEL 2 SELLER
              </span>

              <div className="flex items-center gap-1 font-mono text-xs font-bold text-[#0b1c30]">
                <span className="text-amber-500">★</span>
                <span>4.9</span>
                <span className="font-normal text-[#6e7a73]">(248 REVIEWS)</span>
              </div>

              <span className="text-[#6e7a73]/30">|</span>
              <span className="font-mono text-xs text-[#3e4943]">3 ORDERS IN QUEUE</span>
              <span className="text-[#6e7a73]/30">|</span>
              <span className="font-mono text-xs font-semibold text-[#005d42]">EXPEDITE SLA: 24H</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1.5 border border-[#0b1c30] bg-white px-3 py-1.5 font-mono text-xs font-bold uppercase text-[#0b1c30] shadow-[2px_2px_0px_#0b1c30] hover:bg-[#eff4ff] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              >
                <Heart className={`h-3.5 w-3.5 ${saved ? "fill-[#ba1a1a] text-[#ba1a1a]" : ""}`} />
                {saved ? "SAVED" : "SAVE"}
              </button>
              <button
                type="button"
                onClick={handleContactSeller}
                className="flex items-center gap-1.5 border border-[#005d42] bg-[#005d42] px-4 py-1.5 font-mono text-xs font-bold uppercase text-white shadow-[2px_2px_0px_#0b1c30] hover:bg-[#047857] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              >
                <Mail className="h-3.5 w-3.5" />
                CONTACT SELLER
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column Split: Content (Left) + Sticky Order Box (Right) */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Left Column: Spec Details */}
          <div className="space-y-10">
            {/* Gallery Showcase Box matching screenshot */}
            <div className="border border-[#e5e7eb] bg-white p-3 shadow-[3px_3px_0px_#0b1c30]">
              {/* Category Strip Above Image */}
              <div className="mb-2.5 flex flex-wrap gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#0b1c30]">
                {[
                  "[ 01 / PYTHON & FASTAPI DASHBOARD ]",
                  "[ 02 / ADAPTIVE DARK/LIGHT THEME ]",
                  "[ 03 / 24-HOUR SLA ELIGIBILITY ]",
                ].map((tab, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveGalleryTab(idx)}
                    className={`border px-2.5 py-1 transition ${
                      activeGalleryTab === idx
                        ? "border-[#005d42] bg-[#eff4ff] text-[#005d42]"
                        : "border-[#e5e7eb] bg-white text-[#6e7a73] hover:text-[#0b1c30]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Main Image Frame */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-950 border border-[#e5e7eb]">
                <SafeImage
                  src={SHOWCASE_GALLERY[selectedGalleryIdx]}
                  alt="SaaS Spec Showcase"
                  className="h-full w-full object-cover"
                />
                <div className="absolute bottom-3 right-3">
                  <span className="border border-[#0b1c30] bg-white/95 px-3 py-1 font-mono text-[10px] font-bold text-[#0b1c30] uppercase shadow-[2px_2px_0px_#0b1c30]">
                    FULL RESOLUTION LIVE AGENCY
                  </span>
                </div>
              </div>

              {/* 5 Thumbnails */}
              <div className="mt-3 grid grid-cols-5 gap-2">
                {SHOWCASE_GALLERY.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedGalleryIdx(idx)}
                    className={`aspect-[16/10] overflow-hidden border transition ${
                      selectedGalleryIdx === idx
                        ? "border-2 border-[#005d42] shadow-[2px_2px_0px_#005d42]"
                        : "border-[#e5e7eb] opacity-70 hover:opacity-100"
                    }`}
                  >
                    <SafeImage src={imgUrl} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* MODULE 01: TECHNICAL SPECIFICATION & SCOPE */}
            <div className="border border-[#e5e7eb] bg-white p-6 sm:p-8 shadow-[3px_3px_0px_#0b1c30]">
              <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
                <h2 className="font-headline text-2xl font-bold uppercase tracking-wide text-[#0b1c30]">
                  ABOUT THIS GIG
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#6e7a73]">
                  MODULE 01: TECHNICAL SPECIFICATION & SCOPE
                </span>
              </div>

              <div className="mt-5 space-y-4 text-xs sm:text-sm leading-relaxed text-[#0b1c30]">
                <p>
                  I build enterprise-grade, conversion-first product design systems and web apps engineered specifically for scaling teams using Next.js & React. Every frame utilizes strict Auto-Layout 5.0, unified token architectures, and clean component hierarchies that your frontend team can implement in production day one, without friction.
                </p>
                <p>
                  Whether you are architecting a complex B2B analytics suite, high-retention governance console, or fintech dashboard, my deliverables guarantee zero messy layers, digitized component variants, and clear API specifications.
                </p>
              </div>

              {/* WHAT YOU WILL RECEIVE (PRODUCTION READY) */}
              <div className="mt-8 border border-[#dae2fd] bg-[#eff4ff] p-5">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0047bf] mb-4">
                  [ WHAT YOU WILL RECEIVE (PRODUCTION READY) ]
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 font-mono text-xs text-[#0b1c30]">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center bg-[#005d42] text-[10px] text-white mt-0.5">
                      ✓
                    </span>
                    <div>
                      <strong className="uppercase">MODULAR COMPONENTS (BENTO)</strong>
                      <p className="mt-0.5 text-[11px] text-[#3e4943] font-sans">
                        100+ production assets including forms, task tables, modals, and toasts.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center bg-[#005d42] text-[10px] text-white mt-0.5">
                      ✓
                    </span>
                    <div>
                      <strong className="uppercase">STRICT AUTO-LAYOUT 5.0</strong>
                      <p className="mt-0.5 text-[11px] text-[#3e4943] font-sans">
                        Fluid responsive behavior mirroring actual flexbox & CSS Grid layouts.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center bg-[#005d42] text-[10px] text-white mt-0.5">
                      ✓
                    </span>
                    <div>
                      <strong className="uppercase">VARIABLES & DESIGN TOKEN SPEC</strong>
                      <p className="mt-0.5 text-[11px] text-[#3e4943] font-sans">
                        Complete local token system structured into variables, light/dark themes, and JSON export.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center bg-[#005d42] text-[10px] text-white mt-0.5">
                      ✓
                    </span>
                    <div>
                      <strong className="uppercase">FIGMA TOKENS JSON EMBEDDING</strong>
                      <p className="mt-0.5 text-[11px] text-[#3e4943] font-sans">
                        Fully segmented JSON/W3C release for identity, typography, elevation, and palette.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 sm:col-span-2">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center bg-[#005d42] text-[10px] text-white mt-0.5">
                      ✓
                    </span>
                    <div>
                      <strong className="uppercase">DEVELOPER HANDOFF BLUEPRINTS</strong>
                      <p className="mt-0.5 text-[11px] text-[#3e4943] font-sans">
                        Redline annotations, responsive breakpoints (Desktop 1440, Tablet 768, Mobile 375), and assets export list.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* WHY WORK WITH ME */}
              <div className="mt-8 border-t border-[#e5e7eb] pt-6">
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#6e7a73] mb-4">
                  WHY WORK WITH ME
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="border border-[#e5e7eb] bg-[#eff4ff] p-4 text-center">
                    <p className="font-headline text-3xl font-bold text-[#0b1c30]">8+ YRS</p>
                    <p className="mt-1 font-mono text-[10px] font-bold uppercase text-[#0b1c30]">
                      ENTERPRISE PRODUCT EXPERIENCE
                    </p>
                    <p className="mt-1 text-[11px] text-[#3e4943]">
                      Ex-Staff UI for modern developer infrastructure companies
                    </p>
                  </div>

                  <div className="border border-[#e5e7eb] bg-[#eff4ff] p-4 text-center">
                    <p className="font-headline text-3xl font-bold text-[#005d42]">100%</p>
                    <p className="mt-1 font-mono text-[10px] font-bold uppercase text-[#0b1c30]">
                      ON-TIME SETTLING
                    </p>
                    <p className="mt-1 text-[11px] text-[#3e4943]">
                      Deterministic escrow releases without single dispute escalation
                    </p>
                  </div>

                  <div className="border border-[#e5e7eb] bg-[#eff4ff] p-4 text-center">
                    <p className="font-headline text-3xl font-bold text-[#0b1c30]">DAILY</p>
                    <p className="mt-1 font-mono text-[10px] font-bold uppercase text-[#0b1c30]">
                      ACTIVE COMMUNICATOR
                    </p>
                    <p className="mt-1 text-[11px] text-[#3e4943]">
                      Direct Slack/Loom reviews on every milestone sprint iteration
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* MODULE 02: IDENTITY SPECIFICATION - COMPARE PACKAGES */}
            <div className="border border-[#e5e7eb] bg-white p-6 sm:p-8 shadow-[3px_3px_0px_#0b1c30]">
              <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
                <h2 className="font-headline text-2xl font-bold uppercase tracking-wide text-[#0b1c30]">
                  COMPARE PACKAGES
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#6e7a73]">
                  MODULE 02: IDENTITY SPECIFICATION
                </span>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full border-collapse font-mono text-xs">
                  <thead>
                    <tr className="border-b border-[#0b1c30] text-left">
                      <th className="p-3 text-[#6e7a73] font-normal w-1/4">TECHNICAL SPECIFICATION</th>
                      <th className="p-3 font-bold text-[#0b1c30] border-l border-[#e5e7eb] w-1/4">
                        BASIC TIER
                        <p className="text-base font-headline font-bold text-[#0b1c30] mt-0.5">$180</p>
                      </th>
                      <th className="p-3 font-bold text-[#005d42] border-x border-[#005d42] bg-[#eff4ff] w-1/4">
                        STANDARD (RECOMMENDED)
                        <p className="text-base font-headline font-bold text-[#005d42] mt-0.5">$280</p>
                      </th>
                      <th className="p-3 font-bold text-[#0b1c30] border-r border-[#e5e7eb] w-1/4">
                        PREMIUM SUITE
                        <p className="text-base font-headline font-bold text-[#0b1c30] mt-0.5">$520</p>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5e7eb] text-[#0b1c30]">
                    <tr>
                      <td className="p-3 font-semibold">Delivery Time</td>
                      <td className="p-3 border-l border-[#e5e7eb]">2 Business Days</td>
                      <td className="p-3 border-x border-[#005d42] bg-[#eff4ff] font-semibold text-[#005d42]">
                        3 Business Days
                      </td>
                      <td className="p-3 border-r border-[#e5e7eb]">5 Business Days</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Number of Screens</td>
                      <td className="p-3 border-l border-[#e5e7eb]">Up to 3 Screens</td>
                      <td className="p-3 border-x border-[#005d42] bg-[#eff4ff] font-semibold text-[#005d42]">
                        4 to 8 Screens
                      </td>
                      <td className="p-3 border-r border-[#e5e7eb]">10+ Complete Views</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Responsive/Device Mockups (Desktop + Mobile)</td>
                      <td className="p-3 border-l border-[#e5e7eb] text-[#005d42]">✓ Included</td>
                      <td className="p-3 border-x border-[#005d42] bg-[#eff4ff] font-semibold text-[#005d42]">
                        ✓ Included
                      </td>
                      <td className="p-3 border-r border-[#e5e7eb] text-[#005d42]">✓ Included</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Source Figma File (.fig)</td>
                      <td className="p-3 border-l border-[#e5e7eb] text-[#005d42]">✓ Included</td>
                      <td className="p-3 border-x border-[#005d42] bg-[#eff4ff] font-semibold text-[#005d42]">
                        ✓ Included
                      </td>
                      <td className="p-3 border-r border-[#e5e7eb] text-[#005d42]">✓ Included</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Interactive Micro-Prototype</td>
                      <td className="p-3 border-l border-[#e5e7eb] text-[#6e7a73]">—</td>
                      <td className="p-3 border-x border-[#005d42] bg-[#eff4ff] font-semibold text-[#005d42]">
                        ✓ Included
                      </td>
                      <td className="p-3 border-r border-[#e5e7eb] text-[#005d42]">✓ Included</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Design System Tokens (JSON)</td>
                      <td className="p-3 border-l border-[#e5e7eb] text-[#6e7a73]">—</td>
                      <td className="p-3 border-x border-[#005d42] bg-[#eff4ff] text-[#6e7a73]">—</td>
                      <td className="p-3 border-r border-[#e5e7eb] text-[#005d42]">✓ Included</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Revisions Included</td>
                      <td className="p-3 border-l border-[#e5e7eb]">2 Revisions</td>
                      <td className="p-3 border-x border-[#005d42] bg-[#eff4ff] font-semibold text-[#005d42]">
                        4 Revisions
                      </td>
                      <td className="p-3 border-r border-[#e5e7eb]">Unlimited</td>
                    </tr>
                    <tr className="border-t border-[#0b1c30]">
                      <td className="p-3" />
                      <td className="p-3 border-l border-[#e5e7eb]">
                        <button
                          type="button"
                          onClick={() => {
                            setActivePackageTab("basic");
                            handleOrderClick();
                          }}
                          className="w-full border border-[#0b1c30] bg-white py-2 font-mono text-xs font-bold uppercase text-[#0b1c30] shadow-[2px_2px_0px_#0b1c30] hover:bg-[#eff4ff] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                        >
                          SELECT BASIC
                        </button>
                      </td>
                      <td className="p-3 border-x border-b border-[#005d42] bg-[#eff4ff]">
                        <button
                          type="button"
                          onClick={() => {
                            setActivePackageTab("standard");
                            handleOrderClick();
                          }}
                          className="w-full bg-[#005d42] py-2 font-mono text-xs font-bold uppercase text-white shadow-[2px_2px_0px_#0b1c30] hover:bg-[#047857] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                        >
                          SELECT STANDARD
                        </button>
                      </td>
                      <td className="p-3 border-r border-[#e5e7eb]">
                        <button
                          type="button"
                          onClick={() => {
                            setActivePackageTab("premium");
                            handleOrderClick();
                          }}
                          className="w-full border border-[#0b1c30] bg-white py-2 font-mono text-xs font-bold uppercase text-[#0b1c30] shadow-[2px_2px_0px_#0b1c30] hover:bg-[#eff4ff] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                        >
                          SELECT PREMIUM
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* MODULE 03: VERIFIED PERFORMANCE MATRIX - REVIEWS */}
            <div className="border border-[#e5e7eb] bg-white p-6 sm:p-8 shadow-[3px_3px_0px_#0b1c30]">
              <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
                <h2 className="font-headline text-2xl font-bold uppercase tracking-wide text-[#0b1c30]">
                  CLIENT VERIFICATION & REVIEWS
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#6e7a73]">
                  MODULE 03: VERIFIED PERFORMANCE MATRIX
                </span>
              </div>

              {/* Rating Summary & Breakdown Bars matching image */}
              <div className="mt-6 grid gap-6 sm:grid-cols-[160px_1fr]">
                <div className="text-center sm:text-left">
                  <p className="font-headline text-5xl font-bold text-[#0b1c30]">4.9</p>
                  <div className="mt-1 flex items-center justify-center sm:justify-start gap-1 text-amber-500 text-sm">
                    ★★★★★
                  </div>
                  <p className="mt-1 font-mono text-[10px] uppercase text-[#6e7a73]">
                    248 VERIFIED SYSTEM REVIEWS
                  </p>
                </div>

                {/* Percentage Bars */}
                <div className="space-y-1.5 font-mono text-xs">
                  {[
                    ["5 ★", "w-[92%]", "92%"],
                    ["4 ★", "w-[6%]", "6%"],
                    ["3 ★", "w-[1%]", "1%"],
                    ["2 ★", "w-[0%]", "0%"],
                    ["1 ★", "w-[1%]", "1%"],
                  ].map(([stars, width, pct]) => (
                    <div key={stars} className="flex items-center gap-2">
                      <span className="w-8 text-[#6e7a73] font-bold">{stars}</span>
                      <div className="h-2 flex-1 bg-[#eff4ff] border border-[#e5e7eb]">
                        <div className={`h-full bg-[#005d42] ${width}`} />
                      </div>
                      <span className="w-8 text-right text-[#6e7a73]">{pct}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Search & Filter bar matching screenshot */}
              <div className="mt-8 flex flex-wrap gap-2 border-b border-[#e5e7eb] pb-4">
                <div className="flex flex-1 items-center border border-[#6e7a73] bg-white px-3 py-1.5 min-w-[200px]">
                  <Search className="h-3.5 w-3.5 text-[#6e7a73] mr-2" />
                  <input
                    type="text"
                    value={reviewSearch}
                    onChange={(e) => setReviewSearch(e.target.value)}
                    placeholder="Search verified client reviews..."
                    className="w-full font-mono text-xs text-[#0b1c30] placeholder:text-[#6e7a73] focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setReviewSearch("");
                    setReviewTagFilter("all");
                  }}
                  className={`border px-3 py-1.5 font-mono text-[11px] font-bold uppercase transition ${
                    reviewTagFilter === "all" && !reviewSearch
                      ? "border-[#0b1c30] bg-[#0b1c30] text-white"
                      : "border-[#e5e7eb] bg-white text-[#0b1c30] hover:bg-[#eff4ff]"
                  }`}
                >
                  Reset
                </button>
                {["component library", "design system", "speed"].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setReviewTagFilter(tag)}
                    className={`border px-3 py-1.5 font-mono text-[11px] capitalize transition ${
                      reviewTagFilter === tag
                        ? "border-[#005d42] bg-[#005d42] text-white font-bold"
                        : "border-[#e5e7eb] bg-white text-[#3e4943] hover:bg-[#eff4ff]"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Verified Review Cards */}
              <div className="mt-6 space-y-6">
                {filteredReviews.map((rev) => (
                  <div key={rev.id} className="border border-[#e5e7eb] bg-[#f8f9ff] p-5 shadow-[2px_2px_0px_#0b1c30]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center border border-[#0b1c30] bg-[#0047bf] font-mono text-xs font-bold text-white">
                          {rev.clientName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#0b1c30]">{rev.clientName}</span>
                            <span className="border border-[#dae2fd] bg-[#eff4ff] px-1.5 font-mono text-[9px] font-bold text-[#0047bf]">
                              {rev.clientRole}
                            </span>
                            <span className="border border-[#005d42] bg-[#005d42] px-1.5 font-mono text-[9px] font-bold text-white">
                              {rev.clientBadge}
                            </span>
                          </div>
                          <p className="font-mono text-[10px] text-[#6e7a73] mt-0.5">
                            {rev.timeAgo} · {rev.packageUsed}
                          </p>
                        </div>
                      </div>
                      <div className="text-right font-mono text-xs text-amber-500">
                        ★★★★★
                      </div>
                    </div>

                    <p className="mt-3 text-xs leading-relaxed text-[#0b1c30]">
                      "{rev.comment}"
                    </p>

                    {/* Nested Seller Response */}
                    {rev.reply && (
                      <div className="mt-3 border-l-2 border-[#005d42] bg-white p-3 pl-4">
                        <p className="font-mono text-[10px] font-bold uppercase text-[#005d42]">
                          ↳ {rev.replyAuthor}
                        </p>
                        <p className="mt-1 text-xs text-[#3e4943]">
                          "{rev.reply}"
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* MODULE 04: CONTRACT COMPLIANCE - FREQUENTLY ASKED QUESTIONS */}
            <div className="border border-[#e5e7eb] bg-white p-6 sm:p-8 shadow-[3px_3px_0px_#0b1c30]">
              <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
                <h2 className="font-headline text-2xl font-bold uppercase tracking-wide text-[#0b1c30]">
                  FREQUENTLY ASKED QUESTIONS
                </h2>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#6e7a73]">
                  MODULE 04: CONTRACT COMPLIANCE
                </span>
              </div>
              <div className="mt-6 divide-y divide-[#e5e7eb]">
                {FAQS.map((faq, idx) => {
                  const isOpen = expandedFaq === idx;
                  return (
                    <div key={idx} className="py-4">
                      <button
                        type="button"
                        onClick={() => setExpandedFaq(isOpen ? -1 : idx)}
                        className="flex w-full items-center justify-between text-left text-xs sm:text-sm font-bold text-[#0b1c30]"
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
            {/* Box 1: Package Selector Card matching image */}
            <div className="border border-[#e5e7eb] bg-white p-6 shadow-[3px_3px_0px_#0b1c30]">
              {/* Package Tab Buttons */}
              <div className="grid grid-cols-3 border border-[#0b1c30] font-mono text-[11px] font-bold text-center">
                <button
                  type="button"
                  onClick={() => setActivePackageTab("basic")}
                  className={`py-2 transition-colors ${
                    activePackageTab === "basic"
                      ? "bg-[#005d42] text-white"
                      : "bg-white text-[#0b1c30] hover:bg-[#eff4ff]"
                  }`}
                >
                  BASIC $180
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
                  STANDARD $280
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
                  PREMIUM $520
                </button>
              </div>

              {/* Selected Tier Title & Price */}
              <div className="mt-5 flex items-baseline justify-between border-b border-[#e5e7eb] pb-3">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b1c30]">
                  {selectedPkg.name}
                </h3>
                <span className="font-headline text-3xl font-bold text-[#0b1c30]">
                  ${selectedPkg.price}
                </span>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-[#3e4943]">
                Complete UI environment for {selectedPkg.screens} with responsive layout, handoff specs and interactive prototype.
              </p>

              {/* Delivery & Revisions row matching screenshot */}
              <div className="mt-4 flex items-center justify-between border-y border-[#e5e7eb] py-2.5 font-mono text-xs text-[#0b1c30]">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#005d42]" /> {selectedPkg.deliveryDays} Business Days
                </span>
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="h-3.5 w-3.5 text-[#005d42]" /> {selectedPkg.revisions} Iteration Rounds
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
                className="mt-6 flex h-12 w-full items-center justify-center gap-2 bg-[#005d42] font-mono text-xs font-bold uppercase tracking-wider text-white shadow-[2px_2px_0px_#0b1c30] hover:bg-[#047857] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
              >
                CONTINUE (${selectedPkg.price}) →
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

              {/* Reassurance Notice matching screenshot */}
              <div className="mt-5 border border-[#dae2fd] bg-[#eff4ff] p-2.5 text-center font-mono text-[10px] text-[#0047bf]">
                🛡️ 100% ESCROW PROTECTION // DETERMINISTIC PROTOCOL
              </div>
            </div>

            {/* Box 2: Verified Talent Profile Card matching screenshot */}
            <div className="border border-[#e5e7eb] bg-white p-6 shadow-[3px_3px_0px_#0b1c30]">
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#6e7a73] font-bold border-b border-[#e5e7eb] pb-2">
                VERIFIED TALENT SPECIFICATION
              </p>

              <div className="mt-4 flex items-center gap-3">
                <div className="h-12 w-12 border border-[#0b1c30] overflow-hidden bg-slate-100 shrink-0">
                  <SafeImage
                    src={freelancer?.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <Link
                    href={`/freelancers/${freelancer?.id || "f-elena"}`}
                    className="font-headline text-sm font-bold text-[#0b1c30] hover:text-[#005d42]"
                  >
                    {freelancer?.name || "Elena Rostova"}
                  </Link>
                  <p className="font-mono text-xs text-[#3e4943]">Design Systems Specialist</p>
                  <p className="mt-0.5 font-mono text-[10px] font-bold text-[#005d42]">
                    🟢 ACTIVE IN WORKSPACE
                  </p>
                </div>
              </div>

              <div className="mt-4 border-t border-[#e5e7eb] pt-3 space-y-2 font-mono text-xs text-[#3e4943]">
                <div className="flex justify-between">
                  <span className="text-[#6e7a73]">LOCATION</span>
                  <span className="text-[#0b1c30] font-semibold">San Francisco, USA 🇺🇸</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6e7a73]">MEMBER SINCE</span>
                  <span className="text-[#0b1c30] font-semibold">October 2021</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6e7a73]">AVG. RESPONSE TIME</span>
                  <span className="text-[#0b1c30] font-semibold">1 Hour</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6e7a73]">LAST CONTRACT</span>
                  <span className="text-[#0b1c30] font-semibold">3 Hours Ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6e7a73]">TOTAL ESCROW CLEARED</span>
                  <span className="text-[#005d42] font-bold">Phase I: $142,000</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleContactSeller}
                className="mt-5 w-full border border-[#dae2fd] bg-[#eff4ff] py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-[#0047bf] shadow-[2px_2px_0px_#0b1c30] hover:bg-[#dce9ff] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
              >
                ✉ CONTACT ELENA
              </button>
            </div>

            {/* Box 3: Escrow Protocol Box matching screenshot */}
            <div className="border border-[#e5e7eb] bg-[#eff4ff] p-5 shadow-[3px_3px_0px_#0b1c30]">
              <div className="flex items-center gap-2 text-[#005d42] font-mono text-xs font-bold uppercase">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>GIGCRAFT ESCROW V4.2</span>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-[#3e4943]">
                Contract funds are locked into bilateral escrow accounts (multisig) until you inspect and approve the crypto file and prototype deliverables.
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
