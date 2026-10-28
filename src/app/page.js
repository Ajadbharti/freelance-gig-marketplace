"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, BadgeCheck, ClipboardCheck, Search, Sparkles } from "lucide-react";
import { categories } from "@/data/categories";
import { useMarketplace } from "@/context/MarketplaceContext";
import SearchBar from "@/components/layout/SearchBar";
import CategoryCard from "@/components/gigs/CategoryCard";
import GigCard from "@/components/gigs/GigCard";
import FreelancerCard from "@/components/freelancers/FreelancerCard";
import { GigCardSkeleton } from "@/components/ui/LoadingSkeleton";

const POPULAR_SEARCHES = ["React website", "Logo design", "SEO", "Video editing"];

const STEPS = [
  {
    icon: Search,
    title: "Browse and compare",
    text: "Search by skill or category, then filter by price and rating to shortlist the best gigs.",
  },
  {
    icon: ClipboardCheck,
    title: "Place your order",
    text: "Share your requirements and place a demo order. Track every status update in your dashboard.",
  },
  {
    icon: BadgeCheck,
    title: "Receive and review",
    text: "Get the delivery, ask for revisions if needed, complete the order and leave a review.",
  },
];

function SectionHeading({ title, subtitle, href, linkLabel }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700 sm:flex"
        >
          {linkLabel} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  const { gigs, freelancers, hydrated, getGigRating, getFreelancerRating } = useMarketplace();

  const featuredGigs = useMemo(() => {
    return gigs
      .map((gig) => ({ gig, rating: getGigRating(gig.id) }))
      .sort(
        (a, b) =>
          b.rating.average - a.rating.average ||
          b.rating.count - a.rating.count ||
          new Date(b.gig.createdAt) - new Date(a.gig.createdAt)
      )
      .slice(0, 4)
      .map((item) => item.gig);
  }, [gigs, getGigRating]);

  const topFreelancers = useMemo(() => {
    return freelancers
      .map((f) => ({ freelancer: f, rating: getFreelancerRating(f.id) }))
      .sort(
        (a, b) =>
          b.rating.average - a.rating.average ||
          b.rating.count - a.rating.count ||
          b.freelancer.completedOrders - a.freelancer.completedOrders
      )
      .slice(0, 4)
      .map((item) => item.freelancer);
  }, [freelancers, getFreelancerRating]);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-indigo-50 via-white to-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:py-24">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
            <Sparkles className="h-3.5 w-3.5" /> Demo marketplace with mock data
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Find the Right Freelancer for Your Next Big Idea.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
            Explore web development, design, writing, video and marketing services from talented freelancers.
          </p>
          <div className="mx-auto mt-8 max-w-2xl">
            <SearchBar size="lg" placeholder="Try “React website” or “logo design”" />
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-slate-500">Popular:</span>
            {POPULAR_SEARCHES.map((term) => (
              <Link
                key={term}
                href={`/gigs?q=${encodeURIComponent(term)}`}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular categories */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <SectionHeading
          title="Popular categories"
          subtitle="Pick a category to see the best matching gigs."
          href="/gigs"
          linkLabel="View all gigs"
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>

      {/* Featured gigs */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading
            title="Featured gigs"
            subtitle="Top-rated services loved by clients."
            href="/gigs"
            linkLabel="Explore more"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {hydrated
              ? featuredGigs.map((gig) => <GigCard key={gig.id} gig={gig} />)
              : Array.from({ length: 4 }).map((_, i) => <GigCardSkeleton key={i} />)}
          </div>
        </div>
      </section>

      {/* Top-rated freelancers */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <SectionHeading title="Top-rated freelancers" subtitle="Experienced professionals ready to start." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {hydrated
            ? topFreelancers.map((f) => <FreelancerCard key={f.id} freelancer={f} />)
            : Array.from({ length: 4 }).map((_, i) => <GigCardSkeleton key={i} />)}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading title="How it works" subtitle="Get your project done in three simple steps." />
          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-semibold text-indigo-600">Step {index + 1}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{step.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Freelancer CTA */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-12 text-center text-white sm:px-12">
          <h2 className="text-2xl font-bold sm:text-3xl">Ready to sell your skills?</h2>
          <p className="mx-auto mt-3 max-w-xl text-indigo-100">
            Create a freelancer account, publish your first gig and start receiving demo orders.
          </p>
          <Link
            href="/register?role=freelancer"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-indigo-700 transition hover:bg-indigo-50"
          >
            Become a freelancer <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}