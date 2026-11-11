"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Activity,
  Briefcase,
  CheckCircle2,
  Download,
  RefreshCw,
  ShieldAlert,
  ShoppingBag,
  Star,
  UserPlus,
  UserX,
  Users,
  Wallet,
} from "lucide-react";
import { categories } from "@/data/categories";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/ToastProvider";
import { createClient } from "@/lib/supabase/client";
import { downloadCsv } from "@/lib/csv";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/ui/StatusBadge";
import ConfirmModal from "@/components/ui/ConfirmModal";
import RatingStars from "@/components/ui/RatingStars";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import OrderDetailModal from "@/components/admin/OrderDetailModal";
import { inputClass } from "@/components/ui/FormField";
import { cn, formatDate, formatPrice } from "@/lib/utils";

const PAGE = 25;

const TABS = [
  { value: "overview", label: "Overview" },
  { value: "users", label: "Users" },
  { value: "gigs", label: "Gigs" },
  { value: "orders", label: "Orders" },
  { value: "reviews", label: "Reviews" },
  { value: "activity", label: "Activity log" },
];

const ORDER_STATUSES = ["active", "delivered", "completed", "cancelled"];

const ROLE_STYLES = {
  client: "bg-sky-50 text-sky-700 ring-sky-200",
  freelancer: "bg-violet-50 text-violet-700 ring-violet-200",
  admin: "bg-amber-50 text-amber-800 ring-amber-200",
};

const th = "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500";
const td = "px-4 py-3 align-middle";

function formatDateTime(iso) {
  return new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

function Notice({ title, text, href, label }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <ShieldAlert className="h-14 w-14 text-slate-300" />
      <h1 className="mt-4 text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-2 text-slate-600">{text}</p>
      <Link
        href={href}
        className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        {label}
      </Link>
    </div>
  );
}

function RoleBadge({ role }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset",
        ROLE_STYLES[role] ?? ROLE_STYLES.client
      )}
    >
      {role}
    </span>
  );
}

function TableShell({ children }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">{children}</table>
    </div>
  );
}

function EmptyRow({ colSpan, text }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-10 text-center text-slate-500">
        {text}
      </td>
    </tr>
  );
}

function ShowMore({ total, shown, onClick }) {
  if (shown >= total) return null;
  return (
    <div className="mt-4 text-center">
      <button
        type="button"
        onClick={onClick}
        className="rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
      >
        Show more ({total - shown} left)
      </button>
    </div>
  );
}

function ActionButton({ tone = "neutral", onClick, children }) {
  const styles =
    tone === "danger"
      ? "border-red-200 text-red-600 hover:bg-red-50"
      : tone === "good"
        ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
        : "border-slate-300 text-slate-700 hover:bg-slate-50";
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("rounded-lg border px-3 py-1.5 text-xs font-semibold transition", styles)}
    >
      {children}
    </button>
  );
}

function Toolbar({ children, onExport, exportLabel = "Export CSV" }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      {children}
      {onExport && (
        <button
          type="button"
          onClick={onExport}
          className="ml-auto inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <Download className="h-4 w-4" /> {exportLabel}
        </button>
      )}
    </div>
  );
}

export default function AdminPanel() {
  const { user, hydrated } = useAuth();
  const { showToast } = useToast();

  const [tab, setTab] = useState("overview");
  const [data, setData] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [confirm, setConfirm] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [visible, setVisible] = useState({ users: PAGE, gigs: PAGE, orders: PAGE, reviews: 20, activity: PAGE });

  const [userSearch, setUserSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [gigSearch, setGigSearch] = useState("");
  const [gigCategory, setGigCategory] = useState("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState("all");
  const [reviewSearch, setReviewSearch] = useState("");
  const [reviewRating, setReviewRating] = useState("all");

  const isAdmin = hydrated && user?.role === "admin";

  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const [usersRes, gigsRes, ordersRes, reviewsRes, logsRes] = await Promise.all([
        supabase.rpc("admin_list_users"),
        supabase.from("gigs").select("*").order("created_at", { ascending: false }),
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
        supabase.from("reviews").select("*").order("created_at", { ascending: false }),
        supabase.from("admin_logs").select("*").order("created_at", { ascending: false }).limit(200),
      ]);
      if (cancelled) return;

      const userRows = usersRes.data ?? [];
      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const failure = usersRes.error || gigsRes.error || ordersRes.error || reviewsRes.error || logsRes.error;

      setData({
        users: userRows,
        gigs: gigsRes.data ?? [],
        orders: ordersRes.data ?? [],
        reviews: reviewsRes.data ?? [],
        logs: logsRes.data ?? [],
        newUsers7d: userRows.filter((u) => new Date(u.created_at).getTime() >= weekAgo).length,
        error: failure ? failure.message : "",
      });
    }

    load().catch((problem) => {
      if (!cancelled) {
        setData({
          users: [],
          gigs: [],
          orders: [],
          reviews: [],
          logs: [],
          newUsers7d: 0,
          error: problem?.message || "Could not load data.",
        });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [isAdmin, reloadKey]);

  async function runAdminAction(fn, args, successMessage) {
    const { error } = await createClient().rpc(fn, args);
    if (error) {
      showToast(error.message || "The action failed.", "error");
      return;
    }
    showToast(successMessage);
    setReloadKey((key) => key + 1);
  }

  async function handleConfirm() {
    const current = confirm;
    setConfirm(null);
    if (current) await runAdminAction(current.fn, current.args, current.success);
  }

  function showMore(key) {
    setVisible((v) => ({ ...v, [key]: v[key] + PAGE }));
  }

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-7xl space-y-4 px-4 py-10" role="status" aria-label="Loading admin panel">
        <LoadingSkeleton className="h-9 w-1/3" />
        <LoadingSkeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <Notice
        title="Please log in"
        text="Log in with an admin account to open the admin panel."
        href={`/login?as=admin&next=${encodeURIComponent("/admin")}`}
        label="Go to admin login"
      />
    );
  }

  if (user.role !== "admin") {
    return (
      <Notice
        title="Admins only"
        text="This area is only for administrator accounts."
        href={user.role === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client"}
        label="Go to my dashboard"
      />
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-7xl space-y-4 px-4 py-10" role="status" aria-label="Loading admin data">
        <LoadingSkeleton className="h-9 w-1/3" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <LoadingSkeleton key={i} className="h-28 w-full" />
          ))}
        </div>
        <LoadingSkeleton className="h-64 w-full" />
      </div>
    );
  }

  const { users, gigs, orders, reviews, logs } = data;
  const nameById = new Map(users.map((u) => [u.id, u.full_name]));
  const gigTitleById = new Map(gigs.map((g) => [g.id, g.title]));

  /* ---------- Stats ---------- */
  const clientCount = users.filter((u) => u.role === "client").length;
  const freelancerCount = users.filter((u) => u.role === "freelancer").length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const suspendedCount = users.filter((u) => u.suspended).length;
  const completed = orders.filter((o) => o.status === "completed");
  const revenue = completed.reduce((sum, o) => sum + o.price, 0);
  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "-";

  const statusCounts = ORDER_STATUSES.map((status) => ({
    status,
    count: orders.filter((o) => o.status === status).length,
  }));
  const maxStatusCount = Math.max(1, ...statusCounts.map((s) => s.count));

  const earningsByFreelancer = new Map();
  completed.forEach((o) => {
    const entry = earningsByFreelancer.get(o.freelancer_id) ?? { orders: 0, value: 0 };
    entry.orders += 1;
    entry.value += o.price;
    earningsByFreelancer.set(o.freelancer_id, entry);
  });
  const topFreelancers = [...earningsByFreelancer.entries()]
    .sort((a, b) => b[1].orders - a[1].orders || b[1].value - a[1].value)
    .slice(0, 5);

  const counts = {
    overview: null,
    users: users.length,
    gigs: gigs.length,
    orders: orders.length,
    reviews: reviews.length,
    activity: logs.length,
  };

  /* ---------- Filters ---------- */
  const uq = userSearch.trim().toLowerCase();
  const filteredUsers = users.filter((u) => {
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (statusFilter === "active" && u.suspended) return false;
    if (statusFilter === "suspended" && !u.suspended) return false;
    if (!uq) return true;
    return (u.full_name ?? "").toLowerCase().includes(uq) || (u.email ?? "").toLowerCase().includes(uq);
  });

  const gq = gigSearch.trim().toLowerCase();
  const filteredGigs = gigs.filter((g) => {
    if (gigCategory !== "all" && g.category !== gigCategory) return false;
    if (!gq) return true;
    return (
      g.title.toLowerCase().includes(gq) || (nameById.get(g.freelancer_id) ?? "").toLowerCase().includes(gq)
    );
  });

  const oq = orderSearch.trim().toLowerCase();
  const filteredOrders = orders.filter((o) => {
    if (orderStatus !== "all" && o.status !== orderStatus) return false;
    if (!oq) return true;
    return (
      o.gig_title.toLowerCase().includes(oq) ||
      (nameById.get(o.client_id) ?? "").toLowerCase().includes(oq) ||
      (nameById.get(o.freelancer_id) ?? "").toLowerCase().includes(oq) ||
      o.id.slice(-6).toLowerCase().includes(oq)
    );
  });

  const rq = reviewSearch.trim().toLowerCase();
  const filteredReviews = reviews.filter((r) => {
    if (reviewRating !== "all" && r.rating !== Number(reviewRating)) return false;
    if (!rq) return true;
    return (
      r.comment.toLowerCase().includes(rq) ||
      (nameById.get(r.client_id) ?? "").toLowerCase().includes(rq) ||
      (nameById.get(r.freelancer_id) ?? "").toLowerCase().includes(rq)
    );
  });

  /* ---------- CSV exports ---------- */
  function exportUsers() {
    downloadCsv(
      "gignest-users.csv",
      filteredUsers.map((u) => ({
        Name: u.full_name,
        Email: u.email,
        Role: u.role,
        Status: u.suspended ? "Suspended" : "Active",
        Joined: formatDate(u.created_at),
        "Last sign-in": u.last_sign_in_at ? formatDate(u.last_sign_in_at) : "",
      }))
    );
  }

  function exportGigs() {
    downloadCsv(
      "gignest-gigs.csv",
      filteredGigs.map((g) => ({
        Title: g.title,
        Freelancer: nameById.get(g.freelancer_id) ?? "Unknown",
        Category: categories.find((c) => c.slug === g.category)?.name ?? g.category,
        Price: g.price,
        "Delivery days": g.delivery_days,
        Created: formatDate(g.created_at),
      }))
    );
  }

  function exportOrders() {
    downloadCsv(
      "gignest-orders.csv",
      filteredOrders.map((o) => ({
        Order: o.id.slice(-6).toUpperCase(),
        Gig: o.gig_title,
        Client: nameById.get(o.client_id) ?? "Unknown",
        Freelancer: nameById.get(o.freelancer_id) ?? "Unknown",
        Price: o.price,
        Status: o.status,
        Placed: formatDate(o.created_at),
      }))
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Admin panel</h1>
          <p className="mt-1 text-slate-600">Manage users, gigs, orders and reviews across GigNest.</p>
        </div>
        <button
          type="button"
          onClick={() => setReloadKey((key) => key + 1)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      {data.error && (
        <p role="alert" className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          Some data could not be loaded: {data.error}. Check that the admin SQL scripts were run.
        </p>
      )}

      <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Admin sections">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={tab === t.value}
            onClick={() => setTab(t.value)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-medium transition",
              tab === t.value
                ? "border-indigo-600 bg-indigo-600 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
            )}
          >
            {t.label}
            {counts[t.value] !== null && ` (${counts[t.value]})`}
          </button>
        ))}
      </div>

      {/* ---------- Overview ---------- */}
      {tab === "overview" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={Users}
              label="Total users"
              value={users.length}
              hint={`${clientCount} clients, ${freelancerCount} freelancers, ${adminCount} admins`}
              tone="indigo"
            />
            <StatCard icon={UserPlus} label="New users (7 days)" value={data.newUsers7d} tone="emerald" />
            <StatCard icon={UserX} label="Suspended users" value={suspendedCount} tone="slate" />
            <StatCard icon={Briefcase} label="Gigs" value={gigs.length} tone="indigo" />
            <StatCard
              icon={ShoppingBag}
              label="Orders"
              value={orders.length}
              hint={`${orders.filter((o) => o.status === "active").length} active`}
              tone="amber"
            />
            <StatCard icon={CheckCircle2} label="Completed orders" value={completed.length} tone="emerald" />
            <StatCard icon={Wallet} label="Completed order value" value={formatPrice(revenue)} tone="emerald" />
            <StatCard
              icon={Star}
              label="Reviews"
              value={reviews.length}
              hint={`Average rating ${averageRating}`}
              tone="amber"
            />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-label="Orders by status">
              <h2 className="text-lg font-semibold text-slate-900">Orders by status</h2>
              <ul className="mt-4 space-y-4">
                {statusCounts.map((s) => (
                  <li key={s.status}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <StatusBadge status={s.status} />
                      <span className="font-semibold text-slate-800">{s.count}</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-indigo-500"
                        style={{ width: `${(s.count / maxStatusCount) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-label="Top freelancers">
              <h2 className="text-lg font-semibold text-slate-900">Top freelancers</h2>
              {topFreelancers.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">No completed orders yet.</p>
              ) : (
                <ol className="mt-4 space-y-3">
                  {topFreelancers.map(([id, stats], index) => (
                    <li key={id} className="flex items-center justify-between gap-3 text-sm">
                      <span className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-700">
                          {index + 1}
                        </span>
                        <span className="font-medium text-slate-900">{nameById.get(id) ?? "Unknown"}</span>
                      </span>
                      <span className="text-slate-600">
                        {stats.orders} {stats.orders === 1 ? "order" : "orders"} · {formatPrice(stats.value)}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </div>
        </>
      )}

      {/* ---------- Users ---------- */}
      {tab === "users" && (
        <section aria-label="Users">
          <Toolbar onExport={exportUsers}>
            <input
              type="search"
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              placeholder="Search by name or email"
              aria-label="Search users"
              className={cn(inputClass, "max-w-xs")}
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              aria-label="Filter by role"
              className={cn(inputClass, "max-w-[170px]")}
            >
              <option value="all">All roles</option>
              <option value="client">Clients</option>
              <option value="freelancer">Freelancers</option>
              <option value="admin">Admins</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
              className={cn(inputClass, "max-w-[170px]")}
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </Toolbar>

          <TableShell>
            <thead className="bg-slate-50">
              <tr>
                <th className={th}>Name</th>
                <th className={th}>Email</th>
                <th className={th}>Role</th>
                <th className={th}>Joined</th>
                <th className={th}>Last sign-in</th>
                <th className={th}>Status</th>
                <th className={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <EmptyRow colSpan={7} text="No users match your filters." />
              ) : (
                filteredUsers.slice(0, visible.users).map((u) => {
                  const isSelf = u.id === user.id;
                  return (
                    <tr key={u.id} className="border-t border-slate-100">
                      <td className={cn(td, "font-medium text-slate-900")}>
                        {u.full_name}
                        {isSelf && <span className="ml-2 text-xs text-slate-400">(you)</span>}
                      </td>
                      <td className={cn(td, "text-slate-600")}>{u.email}</td>
                      <td className={td}>
                        <RoleBadge role={u.role} />
                      </td>
                      <td className={cn(td, "text-slate-600")}>{formatDate(u.created_at)}</td>
                      <td className={cn(td, "text-slate-600")}>
                        {u.last_sign_in_at ? formatDate(u.last_sign_in_at) : "-"}
                      </td>
                      <td className={td}>
                        {u.suspended ? (
                          <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-200">
                            Suspended
                          </span>
                        ) : (
                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                            Active
                          </span>
                        )}
                      </td>
                      <td className={td}>
                        {isSelf ? (
                          <span className="text-slate-400">-</span>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {u.role !== "admin" &&
                              (u.suspended ? (
                                <ActionButton
                                  onClick={() =>
                                    setConfirm({
                                      title: "Unsuspend this user?",
                                      message: `${u.full_name} will be able to log in and use GigNest again.`,
                                      label: "Unsuspend",
                                      danger: false,
                                      fn: "admin_set_suspended",
                                      args: { p_user: u.id, p_suspended: false },
                                      success: "User unsuspended.",
                                    })
                                  }
                                >
                                  Unsuspend
                                </ActionButton>
                              ) : (
                                <ActionButton
                                  tone="danger"
                                  onClick={() =>
                                    setConfirm({
                                      title: "Suspend this user?",
                                      message: `${u.full_name} will not be able to log in or make any changes until you unsuspend the account.`,
                                      label: "Suspend",
                                      danger: true,
                                      fn: "admin_set_suspended",
                                      args: { p_user: u.id, p_suspended: true },
                                      success: "User suspended.",
                                    })
                                  }
                                >
                                  Suspend
                                </ActionButton>
                              ))}

                            {u.role === "admin" ? (
                              <ActionButton
                                onClick={() =>
                                  setConfirm({
                                    title: "Remove admin access?",
                                    message: `${u.full_name} will become a regular client account and lose access to the admin panel.`,
                                    label: "Remove admin",
                                    danger: true,
                                    fn: "admin_set_admin",
                                    args: { p_user: u.id, p_is_admin: false },
                                    success: "Admin access removed.",
                                  })
                                }
                              >
                                Remove admin
                              </ActionButton>
                            ) : (
                              <ActionButton
                                tone="good"
                                onClick={() =>
                                  setConfirm({
                                    title: "Make this user an admin?",
                                    message: `${u.full_name} will get full control of users, gigs, orders and reviews. Only do this for people you trust.`,
                                    label: "Make admin",
                                    danger: false,
                                    fn: "admin_set_admin",
                                    args: { p_user: u.id, p_is_admin: true },
                                    success: "User is now an admin.",
                                  })
                                }
                              >
                                Make admin
                              </ActionButton>
                            )}

                            {u.role !== "admin" && (
                              <ActionButton
                                tone="danger"
                                onClick={() =>
                                  setConfirm({
                                    title: "Delete this user permanently?",
                                    message: `${u.full_name} will be deleted together with their gigs, orders and reviews. Orders shared with other users will disappear for them too. This cannot be undone.`,
                                    label: "Delete user",
                                    danger: true,
                                    fn: "admin_delete_user",
                                    args: { p_user: u.id },
                                    success: "User deleted.",
                                  })
                                }
                              >
                                Delete
                              </ActionButton>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </TableShell>
          <ShowMore total={filteredUsers.length} shown={visible.users} onClick={() => showMore("users")} />
        </section>
      )}

      {/* ---------- Gigs ---------- */}
      {tab === "gigs" && (
        <section aria-label="Gigs">
          <Toolbar onExport={exportGigs}>
            <input
              type="search"
              value={gigSearch}
              onChange={(e) => setGigSearch(e.target.value)}
              placeholder="Search by title or freelancer"
              aria-label="Search gigs"
              className={cn(inputClass, "max-w-xs")}
            />
            <select
              value={gigCategory}
              onChange={(e) => setGigCategory(e.target.value)}
              aria-label="Filter by category"
              className={cn(inputClass, "max-w-[220px]")}
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </Toolbar>

          <TableShell>
            <thead className="bg-slate-50">
              <tr>
                <th className={th}>Gig</th>
                <th className={th}>Freelancer</th>
                <th className={th}>Category</th>
                <th className={th}>Price</th>
                <th className={th}>Created</th>
                <th className={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGigs.length === 0 ? (
                <EmptyRow colSpan={6} text="No gigs match your filters." />
              ) : (
                filteredGigs.slice(0, visible.gigs).map((g) => (
                  <tr key={g.id} className="border-t border-slate-100">
                    <td className={cn(td, "max-w-xs")}>
                      <Link
                        href={`/gigs/${g.id}`}
                        className="line-clamp-2 font-medium text-slate-900 hover:text-indigo-600"
                      >
                        {g.title}
                      </Link>
                    </td>
                    <td className={cn(td, "text-slate-600")}>{nameById.get(g.freelancer_id) ?? "Unknown"}</td>
                    <td className={cn(td, "text-slate-600")}>
                      {categories.find((c) => c.slug === g.category)?.name ?? g.category}
                    </td>
                    <td className={td}>{formatPrice(g.price)}</td>
                    <td className={cn(td, "text-slate-600")}>{formatDate(g.created_at)}</td>
                    <td className={td}>
                      <ActionButton
                        tone="danger"
                        onClick={() =>
                          setConfirm({
                            title: "Delete this gig?",
                            message: `"${g.title}" will be removed from the marketplace. Existing orders for it stay in their dashboards.`,
                            label: "Delete gig",
                            danger: true,
                            fn: "admin_delete_gig",
                            args: { p_gig: g.id },
                            success: "Gig deleted.",
                          })
                        }
                      >
                        Delete
                      </ActionButton>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </TableShell>
          <ShowMore total={filteredGigs.length} shown={visible.gigs} onClick={() => showMore("gigs")} />
        </section>
      )}

      {/* ---------- Orders ---------- */}
      {tab === "orders" && (
        <section aria-label="Orders">
          <Toolbar onExport={exportOrders}>
            <input
              type="search"
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              placeholder="Search gig, client, freelancer or order ID"
              aria-label="Search orders"
              className={cn(inputClass, "max-w-xs")}
            />
            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              aria-label="Filter by status"
              className={cn(inputClass, "max-w-[170px]")}
            >
              <option value="all">All statuses</option>
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s} className="capitalize">
                  {s}
                </option>
              ))}
            </select>
          </Toolbar>

          <TableShell>
            <thead className="bg-slate-50">
              <tr>
                <th className={th}>Order</th>
                <th className={th}>Client</th>
                <th className={th}>Freelancer</th>
                <th className={th}>Price</th>
                <th className={th}>Status</th>
                <th className={th}>Placed</th>
                <th className={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <EmptyRow colSpan={7} text="No orders match your filters." />
              ) : (
                filteredOrders.slice(0, visible.orders).map((o) => (
                  <tr key={o.id} className="border-t border-slate-100">
                    <td className={cn(td, "max-w-xs")}>
                      <p className="line-clamp-2 font-medium text-slate-900">{o.gig_title}</p>
                      <p className="text-xs text-slate-500">#{o.id.slice(-6).toUpperCase()}</p>
                    </td>
                    <td className={cn(td, "text-slate-600")}>{nameById.get(o.client_id) ?? "Unknown"}</td>
                    <td className={cn(td, "text-slate-600")}>{nameById.get(o.freelancer_id) ?? "Unknown"}</td>
                    <td className={td}>{formatPrice(o.price)}</td>
                    <td className={td}>
                      <StatusBadge status={o.status} />
                    </td>
                    <td className={cn(td, "text-slate-600")}>{formatDate(o.created_at)}</td>
                    <td className={td}>
                      <div className="flex flex-wrap gap-2">
                        <ActionButton onClick={() => setSelectedOrder(o)}>View</ActionButton>
                        {o.status === "delivered" && (
                          <ActionButton
                            tone="good"
                            onClick={() =>
                              setConfirm({
                                title: "Mark this order as completed?",
                                message:
                                  "Use this when the client has not responded after delivery. The freelancer's completed orders count will increase.",
                                label: "Mark completed",
                                danger: false,
                                fn: "admin_complete_order",
                                args: { p_order: o.id },
                                success: "Order marked as completed.",
                              })
                            }
                          >
                            Complete
                          </ActionButton>
                        )}
                        {(o.status === "active" || o.status === "delivered") && (
                          <ActionButton
                            tone="danger"
                            onClick={() =>
                              setConfirm({
                                title: "Cancel this order?",
                                message:
                                  "The order will be cancelled for both the client and the freelancer. This cannot be undone.",
                                label: "Cancel order",
                                danger: true,
                                fn: "admin_cancel_order",
                                args: { p_order: o.id },
                                success: "Order cancelled.",
                              })
                            }
                          >
                            Cancel
                          </ActionButton>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </TableShell>
          <ShowMore total={filteredOrders.length} shown={visible.orders} onClick={() => showMore("orders")} />
        </section>
      )}

      {/* ---------- Reviews ---------- */}
      {tab === "reviews" && (
        <section aria-label="Reviews">
          <Toolbar>
            <input
              type="search"
              value={reviewSearch}
              onChange={(e) => setReviewSearch(e.target.value)}
              placeholder="Search comment, client or freelancer"
              aria-label="Search reviews"
              className={cn(inputClass, "max-w-xs")}
            />
            <select
              value={reviewRating}
              onChange={(e) => setReviewRating(e.target.value)}
              aria-label="Filter by rating"
              className={cn(inputClass, "max-w-[170px]")}
            >
              <option value="all">All ratings</option>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "star" : "stars"}
                </option>
              ))}
            </select>
          </Toolbar>

          <div className="space-y-4">
            {filteredReviews.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
                No reviews match your filters.
              </p>
            ) : (
              filteredReviews.slice(0, visible.reviews).map((r) => (
                <article key={r.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {nameById.get(r.client_id) ?? "Unknown"} reviewed {nameById.get(r.freelancer_id) ?? "Unknown"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {gigTitleById.get(r.gig_id) ?? "Deleted gig"} · {formatDate(r.created_at)}
                      </p>
                    </div>
                    <RatingStars rating={r.rating} />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-700">{r.comment}</p>
                  <div className="mt-4">
                    <ActionButton
                      tone="danger"
                      onClick={() =>
                        setConfirm({
                          title: "Delete this review?",
                          message: "The review will be removed from the gig and the freelancer's profile.",
                          label: "Delete review",
                          danger: true,
                          fn: "admin_delete_review",
                          args: { p_review: r.id },
                          success: "Review deleted.",
                        })
                      }
                    >
                      Delete review
                    </ActionButton>
                  </div>
                </article>
              ))
            )}
          </div>
          <ShowMore total={filteredReviews.length} shown={visible.reviews} onClick={() => showMore("reviews")} />
        </section>
      )}

      {/* ---------- Activity log ---------- */}
      {tab === "activity" && (
        <section aria-label="Activity log">
          <p className="mb-4 flex items-center gap-2 text-sm text-slate-600">
            <Activity className="h-4 w-4" /> Every admin action is recorded here (latest 200).
          </p>
          <TableShell>
            <thead className="bg-slate-50">
              <tr>
                <th className={th}>When</th>
                <th className={th}>Admin</th>
                <th className={th}>Action</th>
                <th className={th}>Target</th>
                <th className={th}>Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <EmptyRow colSpan={5} text="No admin actions have been recorded yet." />
              ) : (
                logs.slice(0, visible.activity).map((l) => (
                  <tr key={l.id} className="border-t border-slate-100">
                    <td className={cn(td, "whitespace-nowrap text-slate-600")}>{formatDateTime(l.created_at)}</td>
                    <td className={cn(td, "text-slate-900")}>{nameById.get(l.admin_id) ?? "Unknown"}</td>
                    <td className={cn(td, "font-medium text-slate-900")}>{l.action}</td>
                    <td className={cn(td, "text-slate-600")}>{l.target}</td>
                    <td className={cn(td, "text-slate-600")}>{l.details || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </TableShell>
          <ShowMore total={logs.length} shown={visible.activity} onClick={() => showMore("activity")} />
        </section>
      )}

      <OrderDetailModal
        order={selectedOrder}
        clientName={selectedOrder ? (nameById.get(selectedOrder.client_id) ?? "Unknown") : ""}
        freelancerName={selectedOrder ? (nameById.get(selectedOrder.freelancer_id) ?? "Unknown") : ""}
        onClose={() => setSelectedOrder(null)}
      />

      <ConfirmModal
        open={Boolean(confirm)}
        title={confirm?.title ?? ""}
        message={confirm?.message ?? ""}
        confirmLabel={confirm?.label}
        danger={confirm?.danger}
        onConfirm={handleConfirm}
        onClose={() => setConfirm(null)}
      />
    </div>
  );
}