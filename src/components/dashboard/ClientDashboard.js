"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Heart, Package, Pencil, ShoppingBag, Trash2, Wallet, XCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useToast } from "@/components/ui/ToastProvider";
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
  { value: "all", label: "All Contracts" },
  { value: "active", label: "In Flight" },
  { value: "delivered", label: "Under Review" },
  { value: "completed", label: "Settled" },
  { value: "cancelled", label: "Refunded" },
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
  const [visible, setVisible] = useState(PAGE);
  const [reviewOrder, setReviewOrder] = useState(null);
  const [editReview, setEditReview] = useState(null);
  const [deleteReviewTarget, setDeleteReviewTarget] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);

  const myOrders = orders;

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
      const title = (o.title || "").toLowerCase();
      const freelancer = (o.freelancerName || "").toLowerCase();
      return title.includes(query) || freelancer.includes(query) || o.id.toLowerCase().includes(query);
    });

  const savedGigs = gigs.filter((g) => savedIds.includes(g.id));
  const firstName = user?.name?.split(" ")[0] ?? "Engineer";

  async function confirmCancel() {
    const result = await cancelOrder(cancelTarget.id);
    showToast(result.ok ? "Contract cancelled." : result.error, result.ok ? "success" : "error");
    setCancelTarget(null);
  }

  return (
    <DashboardShell
      role="client"
      path="/dashboard/client"
      title={`Welcome back, ${firstName}`}
      subtitle="Track your active escrow milestone vaults, contractor deliverables, and audit trails."
      actions={
        <Link
          href="/gigs"
          className="bg-[#047857] px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#065f46] shadow-sm"
        >
          BROWSE GIGS CATALOG →
        </Link>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={ShoppingBag} label="Active Pipeline" value={counts.active} hint="Milestones in flight" tone="indigo" />
        <StatCard icon={Package} label="Under Review" value={counts.delivered} hint="Action required" tone="amber" />
        <StatCard icon={CheckCircle2} label="Escrow Settled" value={counts.completed} hint="Disbursed contracts" tone="emerald" />
        <StatCard icon={Wallet} label="Total Escrow Vault" value={formatPrice(inProgressValue || 1840)} hint="Secured in vault" tone="indigo" />
      </div>

      {/* Contract ledger history */}
      <section className="mt-10 scroll-mt-24" aria-labelledby="history-heading">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-3">
          <h2 id="history-heading" className="font-serif text-2xl font-bold text-slate-950">
            CONTRACT LEDGER & SPRINT STATUS
          </h2>
          <Link
            href="/orders"
            className="font-mono text-xs font-bold uppercase tracking-wider text-[#047857] hover:underline"
          >
            OPEN FULL CONSOLE VIEW →
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 font-mono text-xs">
          {TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => {
                setTab(t.value);
                setVisible(PAGE);
              }}
              className={cn(
                "border px-3.5 py-1.5 uppercase tracking-wider transition",
                tab === t.value
                  ? "border-[#047857] bg-[#047857] font-bold text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              )}
            >
              {t.label} ({counts[t.value]})
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4 font-mono text-xs">
          {filteredOrders.slice(0, visible).map((order) => (
            <div
              key={order.id}
              className="border border-slate-200 bg-white p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-950">{order.code || `#${order.id}`}</span>
                  <span className="border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-[#047857] uppercase">
                    {order.statusLabel || order.status.toUpperCase()}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="font-sans font-semibold text-slate-700">{order.freelancerName}</span>
                </div>
                <h3 className="mt-2 font-serif text-lg font-bold text-slate-950 font-sans">
                  {order.title}
                </h3>
                <p className="mt-1 text-slate-500 font-sans text-xs">
                  {order.dueText || "Due in 2 days"} · Vault: ${order.price}.00 USD
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/orders/${order.id}`}
                  className="bg-slate-950 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-slate-800"
                >
                  INSPECT SPRINT SPEC →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Saved specs */}
      <section id="saved" className="mt-14 scroll-mt-24">
        <h2 className="font-serif text-2xl font-bold text-slate-950 border-b border-slate-200 pb-3">
          VAULT REPOSITORY (SAVED SPECS)
        </h2>
        {savedGigs.length === 0 ? (
          <div className="mt-4 border border-dashed border-slate-200 bg-white p-8 text-center font-mono text-xs text-slate-500">
            No saved specs in vault. Click the heart icon on any marketplace spec to shortlist it.
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {savedGigs.map((g) => (
              <GigCard key={g.id} gig={g} />
            ))}
          </div>
        )}
      </section>
    </DashboardShell>
  );
}
