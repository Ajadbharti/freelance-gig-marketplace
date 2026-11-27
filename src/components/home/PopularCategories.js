"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Briefcase,
  Code2,
  Cpu,
  Palette,
  PenTool,
  Terminal,
  TrendingUp,
  Video,
} from "lucide-react";

const CATEGORIES = [
  {
    slug: "web-development",
    title: "Web Development",
    description: "Custom web apps, responsive frontends, Next.js & full-stack platforms.",
    icon: Code2,
    count: "3,420 Gigs",
  },
  {
    slug: "graphics-design",
    title: "Graphics & Design",
    description: "Brand identities, UI/UX designs, logos, Figma systems & creative assets.",
    icon: Palette,
    count: "2,840 Gigs",
  },
  {
    slug: "writing-translation",
    title: "Writing & Translation",
    description: "Technical writing, content creation, copywriting, articles & localization.",
    icon: PenTool,
    count: "1,980 Gigs",
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    description: "Search engine marketing, social campaigns, growth hacking & SEO optimization.",
    icon: TrendingUp,
    count: "2,150 Gigs",
  },
  {
    slug: "video-animation",
    title: "Video & Animation",
    description: "Explainer videos, motion graphics, video editing & 3D cinematic renders.",
    icon: Video,
    count: "1,460 Gigs",
  },
  {
    slug: "data-ai",
    title: "Data & AI",
    description: "Machine learning, AI agents, LLM fine-tuning, analytics & automation.",
    icon: Cpu,
    count: "1,890 Gigs",
  },
  {
    slug: "programming-technology",
    title: "Programming & Technology",
    description: "APIs, microservices, DevOps, cloud infrastructure & database architecture.",
    icon: Terminal,
    count: "2,630 Gigs",
  },
  {
    slug: "business",
    title: "Business",
    description: "Product management, business consulting, financial modeling & research.",
    icon: Briefcase,
    count: "1,240 Gigs",
  },
];

export default function PopularCategories() {
  return (
    <section id="categories" className="py-16 sm:py-20 lg:py-24 bg-white border-y border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div className="space-y-2">
            <span className="font-sans text-xs font-bold text-violet-600 tracking-wider uppercase bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
              Explore Marketplace
            </span>
            <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Popular Categories
            </h2>
            <p className="font-sans text-sm sm:text-base text-slate-500 max-w-xl">
              Browse top-rated digital services across leading creative and technical disciplines.
            </p>
          </div>

          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-violet-600 hover:text-violet-700 hover:underline transition self-start sm:self-auto"
          >
            <span>All Categories</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 8-Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.slug}
                href={`/explore?category=${cat.slug}`}
                className="group relative rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm hover:border-violet-400 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Top Icon Badge & Gig Count */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors duration-200 shadow-2xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-sans text-[11px] font-semibold text-slate-400 group-hover:text-violet-600 transition">
                      {cat.count}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-headline text-lg font-bold text-slate-900 group-hover:text-violet-600 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="mt-2 font-sans text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                {/* Bottom link prompt */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-violet-600 transition">
                  <span>Explore Gigs</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
