"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  MessageSquare,
  Pause,
  Pencil,
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
import DashboardShell from "@/components/dashboard/DashboardShell";
import StatCard from "@/components/dashboard/StatCard";
import DeliverModal from "@/components/orders/DeliverModal";
import SafeImage from "@/components/ui/SafeImage";
import { cn, formatPrice } from "@/lib/utils";

const TABS = [
  { value: "all", label: "All Contracts" },
  { value: "active", label: "In Flight" },
  { value: "delivered", label: "Under Review" },
  { value: "completed", label: "Settled" },
];

export default function FreelancerDashboard() {
  const { user } = useAuth();
  const {
    allGigs,
    orders,
    getFreelancer,
    deleteGig,
    updateGig,
  } = useMarketplace();
  const { showToast } = useToast();

  const [tab, setTab] = useState("all");
  const [deliverTarget, setDeliverTarget] = useState(null);

  const me = getFreelancer(user?.id || "f1");
  const myGigs = allGigs;
  const myOrders = orders;

  const counts = {
    all: myOrders.length,
    active: myOrders.filter((o) => o.status === "active").length,
    delivered: myOrders.filter((o) => o.status === "delivered").length,
    completed: myOrders.filter((o) => o.status === "completed").length,
  };

  const earned = myOrders.filter((o) => o.status === "completed").reduce((sum, o) => sum + o.price, 0);

  function copyProfileLink() {
    navigator.clipboard?.writeText(window.location.origin + `/freelancers/${me.id}`);
    showToast("Profile link copied to clipboard.");
  }

  return (
    <DashboardShell
      role="freelancer"
      path="/dashboard/freelancer"
      title="Builder Workspace & Sprint Pipeline"
      subtitle="Manage your audited services, pull requests, milestone deliverables and cryptographic settlement."
      actions={
        <div className="flex flex-wrap gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={copyProfileLink}
            className="border border-slate-300 bg-white px-3.5 py-2 font-semibold uppercase text-slate-700 hover:bg-slate-50"
          >
            COPY AUDITED PROFILE LINK
          </button>
          <Link
            href="/dashboard/freelancer/gigs/new"
            className="bg-[#0a5c36] px-4 py-2 font-bold uppercase tracking-wider text-white hover:bg-[#084c2c]"
          >
            + PUBLISH NEW SPEC
          </Link>
        </div>
      }
    >
      {/* Telemetry Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 font-mono">
        <StatCard icon={Briefcase} label="Active Specs" value={myGigs.length} tone="indigo" />
        <StatCard icon={ShoppingBag} label="Sprints In Flight" value={counts.active} tone="amber" />
        <StatCard icon={CheckCircle2} label="Milestones Settled" value={counts.completed} tone="emerald" />
        <StatCard icon={Wallet} label="Total Escrow Earned" value={`$${earned + 128400}.00`} hint="All-time settled" tone="emerald" />
      </div>

      {/* Published Technical Specs Section */}
      <section className="mt-10">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 className="font-serif text-2xl font-bold text-slate-950">
            AUDITED CONTRACT SPECS ({myGigs.length})
          </h2>
          <Link
            href="/dashboard/freelancer/gigs/new"
            className="font-mono text-xs font-bold uppercase text-[#0a5c36] hover:underline"
          >
            + ADD SPECIFICATION
          </Link>
        </div>

        <div className="mt-5 space-y-3 font-mono text-xs">
          {myGigs.map((g) => (
            <div
              key={g.id}
              className="border border-slate-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <SafeImage src={g.image} alt="" className="h-14 w-20 object-cover border border-slate-200" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="border border-emerald-300 bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-[#0a5c36]">
                      {g.tier || "VERIFIED"}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">{g.deliveryBadge || `⚡ ${g.deliveryDays}-Day SLA`}</span>
                  </div>
                  <Link href={`/gigs/${g.id}`} className="font-serif text-base font-bold text-slate-950 font-sans hover:text-[#0a5c36]">
                    {g.title}
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="font-serif text-lg font-bold text-slate-950">${g.price}</span>
                <Link
                  href={`/gigs/${g.id}`}
                  className="border border-slate-300 bg-white px-3 py-1.5 uppercase font-bold text-slate-700 hover:bg-slate-50"
                >
                  INSPECT SPEC
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Incoming Orders Section */}
      <section className="mt-12">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 className="font-serif text-2xl font-bold text-slate-950">
            INCOMING SPRINT LEDGER & ESCROW VAULTS
          </h2>
          <Link
            href="/orders"
            className="font-mono text-xs font-bold uppercase text-[#0a5c36] hover:underline"
          >
            OPEN CONTRACT OPERATIONS CONSOLE →
          </Link>
        </div>

        <div className="mt-4 flex gap-2 font-mono text-xs">
          {TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTab(t.value)}
              className={cn(
                "border px-3 py-1.5 uppercase tracking-wider transition",
                tab === t.value
                  ? "border-[#0a5c36] bg-[#0a5c36] font-bold text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              )}
            >
              {t.label} ({counts[t.value] || myOrders.length})
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4 font-mono text-xs">
          {myOrders.map((ord) => (
            <div
              key={ord.id}
              className="border border-slate-200 bg-white p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-950">{ord.code || `#${ord.id}`}</span>
                  <span className="border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-[#0a5c36] uppercase">
                    {ord.statusLabel || ord.status.toUpperCase()}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="font-sans font-semibold text-slate-700">Client: {ord.clientName}</span>
                </div>
                <h3 className="mt-2 font-serif text-lg font-bold text-slate-950 font-sans">
                  {ord.title}
                </h3>
                <p className="mt-1 text-slate-500 font-sans text-xs">
                  {ord.dueText || "Due in 2 days"} · Locked Escrow: ${ord.price}.00 USD
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setDeliverTarget(ord)}
                  className="bg-[#0a5c36] px-4 py-2 font-bold uppercase tracking-wider text-white hover:bg-[#084c2c]"
                >
                  PUSH DELIVERABLE →
                </button>
                <Link
                  href={`/orders/${ord.id}`}
                  className="border border-slate-300 bg-white px-3 py-2 font-bold uppercase tracking-wider text-slate-800 hover:bg-slate-50"
                >
                  AUDIT
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <DeliverModal order={deliverTarget} open={Boolean(deliverTarget)} onClose={() => setDeliverTarget(null)} />
    </DashboardShell>
  );
}
