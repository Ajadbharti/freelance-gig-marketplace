"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { gigs as seedGigs } from "@/data/gigs";
import { freelancers as seedFreelancers } from "@/data/freelancers";
import { orders as seedOrders } from "@/data/orders";
import { reviews as seedReviews } from "@/data/reviews";
import { loadFromStorage, removeFromStorage, saveToStorage } from "@/lib/storage";
import { averageRating, generateId } from "@/lib/utils";

const MarketplaceContext = createContext(null);

const ALL_KEYS = ["gigs", "freelancers", "orders", "reviews", "auth:user", "auth:registered"];

const ok = (extra = {}) => ({ ok: true, ...extra });
const fail = (error) => ({ ok: false, error });
const newestFirst = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);

export function MarketplaceProvider({ children }) {
  const { user } = useAuth();

  const [gigs, setGigs] = useState(seedGigs);
  const [freelancers, setFreelancers] = useState(seedFreelancers);
  const [orders, setOrders] = useState(seedOrders);
  const [reviews, setReviews] = useState(seedReviews);
  const [hydrated, setHydrated] = useState(false);

  // Pehle seed data se render hota hai, phir LocalStorage ka data load hota hai
  useEffect(() => {
    setGigs(loadFromStorage("gigs", seedGigs));
    setFreelancers(loadFromStorage("freelancers", seedFreelancers));
    setOrders(loadFromStorage("orders", seedOrders));
    setReviews(loadFromStorage("reviews", seedReviews));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveToStorage("gigs", gigs);
  }, [gigs, hydrated]);
  useEffect(() => {
    if (hydrated) saveToStorage("freelancers", freelancers);
  }, [freelancers, hydrated]);
  useEffect(() => {
    if (hydrated) saveToStorage("orders", orders);
  }, [orders, hydrated]);
  useEffect(() => {
    if (hydrated) saveToStorage("reviews", reviews);
  }, [reviews, hydrated]);

  /* ---------- Getters ---------- */

  const getGig = useCallback((id) => gigs.find((g) => g.id === id) ?? null, [gigs]);
  const getFreelancer = useCallback((id) => freelancers.find((f) => f.id === id) ?? null, [freelancers]);
  const getOrder = useCallback((id) => orders.find((o) => o.id === id) ?? null, [orders]);

  // Gig delete ho gaya ho to order ke andar saved snapshot use hota hai
  const getOrderGig = useCallback(
    (order) => {
      if (!order) return null;
      return gigs.find((g) => g.id === order.gigId) ?? order.gigSnapshot ?? null;
    },
    [gigs]
  );

  const getFreelancerGigs = useCallback(
    (freelancerId) => gigs.filter((g) => g.freelancerId === freelancerId),
    [gigs]
  );

  const getGigReviews = useCallback(
    (gigId) => reviews.filter((r) => r.gigId === gigId).sort(newestFirst),
    [reviews]
  );
  const getFreelancerReviews = useCallback(
    (freelancerId) => reviews.filter((r) => r.freelancerId === freelancerId).sort(newestFirst),
    [reviews]
  );
  const getOrderReview = useCallback(
    (orderId) => reviews.find((r) => r.orderId === orderId) ?? null,
    [reviews]
  );

  const getGigRating = useCallback(
    (gigId) => {
      const list = reviews.filter((r) => r.gigId === gigId);
      return { average: averageRating(list), count: list.length };
    },
    [reviews]
  );
  const getFreelancerRating = useCallback(
    (freelancerId) => {
      const list = reviews.filter((r) => r.freelancerId === freelancerId);
      return { average: averageRating(list), count: list.length };
    },
    [reviews]
  );

  /* ---------- Helpers ---------- */

  const requireRole = useCallback(
    (role) => {
      if (!user) return "Please log in first.";
      if (user.role !== role) return `Only ${role}s can do this.`;
      return null;
    },
    [user]
  );

  const applyOrderChange = useCallback((orderId, status, label, extra = {}) => {
    const date = new Date().toISOString();
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, ...extra, status, timeline: [...o.timeline, { status, label, date }] }
          : o
      )
    );
  }, []);

  /* ---------- Gigs ---------- */

  const addGig = useCallback(
    (data) => {
      const roleError = requireRole("freelancer");
      if (roleError) return fail(roleError);
      const gig = {
        ...data,
        id: generateId("g"),
        freelancerId: user.id,
        createdAt: new Date().toISOString(),
      };
      setGigs((prev) => [gig, ...prev]);
      return ok({ gig });
    },
    [requireRole, user]
  );

  const updateGig = useCallback(
    (id, changes) => {
      const gig = gigs.find((g) => g.id === id);
      if (!gig) return fail("Gig not found.");
      if (!user || gig.freelancerId !== user.id) return fail("You can only edit your own gigs.");
      setGigs((prev) =>
        prev.map((g) => (g.id === id ? { ...g, ...changes, id: g.id, freelancerId: g.freelancerId } : g))
      );
      return ok();
    },
    [gigs, user]
  );

  const deleteGig = useCallback(
    (id) => {
      const gig = gigs.find((g) => g.id === id);
      if (!gig) return fail("Gig not found.");
      if (!user || gig.freelancerId !== user.id) return fail("You can only delete your own gigs.");
      setGigs((prev) => prev.filter((g) => g.id !== id));
      return ok();
    },
    [gigs, user]
  );

  /* ---------- Orders ---------- */

  const createOrder = useCallback(
    ({ gigId, requirements }) => {
      const roleError = requireRole("client");
      if (roleError) return fail(roleError);
      const gig = gigs.find((g) => g.id === gigId);
      if (!gig) return fail("This gig no longer exists.");
      if (!requirements || requirements.trim().length < 10) {
        return fail("Please describe your requirements (at least 10 characters).");
      }
      const date = new Date().toISOString();
      const order = {
        id: generateId("o"),
        gigId: gig.id,
        clientId: user.id,
        freelancerId: gig.freelancerId,
        price: gig.price,
        status: "active",
        requirements: requirements.trim(),
        deliveryLink: "",
        deliveryNote: "",
        revisionsUsed: 0,
        createdAt: date,
        gigSnapshot: {
          title: gig.title,
          image: gig.image,
          deliveryDays: gig.deliveryDays,
          revisions: gig.revisions,
        },
        timeline: [{ status: "active", label: "Order placed", date }],
      };
      setOrders((prev) => [order, ...prev]);
      return ok({ order });
    },
    [gigs, requireRole, user]
  );

  const deliverOrder = useCallback(
    (orderId, { deliveryLink = "", deliveryNote = "" } = {}) => {
      const order = orders.find((o) => o.id === orderId);
      if (!order) return fail("Order not found.");
      if (!user || user.role !== "freelancer" || user.id !== order.freelancerId) {
        return fail("Only the freelancer of this order can deliver it.");
      }
      if (order.status !== "active") return fail("Only active orders can be delivered.");
      if (!deliveryLink.trim() && !deliveryNote.trim()) {
        return fail("Add a delivery link or a note.");
      }
      applyOrderChange(orderId, "delivered", "Work delivered", {
        deliveryLink: deliveryLink.trim(),
        deliveryNote: deliveryNote.trim(),
      });
      return ok();
    },
    [orders, user, applyOrderChange]
  );

  const requestRevision = useCallback(
    (orderId, note = "") => {
      const order = orders.find((o) => o.id === orderId);
      if (!order) return fail("Order not found.");
      if (!user || user.role !== "client" || user.id !== order.clientId) {
        return fail("Only the client of this order can request a revision.");
      }
      if (order.status !== "delivered") return fail("Revisions can only be requested after delivery.");
      const limit = gigs.find((g) => g.id === order.gigId)?.revisions ?? order.gigSnapshot?.revisions ?? 0;
      if (order.revisionsUsed >= limit) return fail("No revisions left for this order.");
      applyOrderChange(
        orderId,
        "active",
        note.trim() ? `Revision requested: ${note.trim()}` : "Revision requested",
        { revisionsUsed: order.revisionsUsed + 1 }
      );
      return ok();
    },
    [orders, gigs, user, applyOrderChange]
  );

  const completeOrder = useCallback(
    (orderId) => {
      const order = orders.find((o) => o.id === orderId);
      if (!order) return fail("Order not found.");
      if (!user || user.role !== "client" || user.id !== order.clientId) {
        return fail("Only the client of this order can complete it.");
      }
      if (order.status !== "delivered") return fail("Only delivered orders can be completed.");
      applyOrderChange(orderId, "completed", "Order completed");
      return ok();
    },
    [orders, user, applyOrderChange]
  );

  const cancelOrder = useCallback(
    (orderId) => {
      const order = orders.find((o) => o.id === orderId);
      if (!order) return fail("Order not found.");
      if (!user || (user.id !== order.clientId && user.id !== order.freelancerId)) {
        return fail("You are not part of this order.");
      }
      if (order.status !== "active") return fail("Only active orders can be cancelled.");
      applyOrderChange(orderId, "cancelled", "Order cancelled");
      return ok();
    },
    [orders, user, applyOrderChange]
  );

  /* ---------- Reviews ---------- */

  const addReview = useCallback(
    ({ orderId, rating, comment }) => {
      const order = orders.find((o) => o.id === orderId);
      if (!order) return fail("Order not found.");
      if (!user || user.role !== "client" || user.id !== order.clientId) {
        return fail("Only the client of this order can leave a review.");
      }
      if (order.status !== "completed") return fail("You can review only completed orders.");
      if (reviews.some((r) => r.orderId === orderId)) return fail("You already reviewed this order.");
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) return fail("Please select a rating from 1 to 5.");
      if (!comment || !comment.trim()) return fail("Please write a short review.");

      const review = {
        id: generateId("r"),
        orderId,
        gigId: order.gigId,
        freelancerId: order.freelancerId,
        clientId: user.id,
        clientName: user.name,
        rating,
        comment: comment.trim(),
        createdAt: new Date().toISOString(),
      };
      setReviews((prev) => [review, ...prev]);
      return ok({ review });
    },
    [orders, reviews, user]
  );

  /* ---------- Freelancer profiles ---------- */

  // Register ke baad naye freelancer ka profile banane ke liye (Phase 5 mein use hoga)
  const createFreelancerProfile = useCallback((newUser) => {
    const profile = {
      id: newUser.id,
      name: newUser.name,
      headline: "New freelancer on GigNest",
      bio: "",
      avatar: newUser.avatar,
      location: "",
      skills: [],
      languages: ["English"],
      experience: 0,
      startingPrice: 0,
      completedOrders: 0,
      joinedAt: new Date().toISOString(),
      portfolio: [],
    };
    setFreelancers((prev) => (prev.some((f) => f.id === newUser.id) ? prev : [...prev, profile]));
  }, []);

  const updateFreelancerProfile = useCallback(
    (id, changes) => {
      if (!user || user.id !== id) return fail("You can only edit your own profile.");
      setFreelancers((prev) => prev.map((f) => (f.id === id ? { ...f, ...changes, id: f.id } : f)));
      return ok();
    },
    [user]
  );

  /* ---------- Reset ---------- */

  const resetDemoData = useCallback(() => {
    ALL_KEYS.forEach((key) => removeFromStorage(key));
    window.location.reload();
  }, []);

  const value = useMemo(
    () => ({
      gigs,
      freelancers,
      orders,
      reviews,
      hydrated,
      getGig,
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
      addReview,
      createFreelancerProfile,
      updateFreelancerProfile,
      resetDemoData,
    }),
    [
      gigs, freelancers, orders, reviews, hydrated,
      getGig, getFreelancer, getOrder, getOrderGig, getFreelancerGigs,
      getGigReviews, getFreelancerReviews, getOrderReview, getGigRating, getFreelancerRating,
      addGig, updateGig, deleteGig, createOrder, deliverOrder, requestRevision,
      completeOrder, cancelOrder, addReview, createFreelancerProfile,
      updateFreelancerProfile, resetDemoData,
    ]
  );

  return <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>;
}

export function useMarketplace() {
  const ctx = useContext(MarketplaceContext);
  if (!ctx) throw new Error("useMarketplace must be used inside MarketplaceProvider");
  return ctx;
}