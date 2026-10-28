"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Briefcase, CheckCircle2, Pencil, Plus, ShoppingBag, Trash2, Wallet } from "lucide-react";
import { categories } from "@/data/categories";
import { useAuth } from "@/context/AuthContext";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useToast } from "@/components/ui/ToastProvider";
import DashboardShell from "@/components/dashboard/DashboardShell";
import StatCard from "@/components/dashboard/StatCard";
import GigForm from "@/components/dashboard/GigForm";
import OrderCard from "@/components/orders/OrderCard";
import DeliverModal from "@/components/orders/DeliverModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Modal from "@/components/ui/Modal";
import RatingStars from "@/components/ui/RatingStars";
import SafeImage from "@/components/ui/SafeImage";
import { cn, formatPrice } from "@/lib/utils";

const TABS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "delivered", label: "Delivered" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function FreelancerDashboard() {
  const { user } = useAuth();
  const { gigs, orders, getGigRating, deleteGig, cancelOrder } = useMarketplace();
  const { showToast } = useToast();

  const [tab, setTab] = useState("all");
  const [editGig, setEditGig] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deliverTarget, setDeliverTarget] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);

  const myGigs = useMemo(() => (user ? gigs.filter((g) => g.freelancerId === user.id) : []), [gigs, user]);

  const myOrders = useMemo(() => {
    if (!user) return [];
    return orders
      .filter((o) => o.freelancerId === user.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orders, user]);

  const counts = {
    all: myOrders.length,
    active: myOrders.filter((o) => o.status === "active").length,
    delivered: myOrders.filter((o) => o.status === "delivered").length,
    completed: myOrders.filter((o) => o.status === "completed").length,
    cancelled: myOrders.filter((o) => o.status === "cancelled").length,
  };

  const earnings = myOrders.filter((o) => o.status === "completed").reduce((sum, o) => sum + o.price, 0);
  const pending = myOrders.filter((o) => o.status === "delivered").reduce((sum, o) => sum + o.price, 0);

  const visibleOrders = tab === "all" ? myOrders : myOrders.filter((o) => o.status === tab);

  function confirmDelete() {
    const result = deleteGig(deleteTarget.id);
    showToast(result.ok ? "Gig deleted." : result.error, result.ok ? "success" : "error");
    setDeleteTarget(null);
  }

  function confirmCancel() {
    const result = cancelOrder(cancelTarget.id);
    showToast(result.ok ? "Order cancelled." : result.error, result.ok ? "success" : "error");
    setCancelTarget(null);
  }

  function renderActions(order) {
    if (order.status === "active") {
      const latest = order.timeline[order.timeline.length - 1]?.label ?? "";
      const isRevision = latest.startsWith("Revision requested");
      return (
        <>
          {isRevision && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
              Revision requested
            </span>
          )}
          <button
            type="button"
            onClick={() => setDeliverTarget(order)}
            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            {isRevision ? "Deliver revision" : "Deliver work"}
          </button>
          <button
            type="button"
            onClick={() => setCancelTarget(order)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Cancel order
          </button>
        </>
      );
    }
    if (order.status === "delivered") {
      return <span className="text-slate-600">Delivered. Waiting for the client to approve or request a revision.</span>;
    }
    return null;
  }

  return (
    <DashboardShell
      role="freelancer"
      path="/dashboard/freelancer"
      title="Freelancer dashboard"
      subtitle="Manage your gigs and incoming orders."
      actions={
        <Link
          href="/dashboard/freelancer/gigs/new"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" /> Create gig
        </Link>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Briefcase} label="Total gigs" value={myGigs.length} tone="indigo" />
        <StatCard icon={ShoppingBag} label="Active orders" value={counts.active} tone="amber" />
        <StatCard icon={CheckCircle2} label="Completed orders" value={counts.completed} tone="emerald" />
        <StatCard
          icon={Wallet}
          label="Demo earnings"
          value={formatPrice(earnings)}
          hint={pending > 0 ? `${formatPrice(pending)} pending approval` : "From completed orders"}
          tone="slate"
        />
      </div>

      {/* My gigs */}
      <section className="mt-10" aria-labelledby="my-gigs-heading">
        <h2 id="my-gigs-heading" className="text-xl font-semibold text-slate-900">
          My gigs
        </h2>

        {myGigs.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <p className="font-semibold text-slate-900">You have not published any gigs yet</p>
            <p className="mt-1 text-sm text-slate-600">Create your first gig so clients can find you.</p>
            <Link
              href="/dashboard/freelancer/gigs/new"
              className="mt-5 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Create your first gig
            </Link>
          </div>
        ) : (
          <ul className="mt-4 space-y-4">
            {myGigs.map((gig) => {
              const { average, count } = getGigRating(gig.id);
              const categoryName = categories.find((c) => c.slug === gig.category)?.name ?? gig.category;
              return (
                <li
                  key={gig.id}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
                >
                  <div className="h-24 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:w-36">
                    <SafeImage src={gig.image} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/gigs/${gig.id}`}
                      className="line-clamp-2 font-semibold text-slate-900 transition hover:text-indigo-600"
                    >
                      {gig.title}
                    </Link>
                    <p className="mt-1 text-sm text-slate-500">
                      {categoryName} · {formatPrice(gig.price)} · {gig.deliveryDays} days
                    </p>
                    <RatingStars
                      className="mt-1"
                      rating={average}
                      count={count > 0 ? count : undefined}
                      showNumber
                      size={14}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditGig(gig)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      <Pencil className="h-4 w-4" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(gig)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Incoming orders */}
      <section className="mt-12" aria-labelledby="orders-heading">
        <h2 id="orders-heading" className="text-xl font-semibold text-slate-900">
          Incoming orders
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

        {visibleOrders.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <p className="font-semibold text-slate-900">
              {myOrders.length === 0 ? "No orders yet" : "No orders in this status"}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {myOrders.length === 0
                ? "Orders from clients will appear here."
                : "Try a different tab to see your other orders."}
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {visibleOrders.map((order) => (
              <OrderCard key={order.id} order={order} viewer="freelancer">
                {renderActions(order)}
              </OrderCard>
            ))}
          </div>
        )}
      </section>

      <Modal open={Boolean(editGig)} onClose={() => setEditGig(null)} title="Edit gig">
        {editGig && <GigForm key={editGig.id} gig={editGig} onDone={() => setEditGig(null)} />}
      </Modal>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete this gig?"
        message="This removes the gig from the marketplace. Existing orders for it will stay in your dashboard. This cannot be undone."
        confirmLabel="Delete gig"
        danger
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />

      <ConfirmModal
        open={Boolean(cancelTarget)}
        title="Cancel this order?"
        message="The order will be marked as cancelled for both you and the client."
        confirmLabel="Cancel order"
        danger
        onConfirm={confirmCancel}
        onClose={() => setCancelTarget(null)}
      />

      <DeliverModal order={deliverTarget} open={Boolean(deliverTarget)} onClose={() => setDeliverTarget(null)} />
    </DashboardShell>
  );
}