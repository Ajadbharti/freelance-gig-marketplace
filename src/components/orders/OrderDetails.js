"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Archive,
  ArrowRight,
  Check,
  Clock,
  Download,
  ExternalLink,
  Eye,
  FileCheck,
  FileCode,
  FileText,
  Lock,
  Mail,
  Paperclip,
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
import { formatPrice } from "@/lib/utils";

export default function OrderDetails({ initialOrderId }) {
  const { user } = useAuth();
  const {
    orders,
    getOrder,
    completeOrder,
    requestRevision,
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
    if (filterTab === "in-progress" && o.status !== "in-progress" && o.status !== "active") return false;
    if (filterTab === "under-review" && o.status !== "under-review" && o.status !== "delivered") return false;
    if (filterTab === "delivered" && o.status !== "delivered") return false;
    if (filterTab === "completed" && o.status !== "completed") return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        o.title.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q) ||
        o.code?.toLowerCase().includes(q) ||
        o.freelancerName?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  async function handleApproveMilestone() {
    if (!activeOrder) return;
    setIsApproving(true);
    const result = await completeOrder(activeOrder.id);
    setIsApproving(false);
    if (result.ok) {
      showToast(`Milestone approved! ${formatPrice(activeOrder.currentMilestoneAmount || 5000)} disbursed from escrow vault.`, "success");
    } else {
      showToast(result.error || "Approval failed.", "error");
    }
  }

  async function handleRevisionSubmit() {
    if (!activeOrder) return;
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
    if (!activeOrder) return;
    if (!chatInput.trim()) return;
    await sendOrderMessage(activeOrder.id, chatInput.trim());
    setChatInput("");
    showToast("Message sent to contract thread.");
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Protocol Breadcrumb Kicker */}
        <div className="font-mono text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 bg-[#0b1c30]"></span>
          <span>SYSTEM // CONTRACT OPS ■ ESCROW GUARANTEED</span>
        </div>

        {/* Title, Subtitle & Search / Export Bar */}
        <div className="mt-3 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              ORDER MANAGEMENT & ACTIVE DELIVERIES
            </h1>
            <p className="mt-1 font-mono text-xs text-slate-600">
              Real-time cryptographic milestone reconciliation, audit trails, and multi-signature escrow disbursement.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs shrink-0">
            <div className="flex items-center border border-slate-300 bg-white px-3 py-2 shadow-sm rounded-none">
              <Search className="h-3.5 w-3.5 text-slate-400 mr-2" />
              <input
                type="text"
                placeholder="Filter order, hash or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
              />
            </div>
            <button
              type="button"
              onClick={() => showToast("Exporting cryptographic CSV audit ledger...", "info")}
              className="border border-slate-300 bg-white px-4 py-2 font-bold uppercase tracking-wider text-slate-800 shadow-[2px_2px_0px_#0b1c30] hover:bg-slate-50 transition active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1.5 rounded-none"
            >
              <Download className="h-3.5 w-3.5" />
              EXPORT REPORT
            </button>
          </div>
        </div>

        {/* Filter Tabs matching exact design */}
        <div className="mt-6 flex border border-slate-200 bg-white font-mono text-xs font-bold overflow-x-auto shadow-sm rounded-none">
          <button
            type="button"
            onClick={() => setFilterTab("all")}
            className={`px-5 py-3 whitespace-nowrap uppercase tracking-wider transition ${
              filterTab === "all"
                ? "bg-[#0b1c30] text-white"
                : "text-slate-700 hover:bg-slate-50 border-r border-slate-200"
            }`}
          >
            ALL ORDERS (14)
          </button>
          <button
            type="button"
            onClick={() => setFilterTab("in-progress")}
            className={`px-5 py-3 whitespace-nowrap uppercase tracking-wider transition border-r border-slate-200 ${
              filterTab === "in-progress"
                ? "bg-[#0b1c30] text-white"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            IN PROGRESS (4)
          </button>
          <button
            type="button"
            onClick={() => setFilterTab("under-review")}
            className={`px-5 py-3 whitespace-nowrap uppercase tracking-wider transition border-r border-slate-200 ${
              filterTab === "under-review"
                ? "bg-[#0b1c30] text-white"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            UNDER REVIEW (2)
          </button>
          <button
            type="button"
            onClick={() => setFilterTab("delivered")}
            className={`px-5 py-3 whitespace-nowrap uppercase tracking-wider transition border-r border-slate-200 ${
              filterTab === "delivered"
                ? "bg-[#0b1c30] text-white"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            DELIVERED (1)
          </button>
          <button
            type="button"
            onClick={() => setFilterTab("completed")}
            className={`px-5 py-3 whitespace-nowrap uppercase tracking-wider transition ${
              filterTab === "completed"
                ? "bg-[#0b1c30] text-white"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            COMPLETED (7)
          </button>
        </div>

        {/* 4 Telemetry Metrics Cards matching exact design */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4 font-mono">
          {/* Card 1: Active Pipeline */}
          <div className="border border-slate-200 bg-white p-5 shadow-sm rounded-none">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-bold uppercase tracking-wider">ACTIVE PIPELINE</span>
              <div className="h-6 w-6 bg-[#0047bf] text-white flex items-center justify-center text-xs">
                <FileText className="h-3.5 w-3.5" />
              </div>
            </div>
            <p className="mt-2 font-serif text-3xl font-bold text-slate-950">4</p>
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px]">
              <span className="text-slate-400 uppercase">SLA PACE</span>
              <span className="text-[#0047bf] font-bold">100% HEALTHY</span>
            </div>
          </div>

          {/* Card 2: Awaiting Review */}
          <div className="border border-slate-200 bg-white p-5 shadow-sm rounded-none">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-bold uppercase tracking-wider">AWAITING REVIEW</span>
              <div className="h-6 w-6 bg-[#0b1c30] text-white flex items-center justify-center text-xs">
                <Clock className="h-3.5 w-3.5" />
              </div>
            </div>
            <p className="mt-2 font-serif text-3xl font-bold text-slate-950">2</p>
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px]">
              <span className="text-slate-400 uppercase">PENDING SIGN-OFF</span>
              <span className="text-slate-900 font-bold uppercase">ACTION REQ.</span>
            </div>
          </div>

          {/* Card 3: Escrow Vault Secured */}
          <div className="border border-slate-200 bg-white p-5 shadow-sm rounded-none">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-bold uppercase tracking-wider">ESCROW VAULT SECURED</span>
              <div className="h-6 w-6 bg-[#047857] text-white flex items-center justify-center text-xs">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
            </div>
            <p className="mt-2 font-serif text-3xl font-bold text-[#047857]">₹7,999</p>
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px]">
              <span className="text-slate-400 uppercase">DISPUTE PROTECTION</span>
              <span className="text-slate-900 font-bold uppercase">MULTI-SIG LOCK</span>
            </div>
          </div>

          {/* Card 4: On-Time Completion */}
          <div className="border border-slate-200 bg-white p-5 shadow-sm rounded-none">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[11px] font-bold uppercase tracking-wider">ON-TIME COMPLETION</span>
              <div className="h-6 w-6 bg-[#0b1c30] text-white flex items-center justify-center text-xs">
                <Check className="h-3.5 w-3.5" />
              </div>
            </div>
            <p className="mt-2 font-serif text-3xl font-bold text-slate-950">100%</p>
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px]">
              <span className="text-slate-400 uppercase">BENCHMARK BASELINE</span>
              <span className="text-slate-900 font-bold uppercase">TOP 1% FREELANCER</span>
            </div>
          </div>
        </div>

        {/* 2-Column Split: Contract Ledger (Left) + Detailed Contract Panel (Right) */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[360px_1fr]">
          {/* Left Column: Contract Ledger */}
          <div className="space-y-4">
            <div className="flex items-center justify-between font-mono text-xs text-slate-500">
              <span className="font-bold text-slate-900 uppercase tracking-wider">CONTRACT LEDGER</span>
              <span>Sorted by: Urgency</span>
            </div>

            <div className="space-y-3">
              {ledgerOrders.map((ord) => {
                const isSelected = ord.id === activeOrder?.id;
                let badgeBg = "bg-[#047857] text-white";
                if (ord.status === "in-progress" || ord.status === "active") {
                  badgeBg = "bg-[#0047bf] text-white";
                } else if (ord.status === "under-review" || ord.status === "delivered") {
                  badgeBg = "bg-[#3730a3] text-white";
                }

                return (
                  <div
                    key={ord.id}
                    onClick={() => setSelectedId(ord.id)}
                    className={`cursor-pointer border p-4 transition shadow-sm rounded-none ${
                      isSelected
                        ? "border-slate-400 border-l-4 border-l-[#0047bf] bg-white ring-1 ring-slate-200"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{ord.code || `#${ord.id}`}</span>
                        <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-none ${badgeBg}`}>
                          {ord.statusLabel || (ord.status === "in-progress" ? "IN PROGRESS" : ord.status.toUpperCase())}
                        </span>
                      </div>
                      <span className="font-bold text-slate-950 font-mono">
                        {formatPrice(ord.price)}
                      </span>
                    </div>

                    <h4 className="mt-2 font-serif text-sm font-bold text-slate-950 leading-snug">
                      {ord.title}
                    </h4>

                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 font-mono text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5 truncate">
                        <SafeImage
                          src={ord.freelancerAvatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80"}
                          alt=""
                          className="h-4 w-4 rounded-none object-cover"
                        />
                        <span className="truncate text-slate-700 font-medium">{ord.freelancerName}</span>
                      </div>
                      <span className="shrink-0 text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {ord.dueText || "Due in 2 days (Oct 24)"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Contract Panel */}
          {activeOrder ? (
            <div className="border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-8 rounded-none">
              {/* Header Box */}
              <div className="border-b border-slate-100 pb-6">
                <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="border border-slate-300 bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 uppercase rounded-none">
                      ID: {activeOrder.id}
                    </span>
                    <span className="bg-[#0047bf] px-2.5 py-0.5 font-bold text-white uppercase text-[10px] rounded-none">
                      {activeOrder.milestoneFlight || "MILESTONE 3 OF 5 IN FLIGHT"}
                    </span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">
                    INITIATED: {activeOrder.initiatedAt || "2026-10-18 // 14:32:09 UTC"}
                  </span>
                </div>

                <h2 className="mt-3 font-serif text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl uppercase">
                  {activeOrder.title}
                </h2>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed max-w-3xl font-sans">
                  {activeOrder.description}
                </p>

                {/* 3-Col Box: Contractor / Buyer / Vault Commitment */}
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3 border border-slate-200 bg-[#f8f9ff] p-4 font-mono text-xs rounded-none">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold">CONTRACTOR (SELLER)</span>
                    <div className="mt-1 flex items-center gap-2">
                      <SafeImage
                        src={activeOrder.freelancerAvatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80"}
                        alt=""
                        className="h-5 w-5 rounded-none object-cover"
                      />
                      <span className="font-bold text-slate-900">{activeOrder.freelancerName}</span>
                    </div>
                    <p className="mt-0.5 text-[10px] text-[#047857] font-semibold">
                      {activeOrder.freelancerBadge || "Top Rated Plus (100%)"}
                    </p>
                  </div>

                  <div className="sm:border-l sm:border-slate-200 sm:pl-4">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">CLIENT (BUYER)</span>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center bg-blue-100 text-[#0047bf] font-bold text-[10px] rounded-none">
                        {activeOrder.clientInitials || "AC"}
                      </div>
                      <span className="font-bold text-slate-900">{activeOrder.clientName || "Apex Cloud Labs"}</span>
                    </div>
                    <p className="mt-0.5 text-[10px] text-slate-500">
                      {activeOrder.clientBadge || "Verified Payment Method"}
                    </p>
                  </div>

                  <div className="sm:border-l sm:border-slate-200 sm:pl-4">
                    <span className="text-slate-400 text-[10px] uppercase font-bold">VAULT COMMITMENT</span>
                    <p className="mt-1 font-bold text-slate-950 font-mono">
                      {activeOrder.vaultCommitment || formatPrice(activeOrder.price)}
                    </p>
                    <p className="mt-0.5 text-[10px] text-[#047857] font-bold flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      100% ESCROW SECURED
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 1: Execution Milestones & Audit Trail */}
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 font-mono text-xs">
                  <span className="font-serif font-bold uppercase tracking-wider text-slate-900 text-sm">
                    EXECUTION MILESTONES & AUDIT TRAIL
                  </span>
                  <span className="font-mono font-bold text-slate-500">
                    {activeOrder.progress || 60}% PROGRESS
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-none">
                  <div
                    className="h-full bg-[#047857] transition-all duration-300"
                    style={{ width: `${activeOrder.progress || 60}%` }}
                  />
                </div>

                {/* Milestones steps list matching exact styling */}
                <div className="mt-5 space-y-3 font-mono text-xs">
                  {(activeOrder.milestones || []).map((m, idx) => {
                    const isCompleted = m.completed;
                    const isCurrent = m.current;

                    return (
                      <div
                        key={idx}
                        className={`border p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-none ${
                          isCurrent
                            ? "border-blue-200 bg-[#f0f6ff]"
                            : isCompleted
                            ? "border-slate-200 bg-white"
                            : "border-slate-200 bg-white opacity-80"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center text-[10px] font-bold rounded-none ${
                              isCompleted
                                ? "bg-[#047857] text-white"
                                : isCurrent
                                ? "bg-[#0047bf] text-white text-[8px]"
                                : "border border-slate-300 bg-white text-slate-500"
                            }`}
                          >
                            {isCompleted ? "✓" : isCurrent ? "■" : m.number || idx + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className={`font-bold uppercase ${isCompleted || isCurrent ? "text-slate-900" : "text-slate-700"}`}>
                                {m.title}
                              </p>
                              {isCurrent && (
                                <span className="bg-[#0047bf] text-white text-[9px] font-bold px-1.5 py-0.5 uppercase rounded-none">
                                  {m.currentTag || "CURRENT SPRINT"}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                              {m.desc}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 sm:text-right">
                          <span className={`text-[11px] font-mono ${isCurrent ? "text-[#0047bf] font-bold" : "text-slate-400"}`}>
                            {m.date}
                          </span>
                          <span
                            className={`border px-2 py-0.5 text-[10px] font-bold uppercase rounded-none ${
                              isCompleted
                                ? "border-emerald-300 bg-emerald-50 text-[#047857]"
                                : isCurrent
                                ? "border-blue-300 bg-blue-100 text-[#0047bf]"
                                : "border-slate-200 bg-slate-50 text-slate-500"
                            }`}
                          >
                            {m.tag}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: Deliverables & Artifact Repository */}
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 font-mono text-xs">
                  <span className="font-serif font-bold uppercase tracking-wider text-slate-900 text-sm">
                    DELIVERABLES & ARTIFACT REPOSITORY
                  </span>
                  <span className="text-slate-500 font-mono">
                    {activeOrder.deliverables?.length || 3} FILES ATTACHED
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3 font-mono text-xs">
                  {(activeOrder.deliverables || []).map((file, idx) => (
                    <div
                      key={idx}
                      className="border border-slate-200 bg-white p-4 flex flex-col justify-between shadow-sm rounded-none"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          {file.type === "figma" ? (
                            <span className="text-[#0047bf] font-bold text-sm">❖</span>
                          ) : (
                            <FileText className={`h-4 w-4 ${idx === 0 ? "text-[#047857]" : "text-slate-700"}`} />
                          )}
                          {file.isLive ? (
                            <span className="bg-[#0047bf] text-white text-[9px] font-bold px-1.5 py-0.5 uppercase rounded-none">
                              LIVE URL
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500">{file.size}</span>
                          )}
                        </div>
                        <p className="mt-2 font-bold text-slate-900 truncate" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {file.sub || file.hash || "Hash: a778369c"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => showToast(`Accessing deliverable: ${file.name}`, "info")}
                        className="mt-4 border border-slate-300 bg-white py-2 font-bold uppercase text-[10px] tracking-wider text-slate-800 hover:bg-slate-50 transition active:translate-x-0.5 active:translate-y-0.5 rounded-none"
                      >
                        {file.action || "DOWNLOAD"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Contract Audit & Direct Messaging */}
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 font-mono text-xs">
                  <span className="font-serif font-bold uppercase tracking-wider text-slate-900 text-sm">
                    CONTRACT AUDIT & DIRECT MESSAGING
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-900 font-bold font-mono">
                    <span className="h-2 w-2 bg-[#047857]" />
                    SOCKET LIVE
                  </span>
                </div>

                {/* Messages stream */}
                <div className="mt-4 space-y-3">
                  {(activeOrder.messages || []).map((msg, idx) => {
                    if (msg.isSystem) {
                      return (
                        <div
                          key={idx}
                          className="border border-blue-200 bg-[#f0f6ff] py-2 px-4 text-center font-mono text-[11px] font-bold text-slate-900 tracking-wide rounded-none flex items-center justify-center gap-2"
                        >
                          <ShieldCheck className="h-3.5 w-3.5 text-[#0047bf]" />
                          <span>{msg.text}</span>
                        </div>
                      );
                    }

                    const isBuyer = msg.role === "buyer";

                    return (
                      <div
                        key={idx}
                        className={`border p-4 text-xs font-sans rounded-none ${
                          isBuyer ? "border-slate-200 bg-[#f8f9ff]" : "border-blue-200 bg-[#f0f6ff]"
                        }`}
                      >
                        <div className="flex items-center justify-between font-mono text-[11px]">
                          <div className="flex items-center gap-2">
                            {isBuyer ? (
                              <div className="flex h-4 w-4 items-center justify-center bg-blue-100 text-[#0047bf] font-bold text-[9px] rounded-none">
                                {msg.initials || "AC"}
                              </div>
                            ) : null}
                            <span className="font-bold text-slate-900">{msg.sender}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400">{msg.time}</span>
                            {!isBuyer && (
                              <SafeImage
                                src={msg.avatar || activeOrder.freelancerAvatar}
                                alt=""
                                className="h-4 w-4 rounded-none object-cover"
                              />
                            )}
                          </div>
                        </div>

                        <p className="mt-2 text-slate-800 leading-relaxed font-sans">{msg.text}</p>

                        {msg.attachment && (
                          <div className="mt-3 inline-flex items-center gap-1.5 border border-slate-300 bg-white px-2.5 py-1 font-mono text-[10px] text-slate-800 rounded-none shadow-sm">
                            <FileCode className="h-3.5 w-3.5 text-slate-500" />
                            <span>{msg.attachment}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Revision Request Form if open */}
                {revisionOpen && (
                  <div className="mt-4 border border-amber-300 bg-amber-50 p-4 rounded-none">
                    <label className="block font-mono text-xs font-bold uppercase text-amber-950">
                      Specify Revision Requirements:
                    </label>
                    <textarea
                      rows={3}
                      value={revisionNote}
                      onChange={(e) => setRevisionNote(e.target.value)}
                      placeholder="List changes required before milestone approval..."
                      className="mt-2 w-full border border-amber-300 bg-white p-2 text-xs text-slate-900 focus:outline-none rounded-none"
                    />
                    <div className="mt-2 flex justify-end gap-2 font-mono text-xs">
                      <button
                        type="button"
                        onClick={() => setRevisionOpen(false)}
                        className="border border-slate-300 bg-white px-3 py-1.5 text-slate-700 rounded-none"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleRevisionSubmit}
                        className="bg-amber-800 px-4 py-1.5 font-bold uppercase text-white hover:bg-amber-900 rounded-none"
                      >
                        Submit Revision Request
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons matching screenshot */}
                <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setRevisionOpen(!revisionOpen)}
                    className="border border-slate-300 bg-white px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-slate-800 hover:bg-slate-50 shadow-sm rounded-none flex items-center gap-1.5 transition active:translate-x-0.5 active:translate-y-0.5"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    REQUEST REVISION
                  </button>
                  <button
                    type="button"
                    onClick={handleApproveMilestone}
                    disabled={isApproving}
                    className="bg-[#005d42] px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white hover:bg-[#047857] shadow-sm rounded-none flex items-center gap-1.5 transition active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
                  >
                    <Check className="h-3.5 w-3.5" />
                    APPROVE &amp; RELEASE FUNDS ({formatPrice(activeOrder.currentMilestoneAmount || 5000)})
                  </button>
                </div>

                {/* Escrow Protocol v2.4 text */}
                <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-widest text-slate-400">
                  MARKETPLACE ESCROW PROTOCOL v2.4
                </p>

                {/* Chat input form */}
                <form onSubmit={handleSendMessage} className="mt-2 flex items-center border border-slate-300 bg-white rounded-none">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Post a contract update or milestone question..."
                    className="flex-1 px-3 py-2.5 font-mono text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
                  />
                  <button
                    type="submit"
                    className="bg-[#0b1c30] px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white hover:bg-slate-800 transition active:translate-x-0.5 active:translate-y-0.5 flex items-center gap-1.5 rounded-none shrink-0"
                  >
                    <Send className="h-3.5 w-3.5" />
                    SEND MESSAGE
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="border border-slate-200 bg-white p-12 text-center font-mono text-xs text-slate-500 rounded-none">
              Select an order from the ledger to inspect milestone spec.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
