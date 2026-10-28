"use client";

import Link from "next/link";
import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, RefreshCw, SearchX } from "lucide-react";
import { categories } from "@/data/categories";
import { useAuth } from "@/context/AuthContext";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useToast } from "@/components/ui/ToastProvider";
import SafeImage from "@/components/ui/SafeImage";
import RatingStars from "@/components/ui/RatingStars";
import PriceDisplay from "@/components/ui/PriceDisplay";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import GigCard from "@/components/gigs/GigCard";
import ReviewCard from "@/components/reviews/ReviewCard";
import OrderModal from "@/components/orders/OrderModal";

export function GigDetailsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10" role="status" aria-label="Loading gig">
      <LoadingSkeleton className="h-5 w-64" />
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <LoadingSkeleton className="h-9 w-3/4" />
          <LoadingSkeleton className="h-10 w-1/3" />
          <LoadingSkeleton className="aspect-[16/10] w-full" />
          <LoadingSkeleton className="h-4 w-full" />
          <LoadingSkeleton className="h-4 w-5/6" />
        </div>
        <LoadingSkeleton className="h-72 w-full" />
      </div>
    </div>
  );
}

export default function GigDetails({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { user } = useAuth();
  const { gigs, hydrated, getGig, getFreelancer, getGigReviews, getGigRating } = useMarketplace();
  const { showToast } = useToast();
  const [orderOpen, setOrderOpen] = useState(false);

  const gig = getGig(id);
  const freelancer = gig ? getFreelancer(gig.freelancerId) : null;
  const reviews = gig ? getGigReviews(gig.id) : [];
  const { average, count } = gig ? getGigRating(gig.id) : { average: 0, count: 0 };
  const category = gig ? categories.find((c) => c.slug === gig.category) : null;

  const related = useMemo(() => {
    if (!gig) return [];
    const others = gigs.filter((g) => g.id !== gig.id);
    const sameCategory = others.filter((g) => g.category === gig.category);
    const rest = others.filter((g) => g.category !== gig.category);
    return [...sameCategory, ...rest].slice(0, 3);
  }, [gigs, gig]);

  if (!hydrated) return <GigDetailsSkeleton />;

  if (!gig) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <SearchX className="h-14 w-14 text-slate-300" />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Gig not found</h1>
        <p className="mt-2 text-slate-600">This gig does not exist or may have been removed.</p>
        <Link
          href="/gigs"
          className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Browse all gigs
        </Link>
      </div>
    );
  }

  const isFreelancer = user?.role === "freelancer";

  function handleOrderClick() {
    if (!user) {
      showToast("Please log in as a client to place an order.", "info");
      router.push(`/login?next=${encodeURIComponent(`/gigs/${gig.id}`)}`);
      return;
    }
    if (user.role !== "client") {
      showToast("Only client accounts can place orders.", "error");
      return;
    }
    setOrderOpen(true);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
        <Link href="/gigs" className="inline-flex items-center gap-1 transition hover:text-indigo-600">
          <ArrowLeft className="h-4 w-4" /> All gigs
        </Link>
        {category && (
          <>
            <span aria-hidden="true">/</span>
            <Link href={`/gigs?category=${category.slug}`} className="transition hover:text-indigo-600">
              {category.name}
            </Link>
          </>
        )}
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Left column */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{gig.title}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            {freelancer && (
              <Link href={`/freelancers/${freelancer.id}`} className="flex items-center gap-2">
                <SafeImage src={freelancer.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                <span className="text-sm font-semibold text-slate-800 hover:text-indigo-600">
                  {freelancer.name}
                </span>
              </Link>
            )}
            <RatingStars rating={average} count={count > 0 ? count : undefined} showNumber />
          </div>

          <div className="mt-6 aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100">
            <SafeImage src={gig.image} alt={gig.title} className="h-full w-full object-cover" />
          </div>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-slate-900">About this gig</h2>
            <p className="mt-3 leading-relaxed text-slate-700">{gig.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {[...gig.skills, ...gig.tags].map((item) => (
                <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {item}
                </span>
              ))}
            </div>
          </section>

          <section className="mt-10" aria-labelledby="reviews-heading">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="reviews-heading" className="text-xl font-semibold text-slate-900">
                Client reviews
              </h2>
              {count > 0 && <RatingStars rating={average} count={count} showNumber size={18} />}
            </div>
            {reviews.length === 0 ? (
              <p className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-600">
                No reviews yet. Reviews appear here after a client completes an order.
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right column */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <PriceDisplay price={gig.price} label="Price" size="lg" />
            <ul className="mt-5 space-y-3 text-sm text-slate-700">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-600" />
                {gig.deliveryDays} day delivery
              </li>
              <li className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 text-indigo-600" />
                {gig.revisions} revisions included
              </li>
            </ul>
            <button
              type="button"
              onClick={handleOrderClick}
              disabled={isFreelancer}
              className="mt-6 w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Order Now
            </button>
            {isFreelancer && (
              <p className="mt-3 text-xs text-slate-500">
                You are logged in as a freelancer. Use a client account to place orders.
              </p>
            )}
            {!user && (
              <p className="mt-3 text-xs text-slate-500">You will be asked to log in as a client first.</p>
            )}
          </div>

          {freelancer && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <SafeImage src={freelancer.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{freelancer.name}</p>
                  <p className="line-clamp-2 text-xs text-slate-500">{freelancer.headline}</p>
                </div>
              </div>
              <Link
                href={`/freelancers/${freelancer.id}#portfolio`}
                className="mt-4 block rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
              >
                View profile and portfolio
              </Link>
            </div>
          )}
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <h2 className="text-xl font-semibold text-slate-900">Related gigs</h2>
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((g) => (
              <GigCard key={g.id} gig={g} />
            ))}
          </div>
        </section>
      )}

      <OrderModal gig={gig} open={orderOpen} onClose={() => setOrderOpen(false)} />
    </div>
  );
}