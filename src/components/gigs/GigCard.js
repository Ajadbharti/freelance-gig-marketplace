"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Clock } from "lucide-react";
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
  const avgRating = ratingData.average || gig.rating || null;
  const reviewCount = ratingData.count || gig.reviewsCount || 0;
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

  const tier = gig.tier || freelancer?.tier || "RISING TALENT";

  return (
    <article className="group flex flex-col border border-slate-300 bg-white transition hover:border-slate-900 hover:shadow-[3px_3px_0px_#0b1c30]">
      {/* Top Image Box */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 border-b border-slate-200">
        {/* Tier Badge Top Left: White box with crisp black border */}
        <div className="absolute left-2.5 top-2.5 z-10 border border-slate-900 bg-white px-2 py-0.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-950">
            {tier}
          </span>
        </div>

        {/* Heart Top Right: White square with black border */}
        <button
          type="button"
          onClick={handleSave}
          aria-label={saved ? "Remove from saved" : "Save spec"}
          className="absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center border border-slate-900 bg-white text-slate-900 transition hover:bg-slate-50"
        >
          <Heart className={`h-4 w-4 ${saved ? "fill-rose-500 text-rose-500" : ""}`} />
        </button>

        {/* Main Image */}
        <Link href={`/gigs/${gig.id}`} className="block h-full w-full">
          <SafeImage
            src={gig.image}
            alt={gig.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-102"
          />
        </Link>

        {/* Delivery Bar at Bottom Left of Image: White box with border, green clock */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 border border-slate-900 bg-white px-2 py-0.5">
          <Clock className="h-3.5 w-3.5 text-[#047857]" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-950">
            {gig.deliveryDays}-DAY DELIVERY
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-4">
        {/* Author & Rating Row */}
        <div className="flex items-center justify-between">
          <Link
            href={`/freelancers/${freelancer?.id || "f-ajju"}`}
            className="flex items-center gap-2 group/author min-w-0"
          >
            {/* Square Initials Avatar matching screenshot */}
            <div className="flex h-6 w-6 shrink-0 items-center justify-center border border-slate-300 bg-[#e0e7ff] font-headline text-[11px] font-bold text-[#3730a3]">
              {freelancer?.initials || "AK"}
            </div>
            <span className="truncate text-xs font-bold text-slate-950 group-hover/author:text-[#047857]">
              {freelancer?.name || "Ajju Kumar"}
            </span>
          </Link>
          <div className="flex items-center gap-1 font-mono text-xs font-bold shrink-0">
            {avgRating && reviewCount > 0 ? (
              <>
                <span className="text-amber-500">★</span>
                <span className="text-slate-900">{Number(avgRating).toFixed(1)}</span>
                <span className="font-normal text-slate-400">({reviewCount})</span>
              </>
            ) : (
              <span className="font-mono text-xs font-bold text-slate-500 uppercase">NEW</span>
            )}
          </div>
        </div>

        {/* Title */}
        <Link href={`/gigs/${gig.id}`} className="mt-2.5 block">
          <h3 className="line-clamp-2 font-headline text-base font-bold leading-snug text-slate-950 transition group-hover:text-[#047857]">
            {gig.title}
          </h3>
        </Link>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(gig.skills?.slice(0, 3) || gig.tags?.slice(0, 3) || []).map((s) => (
            <span
              key={s}
              className="border border-[#c7d2fe] bg-[#eef2ff] px-2 py-0.5 font-mono text-[11px] text-[#3730a3]"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Footer: Price + Inspect Spec */}
        <div className="mt-auto flex items-center justify-between border-t border-slate-200 pt-3.5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-semibold">STARTING AT</p>
            <p className="font-headline text-xl font-bold text-slate-950">₹{gig.price?.toLocaleString("en-IN")}</p>
          </div>
          <Link
            href={`/gigs/${gig.id}`}
            className="bg-[#047857] px-3.5 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#065f46]"
          >
            INSPECT SPEC
          </Link>
        </div>
      </div>
    </article>
  );
}
