"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useToast } from "@/components/ui/ToastProvider";
import SafeImage from "@/components/ui/SafeImage";
import { formatPrice } from "@/lib/utils";

export default function GigCard({ gig }) {
  const router = useRouter();
  const { user } = useAuth();
  const { getFreelancer, getGigRating } = useMarketplace();
  const { isSaved, toggle } = useFavorites();
  const { showToast } = useToast();

  const freelancer = getFreelancer(gig.freelancerId);
  const ratingData = getGigRating(gig.id);
  const avgRating = ratingData.average || gig.rating || 5.0;
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

  const tier = (gig.tier || freelancer?.tier || "TOP RATED").toUpperCase();

  const tierBadgeStyle =
    tier === "PRO VERIFIED"
      ? "bg-[#005d42] text-white border-[#005d42]"
      : tier === "RISING TALENT"
      ? "bg-[#0047bf] text-white border-[#0047bf]"
      : "bg-[#0b1c30] text-white border-[#0b1c30]";

  const deliveryText =
    gig.deliveryBadge ||
    (gig.deliveryDays === 1 ? "24H EXPRESS" : `${gig.deliveryDays}-DAY DELIVERY`);

  return (
    <article className="group flex flex-col border border-[#e5e7eb] bg-white shadow-[3px_3px_0px_#0b1c30] transition hover:border-[#0b1c30]">
      {/* Top Image Box */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 border-b border-[#e5e7eb]">
        {/* Tier Badge Top Left */}
        <div className={`absolute left-2.5 top-2.5 z-10 border px-2 py-0.5 ${tierBadgeStyle}`}>
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
            {tier}
          </span>
        </div>

        {/* Heart Top Right: White square with black border */}
        <button
          type="button"
          onClick={handleSave}
          aria-label={saved ? "Remove from saved" : "Save spec"}
          className="absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center border border-[#0b1c30] bg-white text-[#0b1c30] transition hover:bg-[#eff4ff]"
        >
          <Heart className={`h-4 w-4 ${saved ? "fill-[#ba1a1a] text-[#ba1a1a]" : "text-[#0b1c30]"}`} />
        </button>

        {/* Main Image */}
        <Link href={`/gigs/${gig.id}`} className="block h-full w-full">
          <SafeImage
            src={gig.image}
            alt={gig.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-102"
          />
        </Link>

        {/* Delivery Bar at Bottom Left of Image */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5 border border-[#0b1c30] bg-white px-2 py-0.5">
          <Zap className="h-3 w-3 text-[#005d42] fill-[#005d42]" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#0b1c30]">
            {deliveryText}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-4">
        {/* Author & Rating Row */}
        <div className="flex items-center justify-between">
          <Link
            href={`/freelancers/${freelancer?.id || "f-elena"}`}
            className="flex items-center gap-2 group/author min-w-0"
          >
            {/* Square Avatar matching screenshot */}
            <div className="h-6 w-6 shrink-0 overflow-hidden border border-[#0b1c30] bg-[#eff4ff]">
              {freelancer?.avatar ? (
                <SafeImage
                  src={freelancer.avatar}
                  alt={freelancer?.name || "Specialist"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-headline text-[10px] font-bold text-[#0047bf]">
                  {freelancer?.initials || "SP"}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 min-w-0">
              <span className="truncate text-xs font-bold text-[#0b1c30] group-hover/author:text-[#005d42]">
                {freelancer?.name || "Elena Rostova"}
              </span>
              <span className="material-symbols-outlined text-[13px] text-[#005d42] leading-none shrink-0">
                check_circle
              </span>
            </div>
          </Link>

          {reviewCount > 0 ? (
            <div className="flex items-center gap-1 font-mono text-xs font-bold shrink-0">
              <span className="text-amber-500">★</span>
              <span className="text-[#0b1c30]">{Number(avgRating).toFixed(1)}</span>
              <span className="font-normal text-[#6e7a73]">({reviewCount})</span>
            </div>
          ) : (
            <span className="font-mono text-[11px] font-bold text-[#6e7a73] uppercase shrink-0">
              NEW
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={`/gigs/${gig.id}`} className="mt-2.5 block">
          <h3 className="line-clamp-2 font-headline text-base font-bold leading-snug text-[#0b1c30] transition group-hover:text-[#005d42]">
            {gig.title}
          </h3>
        </Link>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(gig.skills?.slice(0, 3) || gig.tags?.slice(0, 3) || []).map((s) => (
            <span
              key={s}
              className="border border-[#dae2fd] bg-[#eff4ff] px-2 py-0.5 font-mono text-[11px] text-[#0047bf]"
            >
              {s}
            </span>
          ))}
        </div>

        {/* Footer: Price + Inspect Spec */}
        <div className="mt-auto flex items-center justify-between border-t border-[#e5e7eb] pt-3.5">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-[#6e7a73] font-semibold">
              STARTING AT
            </p>
            <p className="font-headline text-xl font-bold text-[#0b1c30]">
              {formatPrice(gig.price)}
            </p>
          </div>
          <Link
            href={`/gigs/${gig.id}`}
            className="px-3.5 py-1.5 bg-[#005d42] text-white border border-[#005d42] font-semibold text-xs uppercase tracking-wide hover:bg-[#047857] shadow-[2px_2px_0px_#0b1c30] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            INSPECT SPEC
          </Link>
        </div>
      </div>
    </article>
  );
}
