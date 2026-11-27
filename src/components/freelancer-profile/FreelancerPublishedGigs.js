"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Clock, Heart, Star } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

const PUBLISHED_GIGS = [
  {
    id: "gig-alex-1",
    title: "I will develop a modern full-stack web application with Next.js, Node and Tailwind",
    category: "Web Development",
    cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=700&q=80",
    rating: 5.0,
    reviewsCount: 94,
    startingPrice: 120,
    deliveryDays: 3,
  },
  {
    id: "gig-alex-2",
    title: "I will build a high-performance REST and GraphQL API backend with Express and MongoDB",
    category: "Backend Development",
    cover: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=700&q=80",
    rating: 4.9,
    reviewsCount: 52,
    startingPrice: 80,
    deliveryDays: 2,
  },
  {
    id: "gig-alex-3",
    title: "I will convert your Figma design into pixel-perfect responsive React and Tailwind code",
    category: "Frontend & UI",
    cover: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=700&q=80",
    rating: 5.0,
    reviewsCount: 38,
    startingPrice: 65,
    deliveryDays: 1,
  },
];

export default function FreelancerPublishedGigs() {
  const { showToast } = useToast();
  const [favorites, setFavorites] = useState({});

  function toggleFavorite(e, id) {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => {
      const next = !prev[id];
      showToast(next ? "Saved to your favorites!" : "Removed from favorites.", next ? "success" : "info");
      return { ...prev, [id]: next };
    });
  }

  return (
    <section id="published-gigs" className="space-y-6 scroll-mt-24">
      {/* Section Headline */}
      <div className="space-y-1.5">
        <span className="font-sans text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
          Direct Services
        </span>
        <h2 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Published Gigs
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
          Order specialized web engineering services directly under deterministic milestone escrow contracts.
        </p>
      </div>

      {/* 3 Gigs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PUBLISHED_GIGS.map((gig) => {
          const isFav = favorites[gig.id];

          return (
            <Link
              key={gig.id}
              href={`/gigs/${gig.id}`}
              className="group rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:border-violet-300 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Gig Cover Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                  <img
                    src={gig.cover}
                    alt={gig.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

                  {/* Favorite Toggle Button */}
                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(e, gig.id)}
                    aria-label="Save gig"
                    className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-md backdrop-blur-md hover:bg-white hover:text-rose-500 transition cursor-pointer"
                  >
                    <Heart
                      className={`w-4 h-4 ${isFav ? "fill-rose-500 text-rose-500" : ""}`}
                    />
                  </button>

                  {/* Category Pill */}
                  <span className="absolute bottom-3 left-3 rounded-lg bg-white/95 px-2.5 py-0.5 text-[11px] font-bold text-slate-900 backdrop-blur-md shadow-2xs">
                    {gig.category}
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-3">
                  <h3 className="line-clamp-2 font-sans text-sm sm:text-base font-semibold text-slate-900 group-hover:text-violet-600 transition leading-snug">
                    {gig.title}
                  </h3>

                  {/* Ratings & Delivery */}
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-slate-900">{gig.rating}</span>
                      <span className="text-slate-400">({gig.reviewsCount})</span>
                    </div>

                    <div className="flex items-center gap-1 font-medium text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-violet-600" />
                      <span>{gig.deliveryDays}-Day Delivery</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer: Starting Price */}
              <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs bg-slate-50/50">
                <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                  Starting Price
                </span>
                <span className="font-headline text-lg font-extrabold text-slate-900 group-hover:text-violet-600 transition">
                  ${gig.startingPrice}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
