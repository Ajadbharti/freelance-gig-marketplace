"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Eye, Heart, MessageSquare, Star, Trash2 } from "lucide-react";

export default function SavedGigCard({
  gig,
  onRemove,
  onContact,
}) {
  const [isRemoving, setIsRemoving] = useState(false);

  function handleRemoveClick(e) {
    e.preventDefault();
    e.stopPropagation();
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(gig.id);
    }, 200);
  }

  function handleContactClick(e) {
    e.preventDefault();
    e.stopPropagation();
    onContact(gig);
  }

  return (
    <div
      className={`group rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:shadow-xl hover:shadow-violet-500/5 hover:border-violet-300 transition-all duration-200 flex flex-col justify-between ${
        isRemoving ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      <div>
        {/* Top: Cover Image & Badges */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
          <img
            src={gig.cover}
            alt={gig.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Category Badge */}
          <span className="absolute top-3 left-3 rounded-full bg-slate-950/70 backdrop-blur-md px-3 py-1 text-[10px] font-mono font-bold tracking-wider text-white uppercase shadow-xs">
            {gig.category}
          </span>

          {/* Heart Button (Remove from Saved) */}
          <button
            type="button"
            onClick={handleRemoveClick}
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-rose-500 backdrop-blur-md shadow-md hover:bg-white hover:scale-110 active:scale-95 transition cursor-pointer"
            title="Remove from saved gigs"
            aria-label="Remove from saved gigs"
          >
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-3">
          
          {/* Freelancer Header */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={gig.freelancer.avatar}
                alt={gig.freelancer.name}
                className="h-7 w-7 rounded-full object-cover border border-slate-200 shrink-0"
              />
              <div className="min-w-0">
                <span className="font-sans text-xs font-bold text-slate-800 truncate block">
                  {gig.freelancer.name}
                </span>
                <span className="text-[10px] font-mono text-slate-400 block truncate">
                  {gig.freelancer.level}
                </span>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 text-xs shrink-0 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 text-amber-900 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{gig.rating.toFixed(1)}</span>
              <span className="text-[10px] text-amber-700 font-normal">({gig.reviewsCount})</span>
            </div>
          </div>

          {/* Gig Title */}
          <Link
            href={gig.link || `/gigs/details`}
            className="block font-headline text-sm font-bold text-slate-900 leading-snug line-clamp-2 hover:text-violet-600 transition"
          >
            {gig.title}
          </Link>

          {/* Short Description */}
          <p className="font-sans text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {gig.description}
          </p>

          {/* Delivery & Starting Price Bar */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <span className="flex items-center gap-1.5 text-slate-500 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{gig.deliveryTime}</span>
            </span>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 font-sans block leading-none">
                Starting at
              </span>
              <span className="font-headline text-base font-extrabold text-violet-900 leading-none">
                ${gig.startingPrice}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Card Action Buttons Footer */}
      <div className="p-4 pt-0 grid grid-cols-2 gap-2">
        <Link
          href={gig.link || `/gigs/details`}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Details</span>
        </Link>

        <button
          type="button"
          onClick={handleContactClick}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
          <span>Contact</span>
        </button>
      </div>

    </div>
  );
}
