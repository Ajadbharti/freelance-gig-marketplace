"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Archive,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Lock,
  MessageSquare,
  RefreshCw,
  Search,
  Send,
  Shield,
  ShieldCheck,
  User,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useToast } from "@/components/ui/ToastProvider";
import SafeImage from "@/components/ui/SafeImage";

export default function OrderDetails({ initialOrderId }) {
  const { user } = useAuth();
  const {
    orders,
    getOrder,
    completeOrder,
    requestRevision,
    deliverOrder,
    sendOrderMessage,
  } = useMarketplace();
  const { showToast } = useToast();

  const [selectedId, setSelectedId] = useState(
    initialOrderId || orders[0]?.id || "GC-0821"
  );
  const [filterTab, setFilterTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [revisionOpen, setRevisionOpen] = useState(false);
  const [revisionNote, setRevisionNote] = useState("");

  const activeOrder = getOrder(selectedId) || orders[0];

  // Filtering orders for Contract Ledger
  const ledgerOrders = orders.filter((o) => {
    if (filterTab === "in-progress" && o.status !== "active") return false;
    if (filterTab === "under-review" && o.status !== "delivered") return false;
    if (filterTab === "completed" && o.status !== "completed") return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        o.title.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q) ||
        o.freelancerName?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  async function handleApproveMilestone() {
    setIsApproving(true);
    const result = await completeOrder(activeOrder.id);
    setIsApproving(false);
    if (result.ok) {
      showToast(`Milestone approved! Funds disbursed from escrow vault.`, "success");
    } else {
      showToast(result.error || "Approval failed.", "error");
    }
  }

  async function handleRevisionSubmit() {
    if (!revisionNote.trim()) {
      showToast("Please enter feedback for the revision.", "error");
      return;
    }
    const result = await requestRevision(activeOrder.id, revisionNote);
    if (result.ok) {
      showToast("Revision requested. Seller notified.");
      setRevisionNote("");
      setRevisionOpen(false);
    }
  }

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!chatInput.trim()) return;
    await sendOrderMessage(activeOrder.id, chatInput.trim());
    setChatInput("");
    showToast("Message sent to contract thread.");
  }

  return (
    <div className="min-h-screen bg-[#FBFBFB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Protocol Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 font-mono text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="flex h-3.5 w-3.5 items-center justify-center bg-[#0a5c36] text-[9px] text-white">■</span>
            <span className="font-bold text-slate-900 uppercase">
              SYSTEM // CONTRACT OPS # ESCROW GUARANTEED
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span>SOCKET AUDIT: ENCRYPTED</span>
            <span className="text-slate-300">|</span>
            <span className="text-[#0a5c36] font-bold">100% ESCROW PROTECTED</span>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="mt-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              ORDER MANAGEMENT & ACTIVE DELIVERIES
            </h1>
            <p className="mt-1 font-mono text-xs text-slate-600">
              Real-time cryptographic milestone reconciliation, audit trails, and multi-signature escrow disbursement.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="flex items-center border border-slate-300 bg-white px-3 py-1.5 shadow-sm">
              <Search className="h-3.5 w-3.5 text-slate-400 mr-2" />
              <input
                type="text"
                placeholder="Filter order, hash or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => showToast("Exporting cryptographic CSV audit ledger...", "info")}
              className="border border-slate-300 bg-white px-3.5 py-1.5 font-bold uppercase tracking-wider text-slate-800 shadow-sm hover:bg-slate-50"
            >
              EXPORT REPORT
            </button>
          </div>
        </div>

        {/* 4 Telemetry Stats Banners matching Image 5 */}
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4 font-mono">
          <div className="border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] uppercase">ACTIVE PIPELINE</span>
              <span className="text-xs">📊</span>
            </div>
            <p className="mt-1 font-serif text-3xl font-bold text-slate-950">4</p>
            <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px]">
              <span className="text-slate-400">SLA: PASS</span>
              <span className="text-[#0a5c36] font-bold">100% HEALTHY</span>
            </div>
          </div>

          <div className="border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] uppercase">AWAITING REVIEW</span>
              <span className="text-xs">⏱</span>
            </div>
            <p className="mt-1 font-serif text-3xl font-bold text-slate-950">2</p>
            <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px]">
              <span className="text-slate-400">PENDING SIGN-OFF</span>
              <span className="text-amber-700 font-bold">ACTION REQ.</span>
            </div>
          </div>

          <div className="border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] uppercase">ESCROW VAULT SECURED</span>
              <span className="text-xs">🛡</span>
            </div>
            <p className="mt-1 font-serif text-3xl font-bold text-[#0a5c36]">₹1,84,000</p>
            <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px]">
              <span className="text-slate-400">DISPUTE PROTECTION</span>
              <span className="text-slate-800 font-bold">MULTI-SIG LOCK</span>
            </div>
          </div>

          <div className="border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] uppercase">ON-TIME COMPLETION</span>
              <span className="text-xs">🎯</span>
            </div>
            <p className="mt-1 font-serif text-3xl font-bold text-slate-950">100%</p>
            <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px]">
              <span className="text-slate-400">BENCHMARK</span>
              <span className="text-[#0a5c36] font-bold">TOP 1% FREELANCER</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs matching Image 5 */}
        <div className="mt-8 flex border border-slate-200 bg-white font-mono text-xs font-bold overflow-x-auto shadow-sm">
          <button
            type="button"
            onClick={() => setFilterTab("all")}
            className={`px-4 py-2.5 whitespace-nowrap uppercase tracking-wider transition ${
              filterTab === "all" ? "bg-[#0a5c36] text-white" : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            ALL ORDERS (14)
          </button>
          <button
            type="button"
            onClick={() => setFilterTab("in-progress")}
            className={`px-4 py-2.5 whitespace-nowrap uppercase tracking-wider border-l border-slate-200 transition ${
              filterTab === "in-progress" ? "bg-[#0a5c36] text-white" : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            IN PROGRESS (4)
          </button>
          <button
            type="button"
            onClick={() => setFilterTab("under-review")}
            className={`px-4 py-2.5 whitespace-nowrap uppercase tracking-wider border-l border-slate-200 transition ${
              filterTab === "under-review" ? "bg-[#0a5c36] text-white" : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            UNDER REVIEW (2)
          </button>
          <button
            type="button"
            onClick={() => setFilterTab("completed")}
            className={`px-4 py-2.5 whitespace-nowrap uppercase tracking-wider border-l border-slate-200 transition ${
              filterTab === "completed" ? "bg-[#0a5c36] text-white" : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            COMPLETED (7)
          </button>
        </div>

        {/* 2-Column Split: Contract Ledger (Left) + Detail Panel (Right) */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[340px_1fr]">
          {/* Left Column: Contract Ledger */}
          <div className="space-y-4">
            <div className="flex items-center justify-between font-mono text-xs text-slate-500">
              <span className="font-bold text-slate-900 uppercase">CONTRACT LEDGER</span>
              <span>Sorted by: Urgency</span>
            </div>

            <div className="space-y-3">
              {ledgerOrders.map((ord) => {
                const isSelected = ord.id === activeOrder?.id;
                const statusBadge =
                  ord.status === "active"
                    ? "bg-[#eaf6ee] text-[#0a5c36] border-[#0a5c36]"
                    : ord.status === "delivered"
                    ? "bg-amber-50 text-amber-800 border-amber-300"
                    : "bg-slate-100 text-slate-700 border-slate-300";

                return (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedId(ord.id)}
                    className={`cursor-pointer border p-4 transition shadow-sm ${
                      isSelected
                        ? "border-[#0a5c36] bg-[#f7fcf9] ring-1 ring-[#0a5c36]"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{ord.code || `#${ord.id}`}</span>
                        <span className={`border px-1.5 py-0.5 text-[9px] font-bold uppercase ${statusBadge}`}>
                          {ord.statusLabel || ord.status.toUpperCase()}
                        </span>
                      </div>
                      <span className="font-bold text-slate-950">₹{ord.price?.toLocaleString("en-IN")}</span>
                    </div>

                    <h4 className="mt-2 font-serif text-sm font-bold text-slate-950 leading-snug">
                      {ord.title}
                    </h4>

                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 font-mono text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5 truncate">
                        <SafeImage
                          src={ord.freelancerAvatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80"}
                          alt=""
                          className="h-4 w-4 rounded-full object-cover"
                        />
                        <span className="truncate text-slate-700">{ord.freelancerName}</span>
                      </div>
                      <span className="shrink-0 text-slate-400">
                        {ord.dueText || "Due in 2 days"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Order Detail Panel */}
          {activeOrder ? (
            <div className="border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-8">
              {/* Detail Header matching Image 5 */}
              <div className="border-b border-slate-100 pb-5">
                <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{activeOrder.code || `#${activeOrder.id}`}</span>
                    <span className="bg-[#0a5c36] px-2 py-0.5 font-bold text-white uppercase text-[10px]">
                      {activeOrder.milestoneFlight || "MILESTONE 3 OF 5 IN FLIGHT"}
                    </span>
                  </div>
                  <span className="text-slate-500">
                    INITIATED: 2026-10-18 // 14:32:09 UTC
                  </span>
                </div>

                <h2 className="mt-3 font-serif text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl uppercase">
                  {activeOrder.title}
                </h2>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed max-w-3xl">
                  {activeOrder.description}
                </p>

                {/* Parties Row */}
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3 border border-slate-100 bg-[#FAFBFB] p-4 font-mono text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase">CONTRACTOR (SELLER)</span>
                    <p className="font-bold text-slate-900">{activeOrder.freelancerName}</p>
                    <p className="text-[10px] text-emerald-700">{activeOrder.freelancerBadge || "Top Rated Plus (100%)"}</p>
                  </div>
                  <div className="sm:border-l sm:border-slate-200 sm:pl-4">
                    <span className="text-slate-400 text-[10px] uppercase">CLIENT (BUYER)</span>
                    <p className="font-bold text-slate-900">{activeOrder.clientName}</p>
                    <p className="text-[10px] text-slate-500">{activeOrder.clientBadge || "Verified Payment Method"}</p>
                  </div>
                  <div className="sm:border-l sm:border-slate-200 sm:pl-4">
                    <span className="text-slate-400 text-[10px] uppercase">VAULT COMMITMENT</span>
                    <p className="font-bold text-slate-950">{activeOrder.vaultCommitment || `$${activeOrder.price}.00 USD`}</p>
                    <p className="text-[10px] text-[#0a5c36] font-bold">100% ESCROW SECURED</p>
                  </div>
                </div>
              </div>

              {/* Execution Milestones & Audit Trail matching Image 5 */}
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 font-mono text-xs">
                  <span className="font-bold uppercase tracking-wider text-slate-900">
                    EXECUTION MILESTONES & AUDIT TRAIL
                  </span>
                  <span className="font-bold text-[#0a5c36]">
                    {activeOrder.progress || 60}% PROGRESS
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-1.5 w-full bg-slate-100">
                  <div
                    className="h-full bg-[#0a5c36]"
                    style={{ width: `${activeOrder.progress || 60}%` }}
                  />
                </div>

                {/* Milestone steps list */}
                <div className="mt-5 space-y-3 font-mono text-xs">
                  {(activeOrder.milestones || []).map((m, idx) => (
                    <div
                      key={idx}
                      className={`border p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
                        m.current
                          ? "border-[#0a5c36] bg-[#f7fcf9]"
                          : m.completed
                          ? "border-slate-200 bg-white"
                          : "border-slate-100 bg-[#FAFBFB] text-slate-400"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center text-[10px] ${
                            m.completed
                              ? "bg-[#0a5c36] text-white"
                              : m.current
                              ? "border-2 border-[#0a5c36] text-[#0a5c36]"
                              : "border border-slate-300 text-slate-400"
                          }`}
                        >
                          {m.completed ? "✓" : m.current ? "■" : ""}
                        </div>
                        <div>
                          <p className={`font-bold uppercase ${m.completed || m.current ? "text-slate-900" : "text-slate-500"}`}>
                            {m.title}
                          </p>
                          <p className="text-[11px] text-slate-500 font-sans mt-0.5">{m.desc}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 sm:text-right">
                        <span className="text-[11px] text-slate-400">{m.date}</span>
                        <span
                          className={`border px-2 py-0.5 text-[10px] font-bold ${
                            m.completed
                              ? "border-emerald-300 bg-emerald-50 text-[#0a5c36]"
                              : m.current
                              ? "border-blue-300 bg-blue-50 text-blue-700"
                              : "border-slate-200 bg-slate-50 text-slate-500"
                          }`}
                        >
                          {m.tag}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliverables & Artifact Repository matching Image 5 */}
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 font-mono text-xs">
                  <span className="font-bold uppercase tracking-wider text-slate-900">
                    DELIVERABLES & ARTIFACT REPOSITORY
                  </span>
                  <span className="text-slate-500">
                    {activeOrder.deliverables?.length || 3} FILES ATTACHED
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3 font-mono text-xs">
                  {(activeOrder.deliverables || [
                    { name: "M2-Wireframes-Export.zip", size: "34.2 MB", action: "DOWNLOAD ZIP", badge: "ZIP" },
                    { name: "Figma Workspace Prototype", size: "LIVE URL", action: "OPEN IN FIGMA", badge: "FIGMA" },
                    { name: "Creative-Scope-v2.pdf", size: "1.6 MB", action: "INSPECT DOCUMENT", badge: "PDF" },
                  ]).map((file, idx) => (
                    <div key={idx} className="border border-slate-200 bg-[#FAFBFB] p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-base">📁</span>
                          <span className="text-[10px] text-slate-500">{file.size}</span>
                        </div>
                        <p className="mt-2 font-bold text-slate-900 truncate" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-[10px] text-slate-400">{file.hash || "Hash: a778369c"}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => showToast(`Opening ${file.name}...`, "info")}
                        className="mt-3 border border-slate-300 bg-white py-1.5 font-bold uppercase text-[10px] tracking-wider text-slate-800 hover:border-slate-400 hover:bg-slate-50"
                      >
                        {file.action}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contract Audit & Direct Messaging matching Image 5 */}
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 font-mono text-xs">
                  <span className="font-bold uppercase tracking-wider text-slate-900">
                    CONTRACT AUDIT & DIRECT MESSAGING
                  </span>
                  <span className="flex items-center gap-1.5 text-[#0a5c36] font-bold">
                    <span className="h-2 w-2 rounded-full bg-[#0a5c36]" />
                    SOCKET LIVE
                  </span>
                </div>

                {/* Message stream */}
                <div className="mt-4 space-y-4 max-h-96 overflow-y-auto">
                  {(activeOrder.messages || []).map((msg, idx) => {
                    if (msg.isSystem) {
                      return (
                        <div
                          key={idx}
                          className="border border-emerald-200 bg-[#f7fcf9] p-3 text-center font-mono text-xs font-bold text-[#0a5c36]"
                        >
                          {msg.text}
                        </div>
                      );
                    }
                    const isBuyer = msg.role === "buyer";
                    return (
                      <div
                        key={idx}
                        className={`border p-4 text-xs font-sans ${
                          isBuyer ? "border-slate-200 bg-[#FAFBFB]" : "border-slate-200 bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between font-mono text-[11px]">
                          <span className="font-bold text-slate-900">{msg.sender}</span>
                          <span className="text-slate-400">{msg.time}</span>
                        </div>
                        <p className="mt-2 text-slate-800 leading-relaxed">{msg.text}</p>
                        {msg.attachment && (
                          <div className="mt-2.5 inline-flex items-center gap-1.5 border border-slate-200 bg-white px-2 py-1 font-mono text-[10px] text-slate-700">
                            <span>📎</span> {msg.attachment}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Revision Request Form if open */}
                {revisionOpen && (
                  <div className="mt-4 border border-amber-300 bg-amber-50 p-4">
                    <label className="block font-mono text-xs font-bold uppercase text-amber-950">
                      Specify Revision Requirements:
                    </label>
                    <textarea
                      rows={3}
                      value={revisionNote}
                      onChange={(e) => setRevisionNote(e.target.value)}
                      placeholder="List changes required before milestone approval..."
                      className="mt-2 w-full border border-amber-300 bg-white p-2 text-xs text-slate-900 focus:outline-none"
                    />
                    <div className="mt-2 flex justify-end gap-2 font-mono text-xs">
                      <button
                        type="button"
                        onClick={() => setRevisionOpen(false)}
                        className="border border-slate-300 bg-white px-3 py-1.5 text-slate-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleRevisionSubmit}
                        className="bg-amber-800 px-4 py-1.5 font-bold uppercase text-white hover:bg-amber-900"
                      >
                        Submit Revision Request
                      </button>
                    </div>
                  </div>
                )}

                {/* Milestone Release & Action Buttons matching Image 5 */}
                <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setRevisionOpen(!revisionOpen)}
                    className="border border-slate-300 bg-white px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-slate-800 hover:bg-slate-50 shadow-sm"
                  >
                    REQUEST REVISION
                  </button>
                  <button
                    type="button"
                    onClick={handleApproveMilestone}
                    disabled={isApproving}
                    className="bg-[#0a5c36] px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white hover:bg-[#084c2c] shadow-sm disabled:opacity-50"
                  >
                    ✓ APPROVE & RELEASE FUNDS (₹5,000)
                  </button>
                </div>

                {/* Chat input bar */}
                <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Post a contract update or milestone question..."
                    className="flex-1 border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-800 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-slate-950 px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white hover:bg-slate-800"
                  >
                    SEND MESSAGE
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="border border-slate-200 bg-white p-12 text-center font-mono text-xs text-slate-500">
              Select an order from the ledger to inspect milestone spec.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
