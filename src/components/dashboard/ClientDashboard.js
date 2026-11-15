"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Heart, Package, Pencil, ShoppingBag, Trash2, Wallet, XCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useToast } from "@/components/ui/ToastProvider";
import { createClient } from "@/lib/supabase/client";
import DashboardShell from "@/components/dashboard/DashboardShell";
import StatCard from "@/components/dashboard/StatCard";
import GigCard from "@/components/gigs/GigCard";
import OrderCard from "@/components/orders/OrderCard";
import ReviewModal from "@/components/reviews/ReviewModal";
import EditReviewModal from "@/components/reviews/EditReviewModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import RatingStars from "@/components/ui/RatingStars";
import { inputClass } from "@/components/ui/FormField";
import { cn, formatDate, formatPrice } from "@/lib/utils";

const PAGE = 8;

const TABS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "delivered", label: "Delivered" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "price-high", label: "Price: high to low" },
  { value: "price-low", label: "Price: low to high" },
];

export default function ClientDashboard() {
  const { user } = useAuth();
  const {
    gigs,
    orders,
    reviews,
    getGig,
    getProfile,
    getOrderGig,
    getOrderReview,
    cancelOrder,
    refreshPublic,
  } = useMarketplace();
  const { ids: savedIds, loaded: savedLoaded } = useFavorites();
  const { showToast } = useToast();

  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [visible, setVisible] = useState(PAGE);
  const [reviewOrder, setReviewOrder] = useState(null);
  const [editReview, setEditReview] = useState(null);
  const [deleteReviewTarget, setDeleteReviewTarget] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);

  const myOrders = user ? orders.filter((o) => o.clientId === user.id) : [];

  const counts = {
    all: myOrders.length,
    active: myOrders.filter((o) => o.status === "active").length,
    delivered: myOrders.filter((o) => o.status === "delivered").length,
    completed: myOrders.filter((o) => o.status === "completed").length,
    cancelled: myOrders.filter((o) => o.status === "cancelled").length,
  };

  const totalSpent = myOrders.filter((o) => o.status === "completed").reduce((sum, o) => sum + o.price, 0);
  const inProgressValue = myOrders
    .filter((o) => o.status === "active" || o.status === "delivered")
    .reduce((sum, o) => sum + o.price, 0);

  const query = search.trim().toLowerCase();
  const filteredOrders = myOrders
    .filter((o) => tab === "all" || o.status === tab)
    .filter((o) => {
      if (!query) return true;
      const title = (getOrderGig(o)?.title ?? "").toLowerCase();
      const freelancer = (getProfile(o.freelancerId)?.name ?? "").toLowerCase();
      return title.includes(query) || freelancer.includes(query) || o.id.slice(-6).toLowerCase().includes(query);
    })
    .sort((a, b) => {
      if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === "price-high") return b.price - a.price;
      if (sort === "price-low") return a.price - b.price;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const savedGigs = gigs.filter((g) => savedIds.includes(g.id));
  const myReviews = user ? reviews.filter((r) => r.clientId === user.id) : [];
  const firstName = user?.name?.split(" ")[0] ?? "";

  async function confirmCancel() {
    const result = await cancelOrder(cancelTarget.id);
    showToast(result.ok ? "Order cancelled." : result.error, result.ok ? "success" : "error");
    setCancelTarget(null);
  }

  async function confirmDeleteReview() {
    const target = deleteReviewTarget;
    setDeleteReviewTarget(null);
    const { error } = await createClient().rpc("delete_my_review", { p_review: target.id });
    if (error) {
      showToast(error.message || "Could not delete the review.", "error");
      return;
    }
    await refreshPublic();
    showToast("Review deleted.");
  }

  function orderAgain(order) {
    if (!getGig(order.gigId)) return null;
    return (
      <Link
        href={`/gigs/${order.gigId}`}
        className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
      >
        Order again
      </Link>
    );
  }

  function renderActions(order) {
    if (order.status === "active") {
      const latest = order.timeline[order.timeline.length - 1]?.label ?? "";
      const revisionPending = latest.startsWith("Revision requested");
      return (
        <>
          {revisionPending && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
              Revision requested
            </span>
          )}
          <span className="text-slate-600">
            {revisionPending
              ? "Waiting for the freelancer to deliver the updated work."
              : "The freelancer is working on your order."}
          </span>
          <button
            type="button"
            onClick={() => setCancelTarget(order)}
            className="ml-auto rounded-lg border border-red-200 bg-white px-4 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Cancel order
          </button>
        </>
      );
    }

    if (order.status === "delivered") {
      return (
        <>
          <span className="text-slate-600">Work delivered. Approve it or ask for changes.</span>
          <Link
            href={`/orders/${order.id}`}
            className="ml-auto rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Review delivery
          </Link>
        </>
      );
    }

    if (order.status === "completed") {
      const review = getOrderReview(order.id);
      return (
        <>
          {review ? (
            <>
              <RatingStars rating={review.rating} />
              <span className="text-slate-600">You reviewed this order.</span>
            </>
          ) : (
            <span className="text-slate-600">How was the work?</span>
          )}
          <div className="ml-auto flex flex-wrap gap-2">
            {!review && (
              <button
                type="button"
                onClick={() => setReviewOrder(order)}
                className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Leave a review
              </button>
            )}
            {orderAgain(order)}
          </div>
        </>
      );
    }

    if (order.status === "cancelled") {
      const again = orderAgain(order);
      return again ? <div className="ml-auto">{again}</div> : null;
    }

    return null;
  }

  return (
    <DashboardShell
      role="client"
      path="/dashboard/client"
      title={`Welcome back, ${firstName}`}
      subtitle="Track your orders, save gigs and review completed work."
      actions={
        <Link
          href="/gigs"
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Browse gigs
        </Link>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={ShoppingBag} label="Active orders" value={counts.active} tone="indigo" />
        <StatCard icon={Package} label="Delivered" value={counts.delivered} hint="Waiting for your approval" tone="amber" />
        <StatCard icon={CheckCircle2} label="Completed" value={counts.completed} tone="emerald" />
        <StatCard icon={XCircle} label="Cancelled" value={counts.cancelled} tone="slate" />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <StatCard icon={Wallet} label="Total spent" value={formatPrice(totalSpent)} hint="On completed orders" tone="emerald" />
        <StatCard
          icon={ShoppingBag}
          label="In progress"
          value={formatPrice(inProgressValue)}
          hint="Active and delivered orders"
          tone="amber"
        />
        <StatCard icon={Heart} label="Saved gigs" value={savedGigs.length} tone="indigo" />
      </div>

      {/* Order history */}
      <section className="mt-10 scroll-mt-24" aria-labelledby="history-heading">
        <h2 id="history-heading" className="text-xl font-semibold text-slate-900">
          Order history
        </h2>

        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter orders by status">
          {TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => {
                setTab(t.value);
                setVisible(PAGE);
              }}
              aria-pressed={tab === t.value}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition",
                tab === t.value
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              )}
            >
              {t.label} ({counts[t.value]})
            </button>
          ))}
        </div>

        {myOrders.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3">
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisible(PAGE);
              }}
              placeholder="Search by gig, freelancer or order ID"
              aria-label="Search your orders"
              className={cn(inputClass, "max-w-xs")}
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort orders"
              className={cn(inputClass, "max-w-[200px]")}
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {filteredOrders.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <p className="font-semibold text-slate-900">
              {myOrders.length === 0 ? "You have not placed any orders yet" : "No orders match your filters"}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {myOrders.length === 0
                ? "Find a gig you like and place your first order."
                : "Try a different tab or clear the search."}
            </p>
            {myOrders.length === 0 && (
              <Link
                href="/gigs"
                className="mt-5 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Explore gigs
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="mt-6 space-y-4">
              {filteredOrders.slice(0, visible).map((order) => (
                <OrderCard key={order.id} order={order} viewer="client">
                  {renderActions(order)}
                </OrderCard>
              ))}
            </div>
            {filteredOrders.length > visible && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setVisible((v) => v + PAGE)}
                  className="rounded-lg border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                >
                  Show more ({filteredOrders.length - visible} left)
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Saved gigs */}
      <section id="saved" className="mt-14 scroll-mt-24" aria-labelledby="saved-heading">
        <h2 id="saved-heading" className="text-xl font-semibold text-slate-900">
          Saved gigs
        </h2>
        {!savedLoaded ? (
          <p className="mt-4 text-sm text-slate-500">Loading your saved gigs...</p>
        ) : savedGigs.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <p className="font-semibold text-slate-900">No saved gigs yet</p>
            <p className="mt-1 text-sm text-slate-600">Tap the heart on any gig to keep it here for later.</p>
            <Link
              href="/gigs"
              className="mt-5 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Explore gigs
            </Link>
          </div>
        ) : (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {savedGigs.map((gig) => (
              <GigCard key={gig.id} gig={gig} />
            ))}
          </div>
        )}
      </section>

      {/* My reviews */}
      <section id="reviews" className="mt-14 scroll-mt-24" aria-labelledby="reviews-heading">
        <h2 id="reviews-heading" className="text-xl font-semibold text-slate-900">
          My reviews
        </h2>
        {myReviews.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm text-slate-600">
            You have not written any reviews yet. After an order is completed you can review it here.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            {myReviews.map((review) => (
              <article key={review.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {getGig(review.gigId)?.title ?? "This gig is no longer available"}
                    </p>
                    <p className="text-xs text-slate-500">
                      For {getProfile(review.freelancerId)?.name ?? "Unknown"} · {formatDate(review.createdAt)}
                    </p>
                  </div>
                  <RatingStars rating={review.rating} />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-slate-700">{review.comment}</p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/orders/${review.orderId}`}
                    className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    View order
                  </Link>
                  <button
                    type="button"
                    onClick={() => setEditReview(review)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteReviewTarget(review)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <ReviewModal order={reviewOrder} open={Boolean(reviewOrder)} onClose={() => setReviewOrder(null)} />
      <EditReviewModal review={editReview} open={Boolean(editReview)} onClose={() => setEditReview(null)} />

      <ConfirmModal
        open={Boolean(cancelTarget)}
        title="Cancel this order?"
        message="The order will be marked as cancelled for both you and the freelancer. This cannot be undone."
        confirmLabel="Cancel order"
        danger
        onConfirm={confirmCancel}
        onClose={() => setCancelTarget(null)}
      />

      <ConfirmModal
        open={Boolean(deleteReviewTarget)}
        title="Delete this review?"
        message="The review will be removed from the gig and the freelancer's profile. You can write a new one later."
        confirmLabel="Delete review"
        danger
        onConfirm={confirmDeleteReview}
        onClose={() => setDeleteReviewTarget(null)}
      />
    </DashboardShell>
  );
}