"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { averageRating } from "@/lib/utils";
import { gigs as seedGigs } from "@/data/gigs";
import { freelancers as seedFreelancers } from "@/data/freelancers";
import { orders as seedOrders } from "@/data/orders";
import { reviews as seedReviews } from "@/data/reviews";

const MarketplaceContext = createContext(null);

const REQUEST_TIMEOUT_MS = 3000;
const ok = (extra = {}) => ({ ok: true, ...extra });
const fail = (error) => ({ ok: false, error });

function withTimeout(promise, label) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`${label} timed out`)),
      REQUEST_TIMEOUT_MS
    );
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

export function MarketplaceProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [gigs, setGigs] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("gigcraft_in:gigs");
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return seedGigs;
  });

  const [freelancers, setFreelancers] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("gigcraft_in:freelancers");
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return seedFreelancers;
  });

  const [orders, setOrders] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("gigcraft_in:orders");
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return seedOrders;
  });

  const [reviews, setReviews] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("gigcraft_in:reviews");
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return seedReviews;
  });

  const [hydrated, setHydrated] = useState(true);

  // Sync state to localStorage on changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("gigcraft_in:gigs", JSON.stringify(gigs));
      } catch {}
    }
  }, [gigs]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("gigcraft_in:freelancers", JSON.stringify(freelancers));
      } catch {}
    }
  }, [freelancers]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("gigcraft_in:orders", JSON.stringify(orders));
      } catch {}
    }
  }, [orders]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("gigcraft_in:reviews", JSON.stringify(reviews));
      } catch {}
    }
  }, [reviews]);

  // Try fetching live Supabase if connected
  useEffect(() => {
    let cancelled = false;
    async function tryLoadSupabase() {
      try {
        const supabase = createClient();
        const { data: gData, error: gErr } = await withTimeout(
          supabase.from("gigs").select("*"),
          "Supabase gigs"
        );
        if (!cancelled && !gErr && gData && gData.length > 0) {
          // If Supabase has data, merge or keep
        }
      } catch {
        // Fallback to local state smoothly
      }
    }
    tryLoadSupabase();
    return () => {
      cancelled = true;
    };
  }, []);

  const allGigs = gigs;

  /* ---------- Getters ---------- */
  const getGig = (id) => gigs.find((g) => g.id === id) ?? null;
  const getProfile = (id) => {
    const f = freelancers.find((item) => item.id === id);
    if (f) return f;
    return { id, name: id === "c1" ? "Apex Cloud Labs" : "Enterprise Client", role: "client" };
  };
  const getFreelancer = (id) => freelancers.find((f) => f.id === id) ?? freelancers[0];
  const getOrder = (id) => orders.find((o) => o.id === id || o.code === id || o.id === `#${id}`) ?? null;
  const getOrderGig = (order) => (order ? getGig(order.gigId) || { title: order.title, price: order.price, deliveryDays: 3, revisions: 4 } : null);
  const getFreelancerGigs = (freelancerId) => gigs.filter((g) => g.freelancerId === freelancerId);

  const getGigReviews = (gigId) => reviews.filter((r) => r.gigId === gigId);
  const getFreelancerReviews = (freelancerId) => reviews.filter((r) => r.freelancerId === freelancerId);
  const getOrderReview = (orderId) => reviews.find((r) => r.orderId === orderId) ?? null;

  const ratingOf = (list) => {
    if (!list || list.length === 0) return { average: 5.0, count: 0 };
    return { average: averageRating(list), count: list.length };
  };
  const getGigRating = (gigId) => {
    const r = reviews.filter((item) => item.gigId === gigId);
    if (r.length > 0) return ratingOf(r);
    const gig = getGig(gigId);
    return { average: gig?.rating || 4.9, count: gig?.reviewsCount || 248 };
  };
  const getFreelancerRating = (freelancerId) => {
    const r = reviews.filter((item) => item.freelancerId === freelancerId);
    if (r.length > 0) return ratingOf(r);
    const f = getFreelancer(freelancerId);
    return { average: f?.rating || 4.9, count: f?.reviewsCount || 248 };
  };

  /* ---------- Gigs Mutations ---------- */
  async function addGig(data) {
    if (!user) return fail("Please log in first.");
    const newGig = {
      id: "g" + (gigs.length + 1),
      freelancerId: user.id || "f1",
      title: data.title,
      description: data.description,
      category: data.category,
      price: Number(data.price),
      deliveryDays: Number(data.deliveryDays),
      revisions: Number(data.revisions),
      image: data.image || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
      skills: data.skills || [],
      tags: data.tags ?? [],
      tier: "PRO VERIFIED",
      deliveryBadge: `⚡ ${data.deliveryDays}-DAY DELIVERY`,
      createdAt: new Date().toISOString(),
    };
    setGigs((prev) => [newGig, ...prev]);
    return ok({ gig: newGig });
  }

  async function updateGig(id, changes) {
    setGigs((prev) => prev.map((g) => (g.id === id ? { ...g, ...changes } : g)));
    return ok();
  }

  async function deleteGig(id) {
    setGigs((prev) => prev.filter((g) => g.id !== id));
    return ok();
  }

  /* ---------- Orders Mutations ---------- */
  async function createOrder({ gigId, requirements, packageTier = "standard" }) {
    if (!user) return fail("Please log in first.");
    const targetGig = getGig(gigId);
    const orderNum = `GC-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: orderNum,
      code: `#${orderNum}`,
      gigId: gigId,
      clientId: user.id,
      clientName: user.name || "Apex Cloud Labs",
      clientBadge: "Verified Payment Method",
      freelancerId: targetGig?.freelancerId || "f1",
      freelancerName: targetGig ? getFreelancer(targetGig.freelancerId)?.name : "Ananya Sharma",
      freelancerBadge: "Top Rated Plus (100%)",
      freelancerAvatar: targetGig ? getFreelancer(targetGig.freelancerId)?.avatar : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      title: targetGig?.title || "SaaS UI Milestone Contract",
      description: requirements,
      price: targetGig?.price || 280,
      vaultCommitment: `$${targetGig?.price || 280}.00 USD`,
      status: "active",
      subStatus: "in-progress",
      statusLabel: "IN PROGRESS",
      milestoneFlight: "MILESTONE 1 OF 3 IN FLIGHT",
      progress: 25,
      dueText: `Due in ${targetGig?.deliveryDays || 3} days`,
      initiatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      revisionsUsed: 0,
      revisionsTotal: targetGig?.revisions || 3,
      deliveryDays: targetGig?.deliveryDays || 3,
      timeline: [
        { status: "active", label: "Contract locked in escrow vault", date: new Date().toISOString() },
      ],
      milestones: [
        {
          step: 1,
          title: "STEP 1: ARCHITECTURE & SCOPE SPEC",
          desc: "Specifications and preliminary architecture review.",
          date: "IN FLIGHT",
          tag: "CURRENT SPRINT",
          current: true,
          amount: Math.round((targetGig?.price || 280) * 0.4),
        },
        {
          step: 2,
          title: "STEP 2: PRODUCTION ASSETS & TESTING",
          desc: "High-fidelity screens, tokens, and verified handoffs.",
          date: "PENDING",
          tag: "ESCROW",
          amount: Math.round((targetGig?.price || 280) * 0.6),
        },
      ],
      deliverables: [],
      messages: [
        {
          id: "m-init",
          isSystem: true,
          text: `SYSTEM: ESCROW VAULT SECURED ($${targetGig?.price || 280}.00). REPO DISBURSEMENT PROTOCOL ACTIVE.`,
          time: "Just now",
        },
      ],
      requirements,
    };

    setOrders((prev) => [newOrder, ...prev]);
    return ok({ order: newOrder });
  }

  async function deliverOrder(orderId, { deliveryLink = "", deliveryNote = "" } = {}) {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId || o.code === orderId) {
          const deliverableItem = {
            name: deliveryLink || "Production-Deliverables.zip",
            hash: "sha256-verified",
            size: "Live Artifact",
            action: "INSPECT SPEC",
            badge: "DELIVERED",
          };
          return {
            ...o,
            status: "delivered",
            subStatus: "under-review",
            statusLabel: "AWAITING REVIEW",
            deliveryLink,
            deliveryNote,
            deliverables: [...(o.deliverables || []), deliverableItem],
            timeline: [
              ...(o.timeline || []),
              { status: "delivered", label: "Deliverable package pushed for review", date: new Date().toISOString() },
            ],
            messages: [
              ...(o.messages || []),
              {
                id: "m-deliv-" + Date.now(),
                sender: o.freelancerName + " (SELLER)",
                role: "seller",
                time: "Just now",
                text: deliveryNote || `Work delivered! Access deliverables: ${deliveryLink}`,
              },
            ],
          };
        }
        return o;
      })
    );
    return ok();
  }

  async function requestRevision(orderId, note = "") {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId || o.code === orderId) {
          return {
            ...o,
            status: "active",
            subStatus: "in-progress",
            statusLabel: "IN PROGRESS",
            revisionsUsed: (o.revisionsUsed || 0) + 1,
            timeline: [
              ...(o.timeline || []),
              { status: "active", label: `Revision requested: ${note}`, date: new Date().toISOString() },
            ],
            messages: [
              ...(o.messages || []),
              {
                id: "m-rev-" + Date.now(),
                sender: o.clientName + " (BUYER)",
                role: "buyer",
                time: "Just now",
                text: `Revision requested: ${note}`,
              },
            ],
          };
        }
        return o;
      })
    );
    return ok();
  }

  async function completeOrder(orderId) {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId || o.code === orderId) {
          return {
            ...o,
            status: "completed",
            subStatus: "completed",
            statusLabel: "COMPLETED",
            progress: 100,
            milestoneFlight: "ALL MILESTONES SETTLED",
            timeline: [
              ...(o.timeline || []),
              { status: "completed", label: "Final milestone released & settled", date: new Date().toISOString() },
            ],
            messages: [
              ...(o.messages || []),
              {
                id: "m-comp-" + Date.now(),
                isSystem: true,
                text: `SYSTEM: FINAL MILESTONE FUNDS RELEASED FROM ESCROW TO ${o.freelancerName.toUpperCase()}`,
                time: "Just now",
              },
            ],
          };
        }
        return o;
      })
    );
    return ok();
  }

  async function cancelOrder(orderId) {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId || o.code === orderId) {
          return {
            ...o,
            status: "cancelled",
            subStatus: "cancelled",
            statusLabel: "CANCELLED",
            timeline: [
              ...(o.timeline || []),
              { status: "cancelled", label: "Contract cancelled & escrow refunded", date: new Date().toISOString() },
            ],
          };
        }
        return o;
      })
    );
    return ok();
  }

  async function sendOrderMessage(orderId, text) {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId || o.code === orderId) {
          const isSeller = user?.role === "freelancer";
          const newMsg = {
            id: "msg-" + Date.now(),
            sender: (user?.name || (isSeller ? o.freelancerName : o.clientName)) + (isSeller ? " (SELLER)" : " (BUYER)"),
            role: isSeller ? "seller" : "buyer",
            time: "Just now",
            text,
          };
          return {
            ...o,
            messages: [...(o.messages || []), newMsg],
          };
        }
        return o;
      })
    );
    return ok();
  }

  /* ---------- Reviews ---------- */
  async function addReview({ orderId, rating, comment }) {
    const targetOrder = getOrder(orderId);
    const newRev = {
      id: "rev-" + Date.now(),
      orderId,
      gigId: targetOrder?.gigId || "g1",
      freelancerId: targetOrder?.freelancerId || "f1",
      clientId: user?.id || "c1",
      clientName: user?.name || "Verified Client",
      clientRole: "Engineering Lead",
      clientBadge: "VERIFIED BUYER",
      rating: Number(rating),
      verifiedOrder: true,
      paidEscrow: targetOrder ? `₹${targetOrder.price?.toLocaleString("en-IN")}` : "₹24,000",
      completedDate: "Completed Just now",
      projectName: targetOrder?.title || "Engineering Contract",
      comment,
      reply: null,
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [newRev, ...prev]);
    return ok({ review: newRev });
  }

  async function updateFreelancerProfile(id, changes) {
    setFreelancers((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...changes } : f))
    );
    return ok();
  }

  const value = {
    allGigs,
    gigs,
    freelancers,
    orders,
    reviews,
    hydrated,
    getGig,
    getProfile,
    getFreelancer,
    getOrder,
    getOrderGig,
    getFreelancerGigs,
    getGigReviews,
    getFreelancerReviews,
    getOrderReview,
    getGigRating,
    getFreelancerRating,
    addGig,
    updateGig,
    deleteGig,
    createOrder,
    deliverOrder,
    requestRevision,
    completeOrder,
    cancelOrder,
    sendOrderMessage,
    addReview,
    updateFreelancerProfile,
  };

  return <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>;
}

export function useMarketplace() {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) throw new Error("useMarketplace must be used inside MarketplaceProvider");
  return ctx;
}
