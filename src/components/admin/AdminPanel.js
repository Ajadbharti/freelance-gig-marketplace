"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import {
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Filter,
  Layers,
  LayoutDashboard,
  Lock,
  Package,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Star,
  Trash2,
  UserCheck,
  UserX,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/ToastProvider";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import AdminStatsCard from "./AdminStatsCard";
import UserDetailsModal from "./UserDetailsModal";
import GigDetailsModal from "./GigDetailsModal";
import { adminApi } from "@/lib/api/adminApi";
import { formatPrice } from "@/lib/utils";

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const [activeSection, setActiveSection] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Core Data Stores
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFreelancers: 0,
    totalClients: 0,
    activeUsers: 0,
    suspendedUsers: 0,
    totalGigs: 0,
    pendingGigs: 0,
    publishedGigs: 0,
    totalOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    simulatedVolume: 0,
    transactionCount: 0,
  });

  const [users, setUsers] = useState([]);
  const [gigs, setGigs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [payments, setPayments] = useState([]);
  const [reports, setReports] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Modals & Inspect Targets
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGig, setSelectedGig] = useState(null);
  const [categoryModal, setCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");

  // Filters & Search
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [userStatusFilter, setUserStatusFilter] = useState("all");

  const [gigSearch, setGigSearch] = useState("");
  const [gigStatusFilter, setGigStatusFilter] = useState("all");

  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");

  // Load All Telemetry & Records
  const loadData = useCallback(async () => {
    try {
      setRefreshing(true);

      const [statsRes, usersRes, gigsRes, catsRes, ordersRes, reviewsRes, paymentsRes, reportsRes, logsRes] =
        await Promise.allSettled([
          adminApi.getStats(),
          adminApi.getUsers(),
          adminApi.getGigs(),
          adminApi.getCategories(),
          adminApi.getOrders(),
          adminApi.getReviews(),
          adminApi.getPayments(),
          adminApi.getReports(),
          adminApi.getAuditLogs(),
        ]);

      if (statsRes.status === "fulfilled" && statsRes.value?.stats) {
        setStats(statsRes.value.stats);
      }
      if (usersRes.status === "fulfilled" && usersRes.value?.users) {
        setUsers(usersRes.value.users);
      }
      if (gigsRes.status === "fulfilled" && gigsRes.value?.gigs) {
        setGigs(gigsRes.value.gigs);
      }
      if (catsRes.status === "fulfilled" && catsRes.value?.categories) {
        setCategories(catsRes.value.categories);
      }
      if (ordersRes.status === "fulfilled" && ordersRes.value?.orders) {
        setOrders(ordersRes.value.orders);
      }
      if (reviewsRes.status === "fulfilled" && reviewsRes.value?.reviews) {
        setReviews(reviewsRes.value.reviews);
      }
      if (paymentsRes.status === "fulfilled" && paymentsRes.value?.payments) {
        setPayments(paymentsRes.value.payments);
      }
      if (reportsRes.status === "fulfilled" && reportsRes.value?.reports) {
        setReports(reportsRes.value.reports);
      }
      if (logsRes.status === "fulfilled" && logsRes.value?.logs) {
        setAuditLogs(logsRes.value.logs);
      }
    } catch (err) {
      console.warn("Backend connectivity notice:", err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Actions
  async function handleUpdateUserStatus(userId, status, reason) {
    try {
      await adminApi.updateUserStatus(userId, { status, reason });
      showToast(`User status successfully changed to ${status}.`, "success");
      loadData();
      setSelectedUser(null);
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  async function handleDeleteUser(userId, reason) {
    try {
      await adminApi.deleteUser(userId, { reason });
      showToast("User account permanently purged.", "success");
      loadData();
      setSelectedUser(null);
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  async function handleApproveGig(gigId) {
    try {
      await adminApi.approveGig(gigId, { reason: "Standard approval" });
      showToast("Gig approved and published to public catalog.", "success");
      loadData();
      setSelectedGig(null);
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  async function handleRejectGig(gigId, reason) {
    try {
      await adminApi.rejectGig(gigId, { reason });
      showToast("Gig rejected with audited reason.", "info");
      loadData();
      setSelectedGig(null);
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  async function handleSuspendGig(gigId, reason) {
    try {
      await adminApi.suspendGig(gigId, { reason });
      showToast("Gig suspended from search.", "info");
      loadData();
      setSelectedGig(null);
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  async function handleCreateCategory(e) {
    e.preventDefault();
    if (!newCatName || !newCatSlug) return;
    try {
      await adminApi.createCategory({
        name: newCatName,
        slug: newCatSlug,
        description: newCatDesc,
      });
      showToast("New category node deployed.", "success");
      setCategoryModal(false);
      setNewCatName("");
      setNewCatSlug("");
      setNewCatDesc("");
      loadData();
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  async function handleDeleteCategory(catId) {
    if (!window.confirm("Delete this category? (Will be rejected if active gigs exist).")) return;
    try {
      await adminApi.deleteCategory(catId);
      showToast("Category removed successfully.", "success");
      loadData();
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  async function handleToggleHideReview(revId) {
    try {
      await adminApi.toggleHideReview(revId);
      showToast("Review visibility updated.", "success");
      loadData();
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  async function handleDeleteReview(revId) {
    if (!window.confirm("Permanently delete this review from the ledger?")) return;
    try {
      await adminApi.deleteReview(revId);
      showToast("Review deleted.", "success");
      loadData();
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  async function handleResolveReport(repId, status) {
    try {
      await adminApi.updateReportStatus(repId, { status, notes: "Marked resolved by Admin" });
      showToast(`Report updated to ${status}.`, "success");
      loadData();
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  // Filtered Computed Sets
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      !userSearch ||
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase());
    const matchRole = userRoleFilter === "all" || u.role === userRoleFilter;
    const matchStatus = userStatusFilter === "all" || u.status === userStatusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const filteredGigs = gigs.filter((g) => {
    const matchSearch = !gigSearch || g.title?.toLowerCase().includes(gigSearch.toLowerCase());
    const matchStatus = gigStatusFilter === "all" || g.status === gigStatusFilter;
    return matchSearch && matchStatus;
  });

  const pendingGigsList = gigs.filter((g) => g.status === "pending");

  const filteredOrders = orders.filter((o) => {
    const matchSearch = !orderSearch || o.code?.toLowerCase().includes(orderSearch.toLowerCase());
    const matchStatus = orderStatusFilter === "all" || o.status === orderStatusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr] items-start">
            {/* Sidebar Navigation */}
            <AdminSidebar
              activeSection={activeSection}
              onSelectSection={setActiveSection}
              stats={stats}
              user={user}
              onLogout={logout}
            />

            {/* Main Admin Content Body */}
            <div className="space-y-6 min-w-0">
              <AdminHeader
                title={activeSection.replace(/-/g, " ")}
                subtitle="Deterministic Governance & Escrow Controls"
                onRefresh={loadData}
                isRefreshing={refreshing}
              />

              {/* 1. OVERVIEW SECTION */}
              {activeSection === "overview" && (
                <div className="space-y-6">
                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <AdminStatsCard
                      icon={Users}
                      label="REGISTERED USERS"
                      value={stats.totalUsers}
                      sublabel={`${stats.totalFreelancers} Freelancers · ${stats.totalClients} Clients`}
                      tone="navy"
                    />
                    <AdminStatsCard
                      icon={Clock}
                      label="PENDING GIG SPECS"
                      value={stats.pendingGigs}
                      sublabel="AWAITING GOVERNANCE AUDIT"
                      tone={stats.pendingGigs > 0 ? "amber" : "emerald"}
                    />
                    <AdminStatsCard
                      icon={Package}
                      label="PUBLISHED GIGS"
                      value={stats.publishedGigs}
                      sublabel="IN PUBLIC REPOSITORY"
                      tone="emerald"
                    />
                    <AdminStatsCard
                      icon={Wallet}
                      label="SIMULATED ESCROW"
                      value={`₹${stats.simulatedVolume.toLocaleString("en-IN")}`}
                      sublabel={`${stats.totalOrders} TOTAL CONTRACTS`}
                      tone="emerald"
                    />
                  </div>

                  {/* Pending Gig Queue Quick Audit */}
                  <div className="border border-[#e5e7eb] bg-white p-6 shadow-[3px_3px_0px_#0b1c30]">
                    <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 bg-amber-500" />
                        <h2 className="font-headline text-base font-bold uppercase text-[#0b1c30]">
                          PENDING SPEC APPROVAL QUEUE ({pendingGigsList.length})
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveSection("gig-approvals")}
                        className="font-mono text-xs font-bold uppercase text-[#005d42] hover:underline"
                      >
                        VIEW FULL QUEUE →
                      </button>
                    </div>

                    {pendingGigsList.length === 0 ? (
                      <div className="py-8 text-center font-mono text-xs text-[#6e7a73]">
                        <CheckCircle2 className="mx-auto h-8 w-8 text-[#005d42] mb-2" />
                        ALL SPECIFICATIONS AUDITED. ZERO PENDING SUBMISSIONS.
                      </div>
                    ) : (
                      <div className="mt-4 divide-y divide-slate-100 font-mono text-xs">
                        {pendingGigsList.slice(0, 3).map((g) => (
                          <div key={g._id || g.id} className="py-3 flex items-center justify-between gap-4">
                            <div>
                              <p className="font-bold text-[#0b1c30] truncate">{g.title}</p>
                              <p className="text-[10px] text-[#6e7a73]">{g.category} // Starting {formatPrice(g.price)}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setSelectedGig(g)}
                              className="border border-[#0b1c30] bg-[#eff4ff] px-3 py-1 font-bold text-[#0047bf] hover:bg-[#dae2fd]"
                            >
                              INSPECT SPEC
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recent Audit Logs */}
                  <div className="border border-[#e5e7eb] bg-white p-6 shadow-[3px_3px_0px_#0b1c30]">
                    <h2 className="font-headline text-base font-bold uppercase text-[#0b1c30] border-b border-[#e5e7eb] pb-3">
                      RECENT GOVERNANCE AUDIT LOGS
                    </h2>
                    {auditLogs.length === 0 ? (
                      <p className="py-6 text-center font-mono text-xs text-[#6e7a73]">
                        No administrative actions recorded yet.
                      </p>
                    ) : (
                      <div className="mt-4 space-y-2 font-mono text-xs">
                        {auditLogs.slice(0, 6).map((log) => (
                          <div key={log._id} className="border border-slate-100 p-2.5 flex items-center justify-between gap-3 bg-slate-50/50">
                            <div>
                              <span className="border border-[#0b1c30] bg-[#0b1c30] px-1.5 py-0.2 text-[9px] font-bold text-white uppercase">
                                {log.action}
                              </span>
                              <span className="ml-2 font-bold text-[#0b1c30]">{log.targetResource} #{String(log.targetResourceId).slice(-6)}</span>
                              <p className="text-[10px] text-[#6e7a73] mt-0.5">{log.reason}</p>
                            </div>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              {new Date(log.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 2. MANAGE USERS / FREELANCERS / CLIENTS */}
              {(activeSection === "users" || activeSection === "freelancers" || activeSection === "clients") && (
                <div className="border border-[#e5e7eb] bg-white p-6 shadow-[3px_3px_0px_#0b1c30] space-y-4">
                  {/* Filters Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs border-b border-[#e5e7eb] pb-4">
                    <div className="flex items-center gap-2 flex-1 max-w-sm">
                      <Search className="h-4 w-4 text-[#6e7a73]" />
                      <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="w-full border border-[#0b1c30] px-2.5 py-1.5 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      {activeSection === "users" && (
                        <select
                          value={userRoleFilter}
                          onChange={(e) => setUserRoleFilter(e.target.value)}
                          className="border border-[#0b1c30] bg-white px-2 py-1.5 font-bold uppercase"
                        >
                          <option value="all">ALL ROLES</option>
                          <option value="client">CLIENTS</option>
                          <option value="freelancer">FREELANCERS</option>
                          <option value="admin">ADMINS</option>
                        </select>
                      )}

                      <select
                        value={userStatusFilter}
                        onChange={(e) => setUserStatusFilter(e.target.value)}
                        className="border border-[#0b1c30] bg-white px-2 py-1.5 font-bold uppercase"
                      >
                        <option value="all">ALL STATUSES</option>
                        <option value="active">ACTIVE</option>
                        <option value="suspended">SUSPENDED</option>
                        <option value="blocked">BLOCKED</option>
                      </select>
                    </div>
                  </div>

                  {/* Users Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs border-collapse">
                      <thead>
                        <tr className="border-b-2 border-[#0b1c30] bg-slate-50 uppercase text-[#6e7a73]">
                          <th className="p-3">User</th>
                          <th className="p-3">Role</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Joined</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e5e7eb]">
                        {filteredUsers.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-[#6e7a73]">
                              No user records found matching criteria.
                            </td>
                          </tr>
                        ) : (
                          filteredUsers.map((u) => (
                            <tr key={u._id || u.id} className="hover:bg-slate-50 transition">
                              <td className="p-3">
                                <p className="font-bold text-[#0b1c30] font-sans text-sm">{u.name}</p>
                                <p className="text-[11px] text-[#6e7a73]">{u.email}</p>
                              </td>
                              <td className="p-3">
                                <span className="border border-[#0b1c30] px-1.5 py-0.5 text-[10px] font-bold uppercase bg-[#eff4ff] text-[#0047bf]">
                                  {u.role}
                                </span>
                              </td>
                              <td className="p-3">
                                <span
                                  className={`inline-block border px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                                    u.status === "active"
                                      ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                                      : "border-red-300 bg-red-50 text-red-800"
                                  }`}
                                >
                                  {u.status || "active"}
                                </span>
                              </td>
                              <td className="p-3 text-slate-500">
                                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                              </td>
                              <td className="p-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => setSelectedUser(u)}
                                  className="border border-[#0b1c30] bg-white px-2.5 py-1 font-bold uppercase text-[#0b1c30] hover:bg-[#eff4ff] shadow-[1px_1px_0px_#0b1c30]"
                                >
                                  MODERATE
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 3. MANAGE GIGS & GIG APPROVALS */}
              {(activeSection === "gigs" || activeSection === "gig-approvals") && (
                <div className="border border-[#e5e7eb] bg-white p-6 shadow-[3px_3px_0px_#0b1c30] space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs border-b border-[#e5e7eb] pb-4">
                    <div className="flex items-center gap-2 flex-1 max-w-sm">
                      <Search className="h-4 w-4 text-[#6e7a73]" />
                      <input
                        type="text"
                        placeholder="Search specifications by title..."
                        value={gigSearch}
                        onChange={(e) => setGigSearch(e.target.value)}
                        className="w-full border border-[#0b1c30] px-2.5 py-1.5 focus:outline-none"
                      />
                    </div>

                    {activeSection === "gigs" && (
                      <select
                        value={gigStatusFilter}
                        onChange={(e) => setGigStatusFilter(e.target.value)}
                        className="border border-[#0b1c30] bg-white px-2 py-1.5 font-bold uppercase font-mono text-xs"
                      >
                        <option value="all">ALL STATUSES</option>
                        <option value="pending">PENDING AUDIT</option>
                        <option value="published">PUBLISHED</option>
                        <option value="rejected">REJECTED</option>
                        <option value="suspended">SUSPENDED</option>
                      </select>
                    )}
                  </div>

                  {/* Gigs List */}
                  <div className="divide-y divide-[#e5e7eb] font-mono text-xs">
                    {(activeSection === "gig-approvals" ? pendingGigsList : filteredGigs).length === 0 ? (
                      <div className="py-8 text-center text-[#6e7a73]">
                        No specifications found in this category.
                      </div>
                    ) : (
                      (activeSection === "gig-approvals" ? pendingGigsList : filteredGigs).map((g) => (
                        <div key={g._id || g.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`border px-1.5 py-0.2 text-[9px] font-bold uppercase ${
                                  g.status === "published"
                                    ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                                    : g.status === "pending"
                                    ? "border-amber-300 bg-amber-50 text-amber-800"
                                    : "border-red-300 bg-red-50 text-red-800"
                                }`}
                              >
                                {g.status}
                              </span>
                              <span className="text-slate-400 text-[10px]">·</span>
                              <span className="text-[#6e7a73] uppercase text-[10px]">{g.category}</span>
                            </div>
                            <h3 className="font-sans font-bold text-sm text-[#0b1c30] truncate">
                              {g.title}
                            </h3>
                            <p className="text-[#6e7a73] text-[11px] mt-0.5">
                              Starting {formatPrice(g.price)} · SLA: {g.deliveryDays} Days
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => setSelectedGig(g)}
                              className="border border-[#0b1c30] bg-[#eff4ff] px-3 py-1.5 font-bold uppercase text-[#0047bf] hover:bg-[#dae2fd] shadow-[1px_1px_0px_#0b1c30]"
                            >
                              INSPECT & AUDIT
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* 4. MANAGE CATEGORIES */}
              {activeSection === "categories" && (
                <div className="border border-[#e5e7eb] bg-white p-6 shadow-[3px_3px_0px_#0b1c30] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
                    <h2 className="font-headline text-base font-bold uppercase text-[#0b1c30]">
                      PLATFORM TAXONOMY ({categories.length})
                    </h2>
                    <button
                      type="button"
                      onClick={() => setCategoryModal(true)}
                      className="border border-[#005d42] bg-[#005d42] px-3 py-1.5 font-mono text-xs font-bold uppercase text-white hover:bg-[#065f46]"
                    >
                      + ADD CATEGORY NODE
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
                    {categories.map((cat) => (
                      <div key={cat._id || cat.slug} className="border border-[#0b1c30] p-4 bg-white shadow-[2px_2px_0px_#0b1c30]">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-[#0b1c30] truncate">{cat.name}</span>
                          <span className="border border-[#e5e7eb] px-1.5 py-0.5 text-[9px] text-[#6e7a73]">
                            {cat.gigsCount || 0} GIGS
                          </span>
                        </div>
                        <p className="text-[11px] text-[#6e7a73] font-mono mt-1">Slug: {cat.slug}</p>
                        <p className="text-xs text-[#3e4943] font-sans mt-2 line-clamp-2">{cat.description}</p>
                        <div className="mt-4 pt-2 border-t border-[#e5e7eb] flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat._id)}
                            className="text-[#ba1a1a] hover:underline font-bold text-[10px] uppercase"
                          >
                            REMOVE NODE
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. MANAGE ORDERS */}
              {activeSection === "orders" && (
                <div className="border border-[#e5e7eb] bg-white p-6 shadow-[3px_3px_0px_#0b1c30] space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs border-b border-[#e5e7eb] pb-4">
                    <div className="flex items-center gap-2 flex-1 max-w-sm">
                      <Search className="h-4 w-4 text-[#6e7a73]" />
                      <input
                        type="text"
                        placeholder="Search contract by code (e.g. GC-123)..."
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        className="w-full border border-[#0b1c30] px-2.5 py-1.5 focus:outline-none"
                      />
                    </div>
                    <select
                      value={orderStatusFilter}
                      onChange={(e) => setOrderStatusFilter(e.target.value)}
                      className="border border-[#0b1c30] bg-white px-2 py-1.5 font-bold uppercase font-mono text-xs"
                    >
                      <option value="all">ALL CONTRACT STATUSES</option>
                      <option value="active">ACTIVE / IN FLIGHT</option>
                      <option value="delivered">DELIVERED</option>
                      <option value="completed">COMPLETED</option>
                      <option value="cancelled">CANCELLED</option>
                    </select>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs border-collapse">
                      <thead>
                        <tr className="border-b-2 border-[#0b1c30] bg-slate-50 uppercase text-[#6e7a73]">
                          <th className="p-3">Code</th>
                          <th className="p-3">Specification</th>
                          <th className="p-3">Amount</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Initiated</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e5e7eb]">
                        {filteredOrders.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-[#6e7a73]">
                              No contract orders found.
                            </td>
                          </tr>
                        ) : (
                          filteredOrders.map((ord) => (
                            <tr key={ord._id || ord.id} className="hover:bg-slate-50 transition">
                              <td className="p-3 font-bold text-[#0b1c30]">{ord.code}</td>
                              <td className="p-3 truncate max-w-xs">{ord.gigId?.title || ord.title || "Custom Contract"}</td>
                              <td className="p-3 font-bold">₹{(ord.price || 0).toLocaleString("en-IN")}</td>
                              <td className="p-3">
                                <span className="border border-[#005d42] bg-[#eff4ff] px-1.5 py-0.5 text-[10px] font-bold uppercase text-[#005d42]">
                                  {ord.status}
                                </span>
                              </td>
                              <td className="p-3 text-slate-500">
                                {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : "Recent"}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 6. MANAGE REVIEWS */}
              {activeSection === "reviews" && (
                <div className="border border-[#e5e7eb] bg-white p-6 shadow-[3px_3px_0px_#0b1c30] space-y-4">
                  <h2 className="font-headline text-base font-bold uppercase text-[#0b1c30] border-b border-[#e5e7eb] pb-3">
                    AUDITED CLIENT REVIEWS & FEEDBACK ({reviews.length})
                  </h2>

                  <div className="divide-y divide-[#e5e7eb] font-mono text-xs">
                    {reviews.length === 0 ? (
                      <div className="py-8 text-center text-[#6e7a73]">
                        No client reviews submitted yet.
                      </div>
                    ) : (
                      reviews.map((r) => (
                        <div key={r._id || r.id} className="py-4 flex flex-col sm:flex-row justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-amber-500 font-bold">{"★".repeat(r.rating || 5)}</span>
                              <span className="font-bold text-[#0b1c30]">{r.rating}.0</span>
                              {r.isHidden && (
                                <span className="border border-red-300 bg-red-50 px-1 text-[9px] font-bold text-red-700 uppercase">
                                  HIDDEN FROM PUBLIC
                                </span>
                              )}
                            </div>
                            <p className="font-sans text-xs text-[#0b1c30] mt-1 italic">&ldquo;{r.comment}&rdquo;</p>
                            <p className="text-[10px] text-[#6e7a73] mt-1">
                              By {r.clientId?.name || "Client"} for {r.freelancerId?.name || "Specialist"}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleToggleHideReview(r._id || r.id)}
                              className="border border-[#0b1c30] bg-white px-2.5 py-1 text-[11px] font-bold uppercase text-[#0b1c30] hover:bg-slate-100"
                            >
                              {r.isHidden ? "UNHIDE" : "HIDE"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteReview(r._id || r.id)}
                              className="border border-[#ba1a1a] bg-white px-2.5 py-1 text-[11px] font-bold uppercase text-[#ba1a1a] hover:bg-red-50"
                            >
                              DELETE
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* 7. MANAGE PAYMENTS */}
              {activeSection === "payments" && (
                <div className="border border-[#e5e7eb] bg-white p-6 shadow-[3px_3px_0px_#0b1c30] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
                    <h2 className="font-headline text-base font-bold uppercase text-[#0b1c30]">
                      SIMULATED ESCROW DISBURSEMENT LEDGER
                    </h2>
                    <span className="border border-[#005d42] bg-[#eff4ff] px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-[#005d42]">
                      100% AUDITED
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs border-collapse">
                      <thead>
                        <tr className="border-b-2 border-[#0b1c30] bg-slate-50 uppercase text-[#6e7a73]">
                          <th className="p-3">Tx ID</th>
                          <th className="p-3">Amount</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Mode</th>
                          <th className="p-3">Timestamp</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e5e7eb]">
                        {payments.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-[#6e7a73]">
                              No transactions recorded yet in escrow ledger.
                            </td>
                          </tr>
                        ) : (
                          payments.map((p) => (
                            <tr key={p._id || p.transactionId} className="hover:bg-slate-50 transition">
                              <td className="p-3 font-bold text-[#0b1c30]">{p.transactionId}</td>
                              <td className="p-3 font-bold text-[#005d42]">₹{(p.amount || 0).toLocaleString("en-IN")}</td>
                              <td className="p-3 uppercase">{p.status}</td>
                              <td className="p-3 text-[10px] text-amber-700 uppercase font-bold">SIMULATED</td>
                              <td className="p-3 text-slate-500">
                                {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "Recent"}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 8. REPORTS & COMPLAINTS */}
              {activeSection === "reports" && (
                <div className="border border-[#e5e7eb] bg-white p-6 shadow-[3px_3px_0px_#0b1c30] space-y-4">
                  <h2 className="font-headline text-base font-bold uppercase text-[#0b1c30] border-b border-[#e5e7eb] pb-3">
                    USER COMPLAINTS & SAFETY INCIDENTS ({reports.length})
                  </h2>

                  <div className="divide-y divide-[#e5e7eb] font-mono text-xs">
                    {reports.length === 0 ? (
                      <div className="py-8 text-center text-[#6e7a73]">
                        <CheckCircle2 className="mx-auto h-8 w-8 text-[#005d42] mb-2" />
                        NO OPEN INCIDENTS OR USER REPORTS.
                      </div>
                    ) : (
                      reports.map((rep) => (
                        <div key={rep._id} className="py-4 flex flex-col sm:flex-row justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="border border-[#ba1a1a] bg-red-50 text-red-800 px-1.5 py-0.2 text-[9px] font-bold uppercase">
                                {rep.targetType}: #{String(rep.targetId).slice(-6)}
                              </span>
                              <span className="font-bold text-[#0b1c30]">{rep.reason}</span>
                            </div>
                            <p className="font-sans text-xs text-[#3e4943] mt-1">{rep.details || "No additional notes provided"}</p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleResolveReport(rep._id, "resolved")}
                              className="border border-[#005d42] bg-[#005d42] px-3 py-1 font-bold uppercase text-white hover:bg-[#065f46]"
                            >
                              RESOLVE
                            </button>
                            <button
                              type="button"
                              onClick={() => handleResolveReport(rep._id, "dismissed")}
                              className="border border-slate-300 bg-white px-3 py-1 font-bold uppercase text-slate-700 hover:bg-slate-50"
                            >
                              DISMISS
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* 9. PLATFORM SETTINGS */}
              {activeSection === "settings" && (
                <div className="border border-[#e5e7eb] bg-white p-6 shadow-[3px_3px_0px_#0b1c30] space-y-6 font-mono text-xs">
                  <h2 className="font-headline text-base font-bold uppercase text-[#0b1c30] border-b border-[#e5e7eb] pb-3">
                    GOVERNANCE & PLATFORM SETTINGS
                  </h2>

                  <div className="space-y-4 max-w-lg">
                    <div>
                      <label className="block text-[#6e7a73] uppercase font-bold">PLATFORM FEE // ESCROW CUT (%)</label>
                      <input
                        type="number"
                        disabled
                        value="0"
                        className="mt-1 w-full border border-[#0b1c30] bg-slate-50 p-2 text-xs font-bold"
                      />
                      <p className="text-[10px] text-[#6e7a73] mt-1">Zero platform fee configured for college showcase simulation.</p>
                    </div>

                    <div>
                      <label className="block text-[#6e7a73] uppercase font-bold">DISPUTE RESOLUTION WINDOW</label>
                      <input
                        type="text"
                        disabled
                        value="7 Days Maximum"
                        className="mt-1 w-full border border-[#0b1c30] bg-slate-50 p-2 text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[#6e7a73] uppercase font-bold">PRIMARY ADMINISTRATOR IDENTIFIER</label>
                      <input
                        type="text"
                        disabled
                        value={user?.email || "admin@gigcraft.io"}
                        className="mt-1 w-full border border-[#0b1c30] bg-slate-50 p-2 text-xs font-bold"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* User Details & Moderation Modal */}
      <UserDetailsModal
        user={selectedUser}
        open={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
        onUpdateStatus={handleUpdateUserStatus}
        onDeleteUser={handleDeleteUser}
      />

      {/* Gig Specifications & Approval Modal */}
      <GigDetailsModal
        gig={selectedGig}
        open={Boolean(selectedGig)}
        onClose={() => setSelectedGig(null)}
        onApprove={handleApproveGig}
        onReject={handleRejectGig}
        onSuspend={handleSuspendGig}
      />

      {/* Category Creation Modal */}
      {categoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md border-2 border-[#0b1c30] bg-white p-6 shadow-[6px_6px_0px_#0b1c30]">
            <div className="flex items-center justify-between border-b border-[#0b1c30] pb-3">
              <h3 className="font-headline text-base font-bold uppercase text-[#0b1c30]">DEPLOY CATEGORY</h3>
              <button type="button" onClick={() => setCategoryModal(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleCreateCategory} className="mt-4 space-y-3 font-mono text-xs">
              <div>
                <label className="block text-[#6e7a73] uppercase">CATEGORY NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cloud Security"
                  value={newCatName}
                  onChange={(e) => {
                    setNewCatName(e.target.value);
                    setNewCatSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
                  }}
                  className="mt-1 w-full border border-[#0b1c30] p-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-[#6e7a73] uppercase">SLUG *</label>
                <input
                  type="text"
                  required
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value)}
                  className="mt-1 w-full border border-[#0b1c30] p-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-[#6e7a73] uppercase">DESCRIPTION</label>
                <textarea
                  rows={2}
                  placeholder="Domain summary..."
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="mt-1 w-full border border-[#0b1c30] p-2 text-xs"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCategoryModal(false)}
                  className="border border-slate-300 px-3 py-1.5 uppercase font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="bg-[#005d42] px-4 py-1.5 font-bold uppercase text-white hover:bg-[#065f46]"
                >
                  SAVE NODE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
