"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  CreditCard,
  Edit,
  Eye,
  FileText,
  Package,
  ShieldAlert,
  ShieldCheck,
  Star,
  Trash2,
  User,
  Wallet,
  XCircle,
} from "lucide-react";
import { adminApi } from "@/lib/api/adminApi";
import { formatPrice } from "@/lib/utils";

export default function AdminFreelancerInspectionView({
  freelancer,
  onBack,
  onEditProfile,
  onApproveGig,
  onRejectGig,
  onSuspendGig,
  onUpdateStatus,
  onDeleteFreelancer,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("gigs");

  useEffect(() => {
    async function loadFreelancerData() {
      if (!freelancer) return;
      setLoading(true);
      try {
        const res = await adminApi.getFreelancerDashboard(freelancer._id || freelancer.id);
        setData(res);
      } catch (err) {
        console.warn("Could not fetch remote freelancer telemetry:", err.message);
      } finally {
        setLoading(false);
      }
    }
    loadFreelancerData();
  }, [freelancer]);

  const dashboard = data?.dashboard || {
    stats: {
      totalGigs: 0,
      publishedGigs: 0,
      pendingGigs: 0,
      totalOrders: 0,
      activeOrders: 0,
      completedOrders: 0,
      totalEarned: 0,
      avgRating: 5.0,
      reviewsCount: 0,
    },
    gigs: [],
    orders: [],
    reviews: [],
  };

  const freelancerInfo = data?.freelancer || freelancer;

  return (
    <div className="space-y-6">
      {/* Top Super Admin Inspection Mode Banner */}
      <div className="border-2 border-[#005d42] bg-[#eff4ff] p-4 shadow-[4px_4px_0px_#0b1c30]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#005d42]">
              <ShieldCheck className="h-4 w-4" />
              <span>SUPER ADMIN INSPECTION MODE // MANAGE AS FREELANCER</span>
            </div>
            <h1 className="mt-1 font-headline text-2xl font-bold uppercase text-[#0b1c30]">
              {freelancerInfo?.name}
            </h1>
            <p className="font-mono text-xs text-[#3e4943]">
              {freelancerInfo?.email} · {freelancerInfo?.title || "Specialist"} · Status:{" "}
              <strong className="uppercase text-[#0b1c30]">{freelancerInfo?.status || "active"}</strong> · Verified:{" "}
              <strong>{freelancerInfo?.isVerified ? "YES (VERIFIED)" : "NO"}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <button
              type="button"
              onClick={() => onEditProfile(freelancerInfo)}
              className="inline-flex items-center gap-1.5 border border-[#0b1c30] bg-white px-3.5 py-2 font-bold uppercase text-[#0b1c30] hover:bg-slate-100 shadow-[2px_2px_0px_#0b1c30] transition"
            >
              <Edit className="h-3.5 w-3.5 text-[#005d42]" />
              <span>Edit Profile</span>
            </button>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 border border-[#0b1c30] bg-[#0b1c30] px-4 py-2 font-bold uppercase text-white hover:bg-slate-800 shadow-[2px_2px_0px_#005d42] transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Return to Admin Console</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 font-mono">
        <div className="border border-[#e5e7eb] bg-white p-4 shadow-[2px_2px_0px_#0b1c30]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#6e7a73]">Total Specifications</p>
          <p className="mt-1 font-headline text-3xl font-bold text-[#0b1c30]">
            {dashboard.stats.totalGigs}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">{dashboard.stats.publishedGigs} active in catalog</p>
        </div>

        <div className="border border-[#e5e7eb] bg-white p-4 shadow-[2px_2px_0px_#0b1c30]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#6e7a73]">Pending Approvals</p>
          <p className="mt-1 font-headline text-3xl font-bold text-[#0047bf]">
            {dashboard.stats.pendingGigs}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Awaiting audit review</p>
        </div>

        <div className="border border-[#e5e7eb] bg-white p-4 shadow-[2px_2px_0px_#0b1c30]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#6e7a73]">Completed Orders</p>
          <p className="mt-1 font-headline text-3xl font-bold text-[#005d42]">
            {dashboard.stats.completedOrders}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">{dashboard.stats.activeOrders} active contracts</p>
        </div>

        <div className="border border-[#e5e7eb] bg-white p-4 shadow-[2px_2px_0px_#0b1c30]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#6e7a73]">Total Earnings</p>
          <p className="mt-1 font-headline text-3xl font-bold text-[#005d42]">
            ₹{dashboard.stats.totalEarned.toLocaleString("en-IN")}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Simulated escrow disbursed</p>
        </div>

        <div className="border border-[#e5e7eb] bg-white p-4 shadow-[2px_2px_0px_#0b1c30]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#6e7a73]">Customer Rating</p>
          <p className="mt-1 font-headline text-3xl font-bold text-amber-500 flex items-center gap-1">
            {dashboard.stats.avgRating} <span className="text-xl">★</span>
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">{dashboard.stats.reviewsCount} verified reviews</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b-2 border-[#0b1c30] bg-white px-4 font-mono text-xs overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("gigs")}
          className={`px-4 py-3 font-bold uppercase transition whitespace-nowrap ${
            activeTab === "gigs"
              ? "border-b-4 border-[#005d42] text-[#005d42]"
              : "text-[#6e7a73] hover:text-[#0b1c30]"
          }`}
        >
          Specifications & Gigs ({dashboard.gigs.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-3 font-bold uppercase transition whitespace-nowrap ${
            activeTab === "orders"
              ? "border-b-4 border-[#005d42] text-[#005d42]"
              : "text-[#6e7a73] hover:text-[#0b1c30]"
          }`}
        >
          Orders Received ({dashboard.orders.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("reviews")}
          className={`px-4 py-3 font-bold uppercase transition whitespace-nowrap ${
            activeTab === "reviews"
              ? "border-b-4 border-[#005d42] text-[#005d42]"
              : "text-[#6e7a73] hover:text-[#0b1c30]"
          }`}
        >
          Reviews & Feedback ({dashboard.reviews.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("portfolio")}
          className={`px-4 py-3 font-bold uppercase transition whitespace-nowrap ${
            activeTab === "portfolio"
              ? "border-b-4 border-[#005d42] text-[#005d42]"
              : "text-[#6e7a73] hover:text-[#0b1c30]"
          }`}
        >
          Skills & Credentials
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("governance")}
          className={`px-4 py-3 font-bold uppercase transition whitespace-nowrap ${
            activeTab === "governance"
              ? "border-b-4 border-[#005d42] text-[#005d42]"
              : "text-[#6e7a73] hover:text-[#0b1c30]"
          }`}
        >
          Account Governance
        </button>
      </div>

      {/* Tab 1: Gigs with Admin Approval / Reject / Suspend buttons */}
      {activeTab === "gigs" && (
        <div className="border border-[#e5e7eb] bg-white p-6 shadow-[3px_3px_0px_#0b1c30] space-y-4">
          <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
            <h2 className="font-headline text-base font-bold uppercase text-[#0b1c30]">
              Freelancer Gigs & Specifications
            </h2>
            <span className="font-mono text-xs text-[#6e7a73]">
              Super Admin can Approve, Reject, or Suspend specifications directly.
            </span>
          </div>

          {dashboard.gigs.length === 0 ? (
            <div className="py-8 text-center font-mono text-xs text-[#6e7a73]">
              No service specifications published by this freelancer yet.
            </div>
          ) : (
            <div className="divide-y divide-[#e5e7eb] font-mono text-xs">
              {dashboard.gigs.map((g, idx) => (
                <div key={g._id || g.id || `gig-${idx}`} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`border px-1.5 py-0.2 text-[9px] font-bold uppercase ${
                          g.status === "published" || !g.status
                            ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                            : g.status === "pending"
                            ? "border-amber-300 bg-amber-50 text-amber-800"
                            : "border-red-300 bg-red-50 text-red-800"
                        }`}
                      >
                        {g.status || "published"}
                      </span>
                      <span className="text-[#6e7a73] uppercase text-[10px]">{g.category}</span>
                    </div>
                    <h3 className="font-sans font-bold text-sm text-[#0b1c30] truncate">{g.title}</h3>
                    <p className="text-[#6e7a73] text-[11px] mt-0.5">
                      Starting {formatPrice(g.price)} · SLA: {g.deliveryDays || 1} Days
                    </p>
                    {g.rejectionReason && (
                      <p className="text-[#ba1a1a] text-[10px] mt-1 font-bold">
                        Rejection reason: {g.rejectionReason}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {g.status === "pending" && (
                      <>
                        <button
                          type="button"
                          onClick={() => onApproveGig(g._id || g.id)}
                          className="border border-[#005d42] bg-[#005d42] text-white px-3 py-1 font-bold uppercase hover:bg-[#047857]"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const reason = prompt("Enter specific rejection reason for ledger:");
                            if (reason) onRejectGig(g._id || g.id, reason);
                          }}
                          className="border border-[#ba1a1a] bg-red-50 text-[#ba1a1a] px-3 py-1 font-bold uppercase hover:bg-red-100"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {g.status === "published" && (
                      <button
                        type="button"
                        onClick={() => {
                          const reason = prompt("Enter suspension reason:");
                          if (reason) onSuspendGig(g._id || g.id, reason);
                        }}
                        className="border border-slate-300 bg-slate-100 text-slate-700 px-3 py-1 font-bold uppercase hover:bg-slate-200"
                      >
                        Suspend
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Orders Received */}
      {activeTab === "orders" && (
        <div className="border border-[#e5e7eb] bg-white p-6 shadow-[3px_3px_0px_#0b1c30]">
          <h2 className="font-headline text-base font-bold uppercase text-[#0b1c30] mb-4">
            Orders Received & Active Contracts
          </h2>

          {dashboard.orders.length === 0 ? (
            <div className="py-8 text-center font-mono text-xs text-[#6e7a73]">
              No client orders received by this freelancer yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#0b1c30] bg-slate-50 uppercase text-[#6e7a73]">
                    <th className="p-3">Contract Code</th>
                    <th className="p-3">Specification</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Received</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e7eb]">
                  {dashboard.orders.map((ord, idx) => (
                    <tr key={ord._id || ord.id || `fl-ord-${idx}`} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-[#0b1c30]">{ord.code || `#${ord.id?.slice(-6)}`}</td>
                      <td className="p-3 font-sans text-xs font-semibold text-[#0b1c30]">
                        {ord.title || ord.gigTitle || "Service Sprint"}
                      </td>
                      <td className="p-3 font-bold text-[#005d42]">₹{(ord.price || 0).toLocaleString("en-IN")}</td>
                      <td className="p-3">
                        <span className="border border-[#005d42] bg-[#eff4ff] px-2 py-0.5 text-[10px] font-bold uppercase text-[#005d42]">
                          {ord.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">
                        {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : "Recent"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Reviews */}
      {activeTab === "reviews" && (
        <div className="border border-[#e5e7eb] bg-white p-6 shadow-[3px_3px_0px_#0b1c30]">
          <h2 className="font-headline text-base font-bold uppercase text-[#0b1c30] mb-4">
            Audited Customer Ratings & Reviews
          </h2>

          {dashboard.reviews.length === 0 ? (
            <div className="py-8 text-center font-mono text-xs text-[#6e7a73]">
              No reviews received for this specialist yet.
            </div>
          ) : (
            <div className="divide-y divide-[#e5e7eb] font-mono text-xs">
              {dashboard.reviews.map((r, idx) => (
                <div key={r._id || r.id || `rev-${idx}`} className="py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-500 font-bold">{"★".repeat(r.rating || 5)}</span>
                    <span className="font-bold text-[#0b1c30]">{r.rating}.0</span>
                  </div>
                  <p className="font-sans text-xs text-[#0b1c30] mt-1.5 italic">&ldquo;{r.comment}&rdquo;</p>
                  <p className="text-[10px] text-[#6e7a73] mt-1">
                    Client feedback from contract #{String(r.orderId || "").slice(-6)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Portfolio & Credentials */}
      {activeTab === "portfolio" && (
        <div className="border border-[#e5e7eb] bg-white p-6 shadow-[3px_3px_0px_#0b1c30] space-y-4">
          <h2 className="font-headline text-base font-bold uppercase text-[#0b1c30] border-b border-[#e5e7eb] pb-3">
            Specialist Portfolio & Credentials
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div className="border border-slate-200 p-4">
              <span className="font-bold uppercase text-[#6e7a73] text-[10px]">Professional Title</span>
              <p className="font-bold text-[#0b1c30] text-sm mt-1">{freelancerInfo?.title || "Specialist"}</p>
            </div>
            <div className="border border-slate-200 p-4">
              <span className="font-bold uppercase text-[#6e7a73] text-[10px]">Hourly Rate</span>
              <p className="font-bold text-[#005d42] text-sm mt-1">₹{freelancerInfo?.hourlyRate || 0}/hour</p>
            </div>
          </div>

          <div className="border border-slate-200 p-4 font-mono text-xs">
            <span className="font-bold uppercase text-[#6e7a73] text-[10px]">Professional Biography</span>
            <p className="font-sans text-xs text-[#0b1c30] mt-1 leading-relaxed">
              {freelancerInfo?.bio || "No biography entered yet."}
            </p>
          </div>

          <div className="border border-slate-200 p-4 font-mono text-xs">
            <span className="font-bold uppercase text-[#6e7a73] text-[10px]">Registered Technical Skills</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {Array.isArray(freelancerInfo?.skills) && freelancerInfo.skills.length > 0 ? (
                freelancerInfo.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="border border-[#0b1c30] bg-[#eff4ff] px-2 py-0.5 text-[10px] font-bold text-[#0047bf] uppercase"
                  >
                    {s}
                  </span>
                ))
              ) : (
                <span className="text-[#6e7a73]">No skills recorded</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Governance */}
      {activeTab === "governance" && (
        <div className="border border-[#e5e7eb] bg-white p-6 shadow-[3px_3px_0px_#0b1c30] space-y-6">
          <div>
            <h2 className="font-headline text-base font-bold uppercase text-[#0b1c30]">
              Account Status & Security Controls
            </h2>
            <p className="font-mono text-xs text-[#6e7a73] mt-1">
              Super Admin administrative actions. Every status transition creates an immutable entry in the governance ledger.
            </p>
          </div>

          <div className="border border-[#0b1c30] p-4 bg-[#eff4ff]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-xs font-bold uppercase text-[#0b1c30]">Account Status</span>
                <p className="font-headline text-xl font-bold uppercase text-[#005d42] mt-0.5">
                  {freelancerInfo?.status || "active"}
                </p>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                {freelancerInfo?.status === "active" ? (
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateStatus(
                        freelancerInfo._id || freelancerInfo.id,
                        "suspended",
                        "Administrative suspension by Super Admin"
                      )
                    }
                    className="border border-amber-600 bg-amber-500 text-white px-3 py-1.5 font-bold uppercase hover:bg-amber-600"
                  >
                    Suspend Account
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateStatus(
                        freelancerInfo._id || freelancerInfo.id,
                        "active",
                        "Account reactivated by Super Admin"
                      )
                    }
                    className="border border-[#005d42] bg-[#005d42] text-white px-3 py-1.5 font-bold uppercase hover:bg-[#047857]"
                  >
                    Reactivate Account
                  </button>
                )}

                <button
                  type="button"
                  onClick={() =>
                    onUpdateStatus(
                      freelancerInfo._id || freelancerInfo.id,
                      "blocked",
                      "Account blocked for security violation"
                    )
                  }
                  className="border border-[#ba1a1a] bg-[#ba1a1a] text-white px-3 py-1.5 font-bold uppercase hover:bg-red-700"
                >
                  Block Account
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-[#e5e7eb] pt-4">
            <h3 className="font-mono text-xs font-bold uppercase text-[#ba1a1a] mb-2">
              Danger Zone: Account Termination
            </h3>
            <p className="font-mono text-xs text-[#6e7a73] mb-3">
              Permanently purges freelancer record and associated services from the active database.
            </p>
            <button
              type="button"
              onClick={() => onDeleteFreelancer(freelancerInfo._id || freelancerInfo.id, "Terminated by Super Admin")}
              className="border border-[#ba1a1a] bg-white px-4 py-2 font-mono text-xs font-bold uppercase text-[#ba1a1a] hover:bg-red-50 shadow-[2px_2px_0px_#ba1a1a] transition"
            >
              <Trash2 className="h-3.5 w-3.5 inline mr-1" />
              Purge Freelancer Account Permanently
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
