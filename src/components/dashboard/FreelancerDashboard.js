"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Briefcase,
  CheckCircle2,
  Circle,
  Clock,
  Copy,
  Download,
  MessageSquare,
  Pause,
  Pencil,
  Percent,
  Play,
  Plus,
  ShoppingBag,
  Star,
  Timer,
  Trash2,
  Wallet,
} from "lucide-react";
import { categories } from "@/data/categories";
import { useAuth } from "@/context/AuthContext";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useToast } from "@/components/ui/ToastProvider";
import { createClient } from "@/lib/supabase/client";
import { downloadCsv } from "@/lib/csv";
import DashboardShell from "@/components/dashboard/DashboardShell";
import StatCard from "@/components/dashboard/StatCard";
import GigForm from "@/components/dashboard/GigForm";
import OrderCard from "@/components/orders/OrderCard";
import DeliverModal from "@/components/orders/DeliverModal";
import ReviewCard from "@/components/reviews/ReviewCard";
import ReplyModal from "@/components/reviews/ReplyModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import Modal from "@/components/ui/Modal";
import RatingStars from "@/components/ui/RatingStars";
import SafeImage from "@/components/ui/SafeImage";
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

// Order kab complete hua (timeline se)
function completedAt(order) {
  const event = [...order.timeline].reverse().find((e) => e.status === "completed");
  return event ? event.date : order.createdAt;
}

// Order dene ki tareekh = order ki tareekh + gig ke delivery days
function dueDate(order) {
  const days = order.gigSnapshot?.deliveryDays ?? 0;
  const date = new Date(order.createdAt);
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

export default function FreelancerDashboard() {
  const { user } = useAuth();
  const {
    allGigs,
    orders,
    getFreelancer,
    getProfile,
    getOrderGig,
    getGigRating,
    getFreelancerRating,
    getFreelancerReviews,
    updateGig,
    deleteGig,
    cancelOrder,
    refreshPublic,
  } = useMarketplace();
  const { showToast } = useToast();

  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [visible, setVisible] = useState(PAGE);
  const [editGig, setEditGig] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deliverTarget, setDeliverTarget] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [replyReview, setReplyReview] = useState(null);
  const [now, setNow] = useState(null);

  // Abhi ka samay (overdue dikhane ke liye). Server par nahi, sirf browser mein.
  useEffect(() => {
    const id = setTimeout(() => setNow(Date.now()), 0);
    return () => clearTimeout(id);
  }, []);

  const me = user ? getFreelancer(user.id) : null;
  const myGigs = user ? allGigs.filter((g) => g.freelancerId === user.id) : [];
  const myOrders = user ? orders.filter((o) => o.freelancerId === user.id) : [];

  const counts = {
    all: myOrders.length,
    active: myOrders.filter((o) => o.status === "active").length,
    delivered: myOrders.filter((o) => o.status === "delivered").length,
    completed: myOrders.filter((o) => o.status === "completed").length,
    cancelled: myOrders.filter((o) => o.status === "cancelled").length,
  };

  const completedOrders = myOrders.filter((o) => o.status === "completed");
  const earned = completedOrders.reduce((sum, o) => sum + o.price, 0);
  const pendingValue = myOrders.filter((o) => o.status === "delivered").reduce((sum, o) => sum + o.price, 0);
  const inProgressValue = myOrders.filter((o) => o.status === "active").reduce((sum, o) => sum + o.price, 0);

  const rating = user ? getFreelancerRating(user.id) : { average: 0, count: 0 };
  const myReviews = user ? getFreelancerReviews(user.id) : [];

  /* ---------- Performance ---------- */
  const decided = counts.completed + counts.cancelled;
  const completionRate = decided > 0 ? Math.round((counts.completed / decided) * 100) : null;

  const deliveredOrders = myOrders.filter((o) => o.timeline.some((e) => e.status === "delivered"));
  const onTimeCount = deliveredOrders.filter((o) => {
    const delivered = o.timeline.find((e) => e.status === "delivered");
    return new Date(delivered.date) <= new Date(dueDate(o));
  }).length;
  const onTimeRate = deliveredOrders.length > 0 ? Math.round((onTimeCount / deliveredOrders.length) * 100) : null;

  /* ---------- Earnings by month (completed orders) ---------- */
  const monthTotals = new Map();
  completedOrders.forEach((order) => {
    const date = new Date(completedAt(order));
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    monthTotals.set(key, (monthTotals.get(key) ?? 0) + order.price);
  });
  const months = [...monthTotals.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1)).slice(-6);
  const maxMonth = Math.max(1, ...months.map(([, value]) => value));

  /* ---------- Profile completeness ---------- */
  const checklist = me
    ? [
        { label: "Write a professional headline", done: me.headline.trim().length >= 5, href: `/freelancers/${user.id}` },
        { label: "Write a short bio (20+ characters)", done: me.bio.trim().length >= 20, href: `/freelancers/${user.id}` },
        { label: "Add at least 3 skills", done: me.skills.length >= 3, href: `/freelancers/${user.id}` },
        { label: "Add your location", done: me.location.trim().length > 0, href: `/freelancers/${user.id}` },
        { label: "Upload a profile photo", done: me.avatar.startsWith("http"), href: "/account" },
        { label: "Add a portfolio project", done: me.portfolio.length > 0, href: `/freelancers/${user.id}#portfolio` },
        { label: "Publish your first gig", done: myGigs.length > 0, href: "/dashboard/freelancer/gigs/new" },
      ]
    : [];
  const doneCount = checklist.filter((item) => item.done).length;
  const percent = checklist.length ? Math.round((doneCount / checklist.length) * 100) : 100;

  /* ---------- Order list ---------- */
  const query = search.trim().toLowerCase();
  const filteredOrders = myOrders
    .filter((o) => tab === "all" || o.status === tab)
    .filter((o) => {
      if (!query) return true;
      const title = (getOrderGig(o)?.title ?? "").toLowerCase();
      const client = (getProfile(o.clientId)?.name ?? "").toLowerCase();
      return title.includes(query) || client.includes(query) || o.id.slice(-6).toLowerCase().includes(query);
    })
    .sort((a, b) => {
      if (sort === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sort === "price-high") return b.price - a.price;
      if (sort === "price-low") return a.price - b.price;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  function exportOrders() {
    downloadCsv(
      "my-orders.csv",
      filteredOrders.map((o) => ({
        Order: o.id.slice(-6).toUpperCase(),
        Gig: getOrderGig(o)?.title ?? "",
        Client: getProfile(o.clientId)?.name ?? "Unknown",
        Price: o.price,
        Status: o.status,
        Placed: formatDate(o.createdAt),
        Completed: o.status === "completed" ? formatDate(completedAt(o)) : "",
      }))
    );
  }

  async function copyProfileLink() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/freelancers/${user.id}`);
      showToast("Profile link copied.");
    } catch {
      showToast("Could not copy the link.", "error");
    }
  }

  async function toggleAvailability() {
    if (!user || !me) return;
    const next = !me.available;
    const { data, error } = await createClient()
      .from("profiles")
      .update({ available: next })
      .eq("id", user.id)
      .select("id");
    if (error || !data || data.length === 0) {
      showToast(error?.message || "Could not update your availability.", "error");
      return;
    }
    await refreshPublic();
    showToast(
      next ? "You are now accepting new orders." : "New orders are paused until you turn this back on."
    );
  }

  async function togglePause(gig) {
    const result = await updateGig(gig.id, { isActive: !gig.isActive });
    if (!result.ok) {
      showToast(result.error, "error");
      return;
    }
    showToast(gig.isActive ? "Gig paused. Clients cannot see it now." : "Your gig is live again.");
  }

  async function confirmDelete() {
    const result = await deleteGig(deleteTarget.id);
    showToast(result.ok ? "Gig deleted." : result.error, result.ok ? "success" : "error");
    setDeleteTarget(null);
  }

  async function confirmCancel() {
    const result = await cancelOrder(cancelTarget.id);
    showToast(result.ok ? "Order cancelled." : result.error, result.ok ? "success" : "error");
    setCancelTarget(null);
  }

  function renderActions(order) {
    if (order.status === "active") {
      const latest = order.timeline[order.timeline.length - 1]?.label ?? "";
      const isRevision = latest.startsWith("Revision requested");
      const due = dueDate(order);
      const overdue = now !== null && new Date(due).getTime() < now;
      return (
        <>
          {isRevision && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
              Revision requested
            </span>
          )}
          {overdue ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-200">
              <Clock className="h-3.5 w-3.5" /> Overdue since {formatDate(due)}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-slate-600">
              <Clock className="h-4 w-4" /> Due {formatDate(due)}
            </span>
          )}
          <button
            type="button"
            onClick={() => setDeliverTarget(order)}
            className="ml-auto rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
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
    if (order.status === "completed") {
      return (
        <span className="font-medium text-emerald-700">
          Earned {formatPrice(order.price)} on {formatDate(completedAt(order))}
        </span>
      );
    }
    return null;
  }

  return (
    <DashboardShell
      role="freelancer"
      path="/dashboard/freelancer"
      title="Freelancer dashboard"
      subtitle="Manage your gigs, orders and earnings."
      actions={
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={copyProfileLink}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Copy className="h-4 w-4" /> Copy profile link
          </button>
          <Link
            href="/messages"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <MessageSquare className="h-4 w-4" /> Messages
          </Link>
          <Link
            href="/dashboard/freelancer/gigs/new"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" /> Create gig
          </Link>
        </div>
      }
    >
      {/* Availability */}
      {me && (
        <section
          className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          aria-label="Availability"
        >
          <div>
            <p className="font-semibold text-slate-900">
              {me.available ? "You are accepting new orders" : "You are not accepting new orders"}
            </p>
            <p className="mt-0.5 text-sm text-slate-600">
              {me.available
                ? "Clients can order your gigs. Turn this off when you are too busy."
                : "Clients see a notice on your profile and cannot place new orders."}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={me.available}
            aria-label="Accepting new orders"
            onClick={toggleAvailability}
            className={cn(
              "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
              me.available ? "bg-emerald-500" : "bg-slate-300"
            )}
          >
            <span
              className={cn(
                "inline-block h-5 w-5 rounded-full bg-white shadow transition",
                me.available ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
        </section>
      )}

      {/* Profile completeness */}
      {percent < 100 && (
        <section
          className="mb-8 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5"
          aria-labelledby="completeness-heading"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="completeness-heading" className="text-base font-semibold text-slate-900">
              Complete your profile ({doneCount} of {checklist.length})
            </h2>
            <span className="text-sm font-semibold text-indigo-700">{percent}%</span>
          </div>
          <div
            className="mt-3 h-2.5 overflow-hidden rounded-full bg-white"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Profile completeness"
          >
            <div className="h-full rounded-full bg-indigo-600" style={{ width: `${percent}%` }} />
          </div>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {checklist.map((item) => (
              <li key={item.label} className="flex items-center gap-2 text-sm">
                {item.done ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-slate-400" />
                )}
                {item.done ? (
                  <span className="text-slate-500 line-through">{item.label}</span>
                ) : (
                  <Link href={item.href} className="font-medium text-indigo-700 hover:text-indigo-800">
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Briefcase} label="Total gigs" value={myGigs.length} tone="indigo" />
        <StatCard icon={ShoppingBag} label="Active orders" value={counts.active} tone="amber" />
        <StatCard icon={CheckCircle2} label="Completed orders" value={counts.completed} tone="emerald" />
        <StatCard icon={Wallet} label="Earnings" value={formatPrice(earned)} hint="From completed orders" tone="emerald" />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={Star}
          label="Rating"
          value={rating.count > 0 ? rating.average.toFixed(1) : "New"}
          hint={rating.count > 0 ? `${rating.count} ${rating.count === 1 ? "review" : "reviews"}` : "No reviews yet"}
          tone="amber"
        />
        <StatCard
          icon={Clock}
          label="Pending approval"
          value={formatPrice(pendingValue)}
          hint="Delivered, waiting for the client"
          tone="slate"
        />
        <StatCard
          icon={ShoppingBag}
          label="In progress"
          value={formatPrice(inProgressValue)}
          hint="Active orders"
          tone="indigo"
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <StatCard
          icon={Percent}
          label="Completion rate"
          value={completionRate === null ? "-" : `${completionRate}%`}
          hint={completionRate === null ? "Shown after your first finished order" : "Completed out of completed and cancelled"}
          tone="emerald"
        />
        <StatCard
          icon={Timer}
          label="On-time delivery"
          value={onTimeRate === null ? "-" : `${onTimeRate}%`}
          hint={onTimeRate === null ? "Shown after your first delivery" : "Delivered within the gig's delivery time"}
          tone="indigo"
        />
      </div>

      {/* Earnings by month */}
      <section className="mt-10" aria-labelledby="earnings-heading">
        <h2 id="earnings-heading" className="text-xl font-semibold text-slate-900">
          Earnings by month
        </h2>
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          {months.length === 0 ? (
            <p className="text-sm text-slate-500">Your monthly earnings will appear here after your first completed order.</p>
          ) : (
            <ul className="space-y-3">
              {months.map(([key, value]) => (
                <li key={key} className="flex items-center gap-3 text-sm">
                  <span className="w-20 shrink-0 text-slate-600">
                    {new Date(`${key}-01T00:00:00`).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(value / maxMonth) * 100}%` }} />
                  </div>
                  <span className="w-20 shrink-0 text-right font-semibold text-slate-900">{formatPrice(value)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

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
              const gigOrders = myOrders.filter((o) => o.gigId === gig.id);
              const gigEarned = gigOrders.filter((o) => o.status === "completed").reduce((sum, o) => sum + o.price, 0);
              return (
                <li
                  key={gig.id}
                  className={cn(
                    "flex flex-col gap-4 rounded-2xl border bg-white p-4 shadow-sm sm:flex-row sm:items-center",
                    gig.isActive ? "border-slate-200" : "border-amber-200 bg-amber-50/40"
                  )}
                >
                  <div className="h-24 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:w-36">
                    <SafeImage src={gig.image} alt="" className={cn("h-full w-full object-cover", !gig.isActive && "opacity-60")} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {gig.isActive ? (
                        <Link
                          href={`/gigs/${gig.id}`}
                          className="line-clamp-2 font-semibold text-slate-900 transition hover:text-indigo-600"
                        >
                          {gig.title}
                        </Link>
                      ) : (
                        <>
                          <span className="line-clamp-2 font-semibold text-slate-700">{gig.title}</span>
                          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                            Paused
                          </span>
                        </>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      {categoryName} · {formatPrice(gig.price)} · {gig.deliveryDays} days
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {gigOrders.length} {gigOrders.length === 1 ? "order" : "orders"} · {formatPrice(gigEarned)} earned
                    </p>
                    <RatingStars
                      className="mt-1"
                      rating={average}
                      count={count > 0 ? count : undefined}
                      showNumber
                      size={14}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => togglePause(gig)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      {gig.isActive ? (
                        <>
                          <Pause className="h-4 w-4" /> Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" /> Resume
                        </>
                      )}
                    </button>
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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="orders-heading" className="text-xl font-semibold text-slate-900">
            Incoming orders
          </h2>
          {filteredOrders.length > 0 && (
            <button
              type="button"
              onClick={exportOrders}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Download className="h-4 w-4" /> Export CSV
            </button>
          )}
        </div>

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
              placeholder="Search by gig, client or order ID"
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
              {myOrders.length === 0 ? "No orders yet" : "No orders match your filters"}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {myOrders.length === 0
                ? "Orders from clients will appear here."
                : "Try a different tab or clear the search."}
            </p>
          </div>
        ) : (
          <>
            <div className="mt-6 space-y-4">
              {filteredOrders.slice(0, visible).map((order) => (
                <OrderCard key={order.id} order={order} viewer="freelancer">
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

      {/* Recent reviews */}
      <section className="mt-12" aria-labelledby="recent-reviews-heading">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="recent-reviews-heading" className="text-xl font-semibold text-slate-900">
            Recent reviews
          </h2>
          {myReviews.length > 3 && user && (
            <Link
              href={`/freelancers/${user.id}`}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View all {myReviews.length}
            </Link>
          )}
        </div>
        {myReviews.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm text-slate-600">
            You have no reviews yet. Clients can review you after an order is completed.
          </p>
        ) : (
          <div className="mt-4 space-y-5">
            {myReviews.slice(0, 3).map((review) => (
              <div key={review.id}>
                <ReviewCard review={review} />
                <button
                  type="button"
                  onClick={() => setReplyReview(review)}
                  className="mt-2 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  {review.reply ? "Edit reply" : "Reply"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <Modal open={Boolean(editGig)} onClose={() => setEditGig(null)} title="Edit gig">
        {editGig && <GigForm key={editGig.id} gig={editGig} onDone={() => setEditGig(null)} />}
      </Modal>

      <ReplyModal review={replyReview} open={Boolean(replyReview)} onClose={() => setReplyReview(null)} />

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