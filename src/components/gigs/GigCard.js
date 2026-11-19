"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useToast } from "@/components/ui/ToastProvider";
import SafeImage from "@/components/ui/SafeImage";

export default function GigCard({ gig }) {
  const router = useRouter();
  const { user } = useAuth();
  const { getFreelancer, getGigRating } = useMarketplace();
  const { isSaved, toggle } = useFavorites();
  const { showToast } = useToast();

  const freelancer = getFreelancer(gig.freelancerId);
  const ratingData = getGigRating(gig.id);
  const avgRating = ratingData.average || gig.rating || 5.0;
  const reviewCount = ratingData.count || gig.reviewsCount || 100;
  const saved = isSaved(gig.id);

  async function handleSave(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      showToast("Please log in to save specs.", "info");
      router.push("/login");
      return;
    }
    const result = await toggle(gig.id);
    if (result.ok) {
      showToast(result.saved ? "Saved spec to vault." : "Removed spec from vault.");
    }
  }

  const tier = gig.tier || freelancer?.tier || "VERIFIED";
  const tierColor =
    tier === "TOP RATED"
      ? "bg-slate-950 text-white"
      : tier === "PRO VERIFIED"
      ? "bg-[#047857] text-white"
      : tier === "RISING TALENT"
      ? "bg-blue-700 text-white"
      : "bg-slate-700 text-white";

  const deliveryBadge = gig.deliveryBadge || `⚡ ${gig.deliveryDays}-DAY DELIVERY`;

  return (
    <div className="group flex flex-col border border-slate-200 bg-white transition hover:border-[#0F172A] hover:shadow-[3px_3px_0px_#0F172A]">
      {/* Top Image Box */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        {/* Tier Badge Top Left */}
        <div className="absolute left-2.5 top-2.5 z-10">
          <span className={`px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${tierColor}`}>
            {tier}
          </span>
        </div>

        {/* Heart Top Right */}
        <button
          type="button"
          onClick={handleSave}
          aria-label={saved ? "Remove from saved" : "Save spec"}
          className="absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded bg-white/90 text-slate-700 shadow-sm transition hover:bg-white hover:text-rose-600"
        >
          <Heart className={`h-4 w-4 ${saved ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>

        {/* Main Image */}
        <Link href={`/gigs/${gig.id}`}>
          <SafeImage
            src={gig.image}
            alt={gig.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-102"
          />
        </Link>

        {/* Delivery Bar at Bottom of Image */}
        <div className="absolute bottom-0 inset-x-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-slate-800">
          {deliveryBadge}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-4">
        {/* Author & Rating Row */}
        <div className="flex items-center justify-between">
          <Link
            href={`/freelancers/${freelancer?.id || "f1"}`}
            className="flex items-center gap-2 group/author"
          >
            <SafeImage
              src={freelancer?.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80"}
              alt=""
              className="h-6 w-6 rounded-full object-cover"
            />
            <span className="truncate text-xs font-semibold text-slate-900 group-hover/author:text-[#047857]">
              {freelancer?.name || "Ananya Sharma"} <span className="text-[#047857]">✓</span>
            </span>
          </Link>
          <div className="flex items-center gap-1 font-mono text-xs font-bold text-slate-800">
            <span className="text-amber-500">★</span>
            <span>{Number(avgRating).toFixed(1)}</span>
            <span className="font-normal text-slate-400">({reviewCount})</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/gigs/${gig.id}`} className="mt-3 block">
          <h3 className="line-clamp-2 font-sans text-sm font-bold leading-snug text-slate-950 transition group-hover:text-[#047857]">
            {gig.title}
          </h3>
        </Link>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(gig.skills?.slice(0, 3) || ["Figma", "UI/UX", "SaaS"]).map((s) => (
            <span
              key={s}
              className="border border-slate-200 bg-[#FAFAFA] px-2 py-0.5 font-mono text-[10px] text-slate-600"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Footer: Price + Inspect Spec */}
        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3.5">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-wider text-slate-400">STARTING AT</p>
            <p className="font-mono text-base font-bold text-slate-950">₹{gig.price?.toLocaleString("en-IN")}</p>
          </div>
          <Link
            href={`/gigs/${gig.id}`}
            className="bg-[#047857] px-3.5 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#065f46]"
          >
            INSPECT SPEC
          </Link>
        </div>
      </div>
    </div>
  );
}
