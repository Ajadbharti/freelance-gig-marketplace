"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Heart, Star, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

const INITIAL_SAVED_GIGS = [
  {
    id: "gig-saved-1",
    title: "I will design a modern minimalist luxury business logo and brand identity",
    category: "Logo Design",
    cover: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80",
    freelancer: {
      name: "Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80",
      level: "Top Rated Pro",
    },
    rating: 5.0,
    reviewsCount: 284,
    startingPrice: 50,
  },
  {
    id: "gig-saved-2",
    title: "I will develop a modern full-stack web application with Next.js and Tailwind",
    category: "Web Development",
    cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
    freelancer: {
      name: "Alex Morgan",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
      level: "Top Rated Pro",
    },
    rating: 5.0,
    reviewsCount: 94,
    startingPrice: 120,
  },
  {
    id: "gig-saved-3",
    title: "I will build autonomous AI agents, LLM pipelines and smart vector search",
    category: "Data & AI",
    cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    freelancer: {
      name: "Marcus Vance",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
      level: "AI Specialist",
    },
    rating: 4.9,
    reviewsCount: 92,
    startingPrice: 140,
  },
];

export default function ClientSavedGigs() {
  const { showToast } = useToast();
  const [savedGigs, setSavedGigs] = useState(INITIAL_SAVED_GIGS);

  function handleRemove(e, id, title) {
    e.preventDefault();
    e.stopPropagation();
    setSavedGigs((prev) => prev.filter((g) => g.id !== id));
    showToast(`Removed "${title.slice(0, 30)}..." from saved gigs.`, "info");
  }

  return (
    <section id="saved-gigs" className="space-y-4 scroll-mt-24">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Saved Gigs ({savedGigs.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Bookmarked services shortlisted for upcoming milestones and projects.
          </p>
        </div>

        <Link
          href="/explore"
          className="text-xs font-semibold text-violet-600 hover:text-violet-700 hover:underline transition hidden sm:block"
        >
          Explore More Gigs →
        </Link>
      </div>

      {/* Gigs Cards Grid */}
      {savedGigs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedGigs.map((gig) => (
            <div
              key={gig.id}
              className="group rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:border-violet-300 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

                  {/* Remove from Favorites Button */}
                  <button
                    type="button"
                    onClick={(e) => handleRemove(e, gig.id, gig.title)}
                    aria-label="Remove from saved gigs"
                    title="Remove from favorites"
                    className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-rose-500 shadow-md backdrop-blur-md hover:bg-rose-50 hover:scale-105 transition cursor-pointer"
                  >
                    <Heart className="w-4 h-4 fill-rose-500" />
                  </button>

                  <span className="absolute bottom-3 left-3 rounded-md bg-white/95 px-2 py-0.5 text-[11px] font-bold text-slate-900 backdrop-blur-md shadow-2xs">
                    {gig.category}
                  </span>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-3">
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

              {/* Card Footer: Starting Price & View Gig Button */}
              <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs bg-slate-50/50">
                <div>
                  <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold block">
                    Starting at
                  </span>
                  <span className="font-headline text-lg font-extrabold text-slate-900">
                    ${gig.startingPrice}
                  </span>
                </div>

                <Link
                  href={`/gigs/${gig.id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-violet-600 text-white text-xs font-semibold shadow-xs hover:bg-violet-700 transition"
                >
                  <span>View Gig</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-3">
          <Heart className="mx-auto w-8 h-8 text-slate-300" />
          <p className="text-sm font-semibold text-slate-700">No saved gigs yet.</p>
          <p className="text-xs text-slate-400">Explore our catalog and click the heart icon on any gig to save it here.</p>
          <Link
            href="/explore"
            className="inline-block mt-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold"
          >
            Explore Gigs
          </Link>
        </div>
      )}
    </section>
  );
}
