"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CheckCircle2, Package, ShoppingBag, XCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useMarketplace } from "@/context/MarketplaceContext";
import DashboardShell from "@/components/dashboard/DashboardShell";
import StatCard from "@/components/dashboard/StatCard";
import OrderCard from "@/components/orders/OrderCard";
import ReviewModal from "@/components/reviews/ReviewModal";
import RatingStars from "@/components/ui/RatingStars";
import { cn } from "@/lib/utils";

const TABS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "delivered", label: "Delivered" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function ClientDashboard() {
  const { user } = useAuth();
  const { orders, getOrderReview } = useMarketplace();
  const [tab, setTab] = useState("all");
  const [reviewOrder, setReviewOrder] = useState(null);

  const myOrders = useMemo(() => {
    if (!user) return [];
    return orders
      .filter((o) => o.clientId === user.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orders, user]);

  const counts = {
    all: myOrders.length,
    active: myOrders.filter((o) => o.status === "active").length,
    delivered: myOrders.filter((o) => o.status === "delivered").length,
    completed: myOrders.filter((o) => o.status === "completed").length,
    cancelled: myOrders.filter((o) => o.status === "cancelled").length,
  };

  const visible = tab === "all" ? myOrders : myOrders.filter((o) => o.status === tab);
  const firstName = user?.name?.split(" ")[0] ?? "";

  function renderActions(order) {
    if (order.status === "completed") {
      const review = getOrderReview(order.id);
      if (review) {
        return (
          <>
            <RatingStars rating={review.rating} />
            <span className="text-slate-600">You reviewed this order.</span>
          </>
        );
      }
      return (
        <>
          <span className="text-slate-600">How was the work?</span>
          <button
            type="button"
            onClick={() => setReviewOrder(order)}
            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Leave a review
          </button>
        </>
      );
    }
    if (order.status === "delivered") {
      return <span className="text-slate-600">Work delivered. Open the order to approve it or request a revision.</span>;
    }
    return null;
  }

  return (
    <DashboardShell
      role="client"
      path="/dashboard/client"
      title={`Welcome back, ${firstName}`}
      subtitle="Track your orders and review completed work."
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

      <section className="mt-10" aria-labelledby="history-heading">
        <h2 id="history-heading" className="text-xl font-semibold text-slate-900">
          Order history
        </h2>

        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter orders by status">
          {TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTab(t.value)}
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

        {visible.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <p className="font-semibold text-slate-900">
              {myOrders.length === 0 ? "You have not placed any orders yet" : "No orders in this status"}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {myOrders.length === 0
                ? "Find a gig you like and place your first demo order."
                : "Try a different tab to see your other orders."}
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
          <div className="mt-6 space-y-4">
            {visible.map((order) => (
              <OrderCard key={order.id} order={order} viewer="client">
                {renderActions(order)}
              </OrderCard>
            ))}
          </div>
        )}
      </section>

      <ReviewModal order={reviewOrder} open={Boolean(reviewOrder)} onClose={() => setReviewOrder(null)} />
    </DashboardShell>
  );
}