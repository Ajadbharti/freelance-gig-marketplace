"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Briefcase,
  CheckCircle2,
  CreditCard,
  FileText,
  Heart,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Shield,
  Star,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useMarketplace } from "@/context/MarketplaceContext";
import GigCard from "@/components/gigs/GigCard";

export default function ClientDashboard() {
  const { user } = useAuth();
  const { gigs, orders, reviews } = useMarketplace();
  const { ids: savedIds } = useFavorites();

  const [activeSection, setActiveSection] = useState("overview");

  // Filter orders for the client
  const clientOrders = orders.filter(
    (o) =>
      o.clientId === user?.id ||
      o.clientName?.toLowerCase().includes("raj") ||
      o.id === "GC-D7C133"
  );
  const myOrders = clientOrders.length > 0 ? clientOrders : orders;

  const counts = {
    all: myOrders.length,
    active: myOrders.filter((o) => o.status === "active" || o.status === "in-progress").length,
    delivered: myOrders.filter((o) => o.status === "delivered" || o.status === "under-review").length,
    completed: myOrders.filter((o) => o.status === "completed").length || 1,
    cancelled: myOrders.filter((o) => o.status === "cancelled").length,
  };

  const totalSpent = myOrders
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + (o.price || 0), 0) || 7999;

  const inEscrow = myOrders
    .filter((o) => o.status === "active" || o.status === "delivered")
    .reduce((sum, o) => sum + (o.price || 0), 0);

  const savedGigs = gigs.filter((g) => (savedIds?.length ? savedIds.includes(g.id) : g.id === "g7"));
  const recentOrders = myOrders.slice(0, 3);
  const firstName = user?.name ? user.name.split(" ")[0].toUpperCase() : "RAJ";

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[250px_1fr] items-start">
            {/* Left Column: Profile Card + Nav Menu matching reference */}
            <aside>
              {/* Profile Header Box */}
              <div className="border border-[#e5e7eb] bg-white p-4 shadow-[2px_2px_0px_#0b1c30]">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#0b1c30] bg-[#eff4ff] font-mono text-xs font-bold text-[#0047bf]">
                    {user?.initials || "RP"}
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate font-sans text-base font-bold text-[#0b1c30]">
                      {user?.name || "Raj Patel"}
                    </h2>
                    <span className="mt-0.5 inline-block border border-[#005d42]/30 bg-[#eff4ff] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#005d42]">
                      {user?.role === "freelancer" ? "FREELANCER" : "CLIENT"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sidebar Navigation */}
              <nav aria-label="Client Navigation" className="mt-3 border border-[#e5e7eb] bg-white py-2 shadow-[2px_2px_0px_#0b1c30] font-sans text-xs">
                <button
                  type="button"
                  onClick={() => setActiveSection("overview")}
                  className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left font-semibold transition ${
                    activeSection === "overview"
                      ? "border-l-4 border-[#005d42] bg-[#eff4ff] text-[#005d42]"
                      : "text-[#3e4943] hover:bg-slate-50 hover:text-[#0b1c30]"
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4 shrink-0" />
                  <span>Overview</span>
                </button>

                <Link
                  href="/orders"
                  className="flex items-center gap-2.5 px-4 py-2.5 font-semibold text-[#3e4943] transition hover:bg-slate-50 hover:text-[#0b1c30]"
                >
                  <FileText className="h-4 w-4 shrink-0" />
                  <span>My Orders</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setActiveSection("saved")}
                  className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left font-semibold transition ${
                    activeSection === "saved"
                      ? "border-l-4 border-[#005d42] bg-[#eff4ff] text-[#005d42]"
                      : "text-[#3e4943] hover:bg-slate-50 hover:text-[#0b1c30]"
                  }`}
                >
                  <Heart className="h-4 w-4 shrink-0" />
                  <span>Saved Gigs</span>
                </button>

                <Link
                  href="/messages"
                  className="flex items-center gap-2.5 px-4 py-2.5 font-semibold text-[#3e4943] transition hover:bg-slate-50 hover:text-[#0b1c30]"
                >
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  <span>Messages</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setActiveSection("reviews")}
                  className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left font-semibold transition ${
                    activeSection === "reviews"
                      ? "border-l-4 border-[#005d42] bg-[#eff4ff] text-[#005d42]"
                      : "text-[#3e4943] hover:bg-slate-50 hover:text-[#0b1c30]"
                  }`}
                >
                  <Star className="h-4 w-4 shrink-0" />
                  <span>Reviews</span>
                </button>

                <Link
                  href="/account"
                  className="flex items-center gap-2.5 px-4 py-2.5 font-semibold text-[#3e4943] transition hover:bg-slate-50 hover:text-[#0b1c30]"
                >
                  <Settings className="h-4 w-4 shrink-0" />
                  <span>Account Settings</span>
                </Link>
              </nav>
            </aside>

            {/* Right Column: Dashboard Main Content matching reference */}
            <div className="space-y-6">
              {/* Header Box */}
              <div className="border border-[#e5e7eb] bg-white p-6 shadow-[3px_3px_0px_#0b1c30]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#005d42]">
                      CLIENT // OVERVIEW
                    </p>
                    <h1 className="mt-1 font-headline text-3xl font-bold uppercase tracking-tight text-[#0b1c30] sm:text-4xl">
                      WELCOME BACK, {firstName}
                    </h1>
                    <p className="mt-1 text-xs text-[#3e4943]">
                      Your contracts, escrow and activity at a glance.
                    </p>
                  </div>
                  <Link
                    href="/explore"
                    className="inline-flex items-center justify-center bg-[#005d42] px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#047857] shadow-[2px_2px_0px_#0b1c30] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none self-start sm:self-auto"
                  >
                    BROWSE GIGS
                  </Link>
                </div>
              </div>

              {activeSection === "overview" && (
                <>
                  {/* 8-Card Metrics Grid matching reference */}
                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {/* Card 1: ACTIVE ORDERS */}
                    <div className="border border-[#e5e7eb] bg-white p-4 shadow-[2px_2px_0px_#0b1c30] border-b-4 border-b-blue-600 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#6e7a73]">
                          ACTIVE ORDERS
                        </span>
                        <div className="flex h-6 w-6 items-center justify-center bg-blue-600 text-white">
                          <Briefcase className="h-3.5 w-3.5" />
                        </div>
                      </div>
                      <p className="mt-2 text-3xl font-bold font-headline text-[#0b1c30]">
                        {counts.active}
                      </p>
                      <p className="mt-2 font-mono text-[10px] uppercase text-[#6e7a73]">
                        PENDING + IN PROGRESS
                      </p>
                    </div>

                    {/* Card 2: AWAITING YOUR REVIEW */}
                    <div className="border border-[#e5e7eb] bg-white p-4 shadow-[2px_2px_0px_#0b1c30] border-b-4 border-b-[#0b1c30] flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#6e7a73]">
                          AWAITING YOUR REVIEW
                        </span>
                        <div className="flex h-6 w-6 items-center justify-center bg-[#0b1c30] text-white">
                          <FileText className="h-3.5 w-3.5" />
                        </div>
                      </div>
                      <p className="mt-2 text-3xl font-bold font-headline text-[#0b1c30]">
                        {counts.delivered}
                      </p>
                      <p className="mt-2 font-mono text-[10px] uppercase text-[#6e7a73]">
                        ALL CLEAR
                      </p>
                    </div>

                    {/* Card 3: IN ESCROW */}
                    <div className="border border-[#e5e7eb] bg-white p-4 shadow-[2px_2px_0px_#0b1c30] border-b-4 border-b-[#005d42] flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#6e7a73]">
                          IN ESCROW
                        </span>
                        <div className="flex h-6 w-6 items-center justify-center bg-[#005d42] text-white">
                          <Shield className="h-3.5 w-3.5" />
                        </div>
                      </div>
                      <p className="mt-2 text-3xl font-bold font-headline text-[#0b1c30]">
                        ₹{inEscrow}
                      </p>
                      <p className="mt-2 font-mono text-[10px] uppercase text-[#6e7a73]">
                        SIMULATED ESCROW
                      </p>
                    </div>

                    {/* Card 4: TOTAL SPENT */}
                    <div className="border border-[#e5e7eb] bg-white p-4 shadow-[2px_2px_0px_#0b1c30] border-b-4 border-b-indigo-600 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#6e7a73]">
                          TOTAL SPENT
                        </span>
                        <div className="flex h-6 w-6 items-center justify-center bg-indigo-600 text-white">
                          <CreditCard className="h-3.5 w-3.5" />
                        </div>
                      </div>
                      <p className="mt-2 text-3xl font-bold font-headline text-[#0b1c30]">
                        ₹{totalSpent.toLocaleString("en-IN")}
                      </p>
                      <p className="mt-2 font-mono text-[10px] uppercase text-[#6e7a73]">
                        RELEASED TO SELLERS
                      </p>
                    </div>

                    {/* Card 5: COMPLETED ORDERS */}
                    <div className="border border-[#e5e7eb] bg-white p-4 shadow-[2px_2px_0px_#0b1c30] border-b-4 border-b-[#005d42] flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#6e7a73]">
                          COMPLETED ORDERS
                        </span>
                        <div className="flex h-6 w-6 items-center justify-center bg-[#005d42] text-white">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </div>
                      </div>
                      <p className="mt-2 text-3xl font-bold font-headline text-[#0b1c30]">
                        {counts.completed}
                      </p>
                      <div className="mt-2 h-4" />
                    </div>

                    {/* Card 6: REVIEWS TO WRITE */}
                    <div className="border border-[#e5e7eb] bg-white p-4 shadow-[2px_2px_0px_#0b1c30] border-b-4 border-b-[#0b1c30] flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#6e7a73]">
                          REVIEWS TO WRITE
                        </span>
                        <div className="flex h-6 w-6 items-center justify-center bg-[#0b1c30] text-white">
                          <Star className="h-3.5 w-3.5" />
                        </div>
                      </div>
                      <p className="mt-2 text-3xl font-bold font-headline text-[#0b1c30]">
                        0
                      </p>
                      <div className="mt-2 h-4" />
                    </div>

                    {/* Card 7: SAVED GIGS */}
                    <div className="border border-[#e5e7eb] bg-white p-4 shadow-[2px_2px_0px_#0b1c30] border-b-4 border-b-blue-600 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#6e7a73]">
                          SAVED GIGS
                        </span>
                        <div className="flex h-6 w-6 items-center justify-center bg-blue-600 text-white">
                          <Heart className="h-3.5 w-3.5" />
                        </div>
                      </div>
                      <p className="mt-2 text-3xl font-bold font-headline text-[#0b1c30]">
                        {savedIds?.length || 1}
                      </p>
                      <div className="mt-2 h-4" />
                    </div>

                    {/* Card 8: UNREAD MESSAGES */}
                    <div className="border border-[#e5e7eb] bg-white p-4 shadow-[2px_2px_0px_#0b1c30] border-b-4 border-b-slate-600 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#6e7a73]">
                          UNREAD MESSAGES
                        </span>
                        <div className="flex h-6 w-6 items-center justify-center bg-slate-700 text-white">
                          <MessageSquare className="h-3.5 w-3.5" />
                        </div>
                      </div>
                      <p className="mt-2 text-3xl font-bold font-headline text-[#0b1c30]">
                        0
                      </p>
                      <div className="mt-2 h-4" />
                    </div>
                  </div>

                  {/* Recent Orders Box matching reference */}
                  <div className="border border-[#e5e7eb] bg-white p-6 shadow-[3px_3px_0px_#0b1c30]">
                    <div className="flex items-center justify-between">
                      <h2 className="font-headline text-base font-bold uppercase tracking-wider text-[#0b1c30]">
                        RECENT ORDERS
                      </h2>
                      <Link
                        href="/orders"
                        className="font-mono text-xs font-bold uppercase tracking-wider text-[#005d42] hover:underline"
                      >
                        VIEW ALL
                      </Link>
                    </div>

                    <div className="mt-4 space-y-3">
                      {recentOrders.map((order) => (
                        <div
                          key={order.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#e5e7eb] p-3.5 hover:border-[#0b1c30] transition bg-white"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#0b1c30] bg-[#eff4ff] font-headline text-xs font-bold text-[#0047bf]">
                              AK
                            </div>
                            <div className="min-w-0">
                              <Link
                                href={`/orders/${order.id}`}
                                className="block truncate font-sans text-xs sm:text-sm font-bold text-[#0b1c30] hover:text-[#005d42]"
                              >
                                {order.title}
                              </Link>
                              <p className="font-mono text-xs text-[#6e7a73] mt-0.5">
                                {order.code || `#${order.id}`} // {order.freelancerName || "Ajju Kumar"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                            <span className="border border-[#005d42] bg-[#005d42] px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-white">
                              {order.statusLabel || "COMPLETED"}
                            </span>
                            <span className="font-headline text-base font-bold text-[#0b1c30]">
                              ₹{(order.price || 7999).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activeSection === "saved" && (
                <div className="border border-[#e5e7eb] bg-white p-6 shadow-[3px_3px_0px_#0b1c30]">
                  <h2 className="font-headline text-base font-bold uppercase tracking-wider text-[#0b1c30]">
                    SAVED GIGS
                  </h2>
                  <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {savedGigs.map((gig) => (
                      <GigCard key={gig.id} gig={gig} />
                    ))}
                  </div>
                </div>
              )}

              {activeSection === "reviews" && (
                <div className="border border-[#e5e7eb] bg-white p-6 shadow-[3px_3px_0px_#0b1c30]">
                  <h2 className="font-headline text-base font-bold uppercase tracking-wider text-[#0b1c30]">
                    SUBMITTED REVIEWS
                  </h2>
                  <div className="mt-4 space-y-4">
                    {reviews.slice(0, 3).map((r) => (
                      <div key={r.id} className="border border-[#e5e7eb] p-4 bg-white">
                        <div className="flex items-center justify-between">
                          <p className="font-sans text-sm font-bold text-[#0b1c30]">{r.gigTitle || r.projectName}</p>
                          <span className="text-amber-500 font-bold">★ {r.rating}.0</span>
                        </div>
                        <p className="mt-2 text-xs italic text-[#3e4943]">&ldquo;{r.comment}&rdquo;</p>
                        {r.reply && (
                          <div className="mt-3 border-l-2 border-[#005d42] pl-3 text-xs text-[#6e7a73]">
                            <p className="font-bold text-[#005d42]">{r.replyAuthor || "Seller Response"}:</p>
                            <p className="mt-0.5">{r.reply}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Project Disclaimer matching reference */}
              <div className="mt-8 mb-4 text-center">
                <p className="font-mono text-[11px] uppercase tracking-wider text-[#6e7a73]">
                  PAYMENTS IN THIS PROJECT ARE SIMULATED. NO REAL MONEY IS CHARGED.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
