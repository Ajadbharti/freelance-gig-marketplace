"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Heart, Star } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

const RELATED_GIGS = [
  {
    id: "gig-rel-1",
    title: "I will design minimalist luxury brand identity and complete guidelines",
    category: "Logo Design",
    cover: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=700&q=80",
    freelancer: {
      name: "Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80",
      level: "Top Rated Pro",
      initials: "ER",
    },
    rating: 5.0,
    reviewsCount: 142,
    startingPrice: 65,
  },
  {
    id: "gig-rel-2",
    title: "I will create hand-drawn modern botanical and boutique logos",
    category: "Brand Design",
    cover: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=700&q=80",
    freelancer: {
      name: "Priya Sharma",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
      level: "Level 2 Seller",
      initials: "PS",
    },
    rating: 4.9,
    reviewsCount: 88,
    startingPrice: 35,
  },
  {
    id: "gig-rel-3",
    title: "I will redesign and vectorize your existing logo into high-res SVG",
    category: "Vector Graphics",
    cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=700&q=80",
    freelancer: {
      name: "Marcus Vance",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
      level: "Vector Pro",
      initials: "MV",
    },
    rating: 5.0,
    reviewsCount: 210,
    startingPrice: 30,
  },
  {
    id: "gig-rel-4",
    title: "I will design a 3D animated logo reveal and motion intro for your brand",
    category: "Animation & 3D",
    cover: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=700&q=80",
    freelancer: {
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
      level: "Motion Pro",
      initials: "DK",
    },
    rating: 4.9,
    reviewsCount: 95,
    startingPrice: 45,
  },
];

export default function GigRelatedGigs() {
  const { showToast } = useToast();
  const [favorites, setFavorites] = useState({});

  function toggleFavorite(e, id) {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => {
      const next = !prev[id];
      showToast(next ? "Added to your saved gigs!" : "Removed from saved gigs.", next ? "success" : "info");
      return { ...prev, [id]: next };
    });
  }

  return (
    <section className="py-12 border-t border-slate-200 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
            More Options
          </span>
          <h2 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            People Also Viewed
          </h2>
          <p className="text-sm text-slate-500">
            Similar high-rated gigs from verified creative specialists.
          </p>
        </div>

        <Link
          href="/explore?category=graphics-design"
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-violet-600 hover:text-violet-700 hover:underline transition self-start sm:self-auto"
        >
          <span>Explore All Logo Services</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {RELATED_GIGS.map((gig) => {
          const isFav = favorites[gig.id];

          return (
            <Link
              key={gig.id}
              href={`/gigs/${gig.id}`}
              className="group rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:border-violet-300 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Cover Image & Favorite Toggle */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                  <img
                    src={gig.cover}
                    alt={gig.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                  {/* Favorite Button */}
                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(e, gig.id)}
                    aria-label="Save gig"
                    className="absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md backdrop-blur-md hover:bg-white hover:text-rose-500 transition cursor-pointer"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFav ? "fill-rose-500 text-rose-500" : ""
                      }`}
                    />
                  </button>

                  <span className="absolute bottom-2.5 left-2.5 rounded-md bg-white/95 px-2 py-0.5 text-[11px] font-bold text-slate-800 backdrop-blur-md shadow-2xs">
                    {gig.category}
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-4 space-y-3">
                  {/* Freelancer Info */}
                  <div className="flex items-center gap-2">
                    <img
                      src={gig.freelancer.avatar}
                      alt={gig.freelancer.name}
                      className="h-6 w-6 rounded-full object-cover border border-slate-200"
                    />
                    <div className="flex items-center gap-1.5 text-xs truncate">
                      <span className="font-semibold text-slate-800 truncate">
                        {gig.freelancer.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        · {gig.freelancer.level}
                      </span>
                    </div>
                  </div>

                  {/* Gig Title */}
                  <h3 className="line-clamp-2 text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-violet-600 transition leading-snug">
                    {gig.title}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-bold text-slate-900">{gig.rating}</span>
                    <span className="text-slate-400">({gig.reviewsCount})</span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Starting Price */}
              <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs bg-slate-50/40">
                <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                  Starting at
                </span>
                <span className="font-headline text-base font-extrabold text-slate-900 group-hover:text-violet-600 transition">
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
