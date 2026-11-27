"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Heart, Star } from "lucide-react";

const FEATURED_GIGS = [
  {
    id: "gig-1",
    title: "I will develop a modern full-stack web application with Next.js and Tailwind",
    category: "Web Development",
    cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=700&q=80",
    freelancer: {
      name: "Priya Sharma",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
      level: "Top Rated Pro",
      initials: "PS",
    },
    rating: 5.0,
    reviewsCount: 184,
    startingPrice: 4999,
  },
  {
    id: "gig-2",
    title: "I will design an enterprise Figma design system, web UI and mobile app",
    category: "Graphics & Design",
    cover: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=700&q=80",
    freelancer: {
      name: "Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80",
      level: "Level 2 Seller",
      initials: "ER",
    },
    rating: 4.9,
    reviewsCount: 210,
    startingPrice: 3500,
  },
  {
    id: "gig-3",
    title: "I will build autonomous AI agents, LLM pipelines and smart vector search",
    category: "Data & AI",
    cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=700&q=80",
    freelancer: {
      name: "Marcus Vance",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
      level: "AI Specialist",
      initials: "MV",
    },
    rating: 5.0,
    reviewsCount: 92,
    startingPrice: 7200,
  },
  {
    id: "gig-4",
    title: "I will craft a modern minimalist brand identity, typography and guidelines",
    category: "Graphics & Design",
    cover: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=700&q=80",
    freelancer: {
      name: "Sarah Jenkins",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
      level: "Top Rated",
      initials: "SJ",
    },
    rating: 4.9,
    reviewsCount: 315,
    startingPrice: 2800,
  },
  {
    id: "gig-5",
    title: "I will edit high-retention cinematic SaaS product demos and YouTube videos",
    category: "Video & Animation",
    cover: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=700&q=80",
    freelancer: {
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
      level: "Video Pro",
      initials: "DK",
    },
    rating: 5.0,
    reviewsCount: 140,
    startingPrice: 4200,
  },
  {
    id: "gig-6",
    title: "I will architect secure cloud infrastructure on AWS, Docker and Kubernetes",
    category: "Programming & Tech",
    cover: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=700&q=80",
    freelancer: {
      name: "Arjun Patel",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
      level: "Cloud Architect",
      initials: "AP",
    },
    rating: 5.0,
    reviewsCount: 88,
    startingPrice: 6000,
  },
];

export default function FeaturedGigs() {
  const [favorites, setFavorites] = useState({});

  function toggleFavorite(id, e) {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <section id="explore" className="py-16 sm:py-20 lg:py-24 bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div className="space-y-2">
            <span className="font-sans text-xs font-bold text-violet-600 tracking-wider uppercase bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
              Hand-Picked Services
            </span>
            <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Featured Gigs
            </h2>
            <p className="font-sans text-sm sm:text-base text-slate-500 max-w-xl">
              High-output services delivered by vetted professionals with guaranteed escrow protection.
            </p>
          </div>

          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-violet-600 hover:text-violet-700 hover:underline transition self-start sm:self-auto"
          >
            <span>Explore All Gigs</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Gigs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {FEATURED_GIGS.map((gig) => {
            const isFav = favorites[gig.id];
            return (
              <div
                key={gig.id}
                className="group rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-sm hover:border-violet-300 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Gig Cover Image & Favorite Button */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={gig.cover}
                      alt={gig.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Category Tag on Image */}
                    <span className="absolute top-3 left-3 rounded-full bg-slate-900/80 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-white">
                      {gig.category}
                    </span>

                    {/* Save/Favorite Heart Icon */}
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(gig.id, e)}
                      aria-label="Save gig to favorites"
                      className={`absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition shadow-sm cursor-pointer ${
                        isFav
                          ? "bg-rose-500 text-white"
                          : "bg-white/90 text-slate-600 hover:text-rose-500 hover:bg-white"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  {/* Gig Body Content */}
                  <div className="p-5 space-y-3">
                    
                    {/* Freelancer Profile Row */}
                    <div className="flex items-center gap-2.5">
                      <img
                        src={gig.freelancer.avatar}
                        alt={gig.freelancer.name}
                        className="h-8 w-8 rounded-full object-cover border border-slate-200"
                        loading="lazy"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-xs font-bold text-slate-900 truncate">
                          {gig.freelancer.name}
                        </p>
                        <p className="font-sans text-[10px] text-violet-600 font-semibold uppercase tracking-wider">
                          {gig.freelancer.level}
                        </p>
                      </div>
                    </div>

                    {/* Gig Title */}
                    <Link href={`/gigs/${gig.id}`}>
                      <h3 className="font-sans text-sm font-semibold text-slate-900 line-clamp-2 hover:text-violet-600 transition-colors leading-snug">
                        {gig.title}
                      </h3>
                    </Link>

                    {/* Rating & Review Count */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-slate-900">{gig.rating.toFixed(1)}</span>
                      <span className="text-slate-400">({gig.reviewsCount} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Starting Price */}
                <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <span className="font-sans text-xs text-slate-500">Starting at</span>
                  <div className="font-headline text-lg font-bold text-slate-900">
                    ₹{gig.startingPrice.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
