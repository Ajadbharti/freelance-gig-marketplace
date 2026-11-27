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
  MessageSquare,
  ShieldAlert,
  ShieldCheck,
  Star,
  Trash2,
  User,
  Wallet,
} from "lucide-react";
import { adminApi } from "@/lib/api/adminApi";
import { formatPrice } from "@/lib/utils";

export default function AdminClientInspectionView({
  client,
  onBack,
  onEditProfile,
  onUpdateStatus,
  onDeleteClient,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");

  useEffect(() => {
    async function loadClientData() {
      if (!client) return;
      setLoading(true);
      try {
        const res = await adminApi.getClientDashboard(client._id || client.id);
        setData(res);
      } catch (err) {
        console.warn("Could not fetch remote client telemetry:", err.message);
      } finally {
        setLoading(false);
      }
    }
    loadClientData();
  }, [client]);

  const dashboard = data?.dashboard || {
    stats: {
      totalOrders: 0,
      activeOrders: 0,
      deliveredOrders: 0,
      completedOrders: 0,
      cancelledOrders: 0,
      totalSpent: 0,
      inEscrow: 0,
    },
    orders: [],
    reviews: [],
  };

  const clientInfo = data?.client || client;

  return (
    <div className="space-y-6">
      {/* Top Super Admin Inspection Mode Banner */}
      <div className="border-2 border-[#005d42] bg-[#eff4ff] p-4 shadow-[4px_4px_0px_#0b1c30]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#005d42]">
              <ShieldCheck className="h-4 w-4" />
              <span>SUPER ADMIN INSPECTION MODE // MANAGE AS CLIENT</span>
            </div>
            <h1 className="mt-1 font-headline text-2xl font-bold uppercase text-[#0b1c30]">
              {clientInfo?.name}
            </h1>
            <p className="font-mono text-xs text-[#3e4943]">
              {clientInfo?.email} · Account ID: #{String(clientInfo?._id || clientInfo?.id || "").slice(-6)} · Status:{" "}
              <strong className="uppercase text-[#0b1c30]">{clientInfo?.status || "active"}</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <button
              type="button"
              onClick={() => onEditProfile(clientInfo)}
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
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 font-mono">
        <div className="border border-[#e5e7eb] bg-white p-4 shadow-[2px_2px_0px_#0b1c30]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#6e7a73]">Total Orders Placed</p>
          <p className="mt-1 font-headline text-3xl font-bold text-[#0b1c30]">
            {dashboard.stats.totalOrders}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">{dashboard.stats.activeOrders} active in flight</p>
        </div>

        <div className="border border-[#e5e7eb] bg-white p-4 shadow-[2px_2px_0px_#0b1c30]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#6e7a73]">Completed Sprints</p>
          <p className="mt-1 font-headline text-3xl font-bold text-[#005d42]">
            {dashboard.stats.completedOrders}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">{dashboard.stats.deliveredOrders} awaiting review</p>
        </div>

        <div className="border border-[#e5e7eb] bg-white p-4 shadow-[2px_2px_0px_#0b1c30]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#6e7a73]">Total Escrow Disbursed</p>
          <p className="mt-1 font-headline text-3xl font-bold text-[#0b1c30]">
            ₹{dashboard.stats.totalSpent.toLocaleString("en-IN")}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Deterministic settlement</p>
        </div>

        <div className="border border-[#e5e7eb] bg-white p-4 shadow-[2px_2px_0px_#0b1c30]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#6e7a73]">Locked in Escrow</p>
          <p className="mt-1 font-headline text-3xl font-bold text-[#0047bf]">
            ₹{dashboard.stats.inEscrow.toLocaleString("en-IN")}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Milestone protected funds</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b-2 border-[#0b1c30] bg-white px-4 font-mono text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-3 font-bold uppercase transition ${
            activeTab === "orders"
              ? "border-b-4 border-[#005d42] text-[#005d42]"
              : "text-[#6e7a73] hover:text-[#0b1c30]"
          }`}
        >
          Orders Placed ({dashboard.orders.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("reviews")}
          className={`px-4 py-3 font-bold uppercase transition ${
            activeTab === "reviews"
              ? "border-b-4 border-[#005d42] text-[#005d42]"
              : "text-[#6e7a73] hover:text-[#0b1c30]"
          }`}
        >
          Reviews Submitted ({dashboard.reviews.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("governance")}
          className={`px-4 py-3 font-bold uppercase transition ${
            activeTab === "governance"
              ? "border-b-4 border-[#005d42] text-[#005d42]"
              : "text-[#6e7a73] hover:text-[#0b1c30]"
          }`}
        >
          Account Governance & Controls
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === "orders" && (
        <div className="border border-[#e5e7eb] bg-white p-6 shadow-[3px_3px_0px_#0b1c30]">
          <h2 className="font-headline text-base font-bold uppercase text-[#0b1c30] mb-4">
            Client Contract & Order History
          </h2>

          {dashboard.orders.length === 0 ? (
            <div className="py-8 text-center font-mono text-xs text-[#6e7a73]">
              No orders placed by this client account yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#0b1c30] bg-slate-50 uppercase text-[#6e7a73]">
                    <th className="p-3">Order Code</th>
                    <th className="p-3">Specification</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Placed Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e7eb]">
                  {dashboard.orders.map((ord, idx) => (
                    <tr key={ord._id || ord.id || `client-ord-${idx}`} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-[#0b1c30]">{ord.code || `#${ord.id?.slice(-6)}`}</td>
                      <td className="p-3 font-sans text-xs font-semibold text-[#0b1c30]">
                        {ord.title || ord.gigTitle || "Service Contract"}
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

      {/* Tab 2: Reviews */}
      {activeTab === "reviews" && (
        <div className="border border-[#e5e7eb] bg-white p-6 shadow-[3px_3px_0px_#0b1c30]">
          <h2 className="font-headline text-base font-bold uppercase text-[#0b1c30] mb-4">
            Audited Reviews Given by Client
          </h2>

          {dashboard.reviews.length === 0 ? (
            <div className="py-8 text-center font-mono text-xs text-[#6e7a73]">
              No reviews submitted by this client yet.
            </div>
          ) : (
            <div className="divide-y divide-[#e5e7eb] font-mono text-xs">
              {dashboard.reviews.map((r, idx) => (
                <div key={r._id || r.id || `rev-${idx}`} className="py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-500 font-bold">{"★".repeat(r.rating || 5)}</span>
                    <span className="font-bold text-[#0b1c30]">{r.rating}.0 Rating</span>
                  </div>
                  <p className="font-sans text-xs text-[#0b1c30] mt-1.5 italic">&ldquo;{r.comment}&rdquo;</p>
                  <p className="text-[10px] text-[#6e7a73] mt-1">
                    Submitted on: {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "Recent"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Governance */}
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
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold uppercase text-[#0b1c30]">Current Account Status</span>
                <p className="font-headline text-xl font-bold uppercase text-[#005d42] mt-0.5">
                  {clientInfo?.status || "active"}
                </p>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                {clientInfo?.status === "active" ? (
                  <button
                    type="button"
                    onClick={() => onUpdateStatus(clientInfo._id || clientInfo.id, "suspended", "Administrative suspension by Super Admin")}
                    className="border border-amber-600 bg-amber-500 text-white px-3 py-1.5 font-bold uppercase hover:bg-amber-600"
                  >
                    Suspend Account
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onUpdateStatus(clientInfo._id || clientInfo.id, "active", "Account reactivated by Super Admin")}
                    className="border border-[#005d42] bg-[#005d42] text-white px-3 py-1.5 font-bold uppercase hover:bg-[#047857]"
                  >
                    Reactivate Account
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onUpdateStatus(clientInfo._id || clientInfo.id, "blocked", "Account blocked for security violation")}
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
              Permanently purges client record and associated metadata from the active database.
            </p>
            <button
              type="button"
              onClick={() => onDeleteClient(clientInfo._id || clientInfo.id, "Terminated by Super Admin")}
              className="border border-[#ba1a1a] bg-white px-4 py-2 font-mono text-xs font-bold uppercase text-[#ba1a1a] hover:bg-red-50 shadow-[2px_2px_0px_#ba1a1a] transition"
            >
              <Trash2 className="h-3.5 w-3.5 inline mr-1" />
              Purge Client Account Permanently
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
