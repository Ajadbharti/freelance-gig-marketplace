"use client";

import Link from "next/link";
import { ArrowUpRight, Heart, Sparkles, Star } from "lucide-react";

const RECOMMENDED_GIGS = [
  {
    id: "gig-rec-1",
    title: "I will design an enterprise Figma design system, web UI and mobile app",
    category: "Graphics & Design",
    cover: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=600&q=80",
    freelancer: {
      name: "Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80",
      level: "Top Rated Pro",
    },
    rating: 4.9,
    reviewsCount: 210,
    startingPrice: 50,
  },
  {
    id: "gig-rec-2",
    title: "I will build autonomous AI agents, LLM pipelines and smart vector search",
    category: "Data & AI",
    cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
    freelancer: {
      name: "Marcus Vance",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
      level: "AI Specialist",
    },
    rating: 5.0,
    reviewsCount: 92,
    startingPrice: 140,
  },
  {
    id: "gig-rec-3",
    title: "I will architect secure cloud infrastructure on AWS, Docker and Kubernetes",
    category: "Programming & Tech",
    cover: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    freelancer: {
      name: "Arjun Patel",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
      level: "Cloud Architect",
    },
    rating: 5.0,
    reviewsCount: 88,
    startingPrice: 150,
  },
  {
    id: "gig-rec-4",
    title: "I will edit high-retention cinematic SaaS product demos and video ads",
    category: "Video & Animation",
    cover: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80",
    freelancer: {
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
      level: "Video Pro",
    },
    rating: 5.0,
    reviewsCount: 140,
    startingPrice: 75,
  },
];

export default function ClientRecommendedGigs() {
  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-violet-700 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personalized For Your Projects</span>
          </div>
          <h2 className="font-headline text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Recommended Gigs
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Services curated based on your past project hires and industry interests.
          </p>
        </div>

        <Link
          href="/explore"
          className="text-xs font-semibold text-violet-600 hover:text-violet-700 hover:underline transition hidden sm:inline-flex items-center gap-1"
        >
          <span>See More Recommendations</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {RECOMMENDED_GIGS.map((gig) => (
          <Link
            key={gig.id}
            href={`/gigs/${gig.id}`}
            className="group rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:border-violet-300 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              {/* Cover Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                <img
                  src={gig.cover}
                  alt={gig.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

                <span className="absolute bottom-2.5 left-2.5 rounded-md bg-white/95 px-2 py-0.5 text-[11px] font-bold text-slate-800 backdrop-blur-md shadow-2xs">
                  {gig.category}
                </span>
              </div>

              {/* Body */}
              <div className="p-4 space-y-2.5">
                <div className="flex items-center gap-2">
                  <img
                    src={gig.freelancer.avatar}
                    alt={gig.freelancer.name}
                    className="h-6 w-6 rounded-full object-cover border border-slate-200"
                  />
                  <span className="text-xs font-semibold text-slate-800 truncate">
                    {gig.freelancer.name}
                  </span>
                </div>

                <h3 className="line-clamp-2 text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-violet-600 transition leading-snug">
                  {gig.title}
                </h3>

                <div className="flex items-center gap-1 text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-slate-900">{gig.rating}</span>
                  <span className="text-slate-400">({gig.reviewsCount})</span>
                </div>
              </div>
            </div>

            {/* Footer Starting Price */}
            <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs bg-slate-50/50">
              <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                Starting at
              </span>
              <span className="font-headline text-base font-extrabold text-slate-900 group-hover:text-violet-600 transition">
                ${gig.startingPrice}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
