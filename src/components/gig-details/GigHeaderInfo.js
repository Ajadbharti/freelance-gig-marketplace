"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Share2, ShieldCheck, Sparkles, Star } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

export default function GigHeaderInfo({
  title = "I will design a modern and professional business logo",
  freelancer = {
    name: "Elena Rostova",
    title: "Senior Brand Identity Designer & Art Director",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    initials: "ER",
    level: "Top Rated Pro",
    rating: 4.9,
    reviewsCount: 284,
    ordersInQueue: 4,
  },
  tags = ["Logo Design", "Minimalist Logo", "Brand Identity", "Vector Graphics", "Corporate Identity"],
}) {
  const { showToast } = useToast();
  const [isSaved, setIsSaved] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(1420);

  function handleToggleSave() {
    setIsSaved((prev) => !prev);
    setFavoritesCount((prev) => (isSaved ? prev - 1 : prev + 1));
    showToast(
      isSaved ? "Removed from your saved gigs." : "Saved to your favorites list!",
      isSaved ? "info" : "success"
    );
  }

  function handleShare() {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      showToast("Gig link copied to clipboard!", "success");
    }
  }

  return (
    <div className="space-y-4">
      {/* Category Tag & Queue Status */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50/80 px-3 py-1 text-xs font-semibold text-violet-700">
          <Sparkles className="w-3.5 h-3.5 text-violet-600" />
          <span>Graphics &amp; Design · Logo Design</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Save / Favorite Button */}
          <button
            type="button"
            onClick={handleToggleSave}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
              isSaved
                ? "bg-rose-50 border-rose-200 text-rose-600"
                : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:text-rose-600"
            }`}
            aria-label="Save this gig"
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-rose-500 text-rose-500" : ""}`} />
            <span>{isSaved ? "Saved" : "Save"}</span>
            <span className="text-slate-400">({favoritesCount})</span>
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:border-slate-300 hover:text-violet-600 transition cursor-pointer"
            aria-label="Share this gig"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {/* Main Gig Headline */}
      <h1 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 leading-snug">
        {title}
      </h1>

      {/* Freelancer Meta Row */}
      <div className="flex flex-wrap items-center gap-4 pt-1 pb-2 border-b border-slate-200/80 text-xs sm:text-sm">
        {/* Freelancer Profile Pill */}
        <div className="flex items-center gap-2.5">
          <div className="relative h-10 w-10 shrink-0">
            <img
              src={freelancer.avatar}
              alt={freelancer.name}
              className="h-full w-full rounded-full object-cover border border-slate-200 shadow-2xs"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling?.classList.remove("hidden");
              }}
            />
            <div className="hidden h-full w-full rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center">
              {freelancer.initials || "ER"}
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white"
              title="Verified Pro"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 hover:text-violet-600 transition">
                {freelancer.name}
              </span>
              <span className="rounded-md bg-amber-50 px-2 py-0.5 font-sans text-[11px] font-bold text-amber-700 border border-amber-200/70">
                {freelancer.level}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              {freelancer.title}
            </p>
          </div>
        </div>

        <div className="hidden sm:block h-4 w-px bg-slate-200" />

        {/* Rating & Reviews */}
        <div className="flex items-center gap-1.5">
          <div className="flex text-amber-400">
            <Star className="w-4 h-4 fill-amber-400" />
          </div>
          <span className="font-bold text-slate-900">{freelancer.rating}</span>
          <span className="text-slate-500 underline decoration-slate-300">
            ({freelancer.reviewsCount} reviews)
          </span>
        </div>

        <div className="hidden sm:block h-4 w-px bg-slate-200" />

        {/* Active Orders in Queue */}
        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{freelancer.ordersInQueue} orders in queue</span>
        </div>
      </div>

      {/* Tags Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-violet-50 hover:text-violet-700 transition cursor-default"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}
