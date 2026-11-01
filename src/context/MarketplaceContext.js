"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { initialsAvatar } from "@/lib/avatar";
import { averageRating } from "@/lib/utils";

const MarketplaceContext = createContext(null);

const EMPTY = [];
const ok = (extra = {}) => ({ ok: true, ...extra });
const fail = (error) => ({ ok: false, error });

function dbError(error) {
  if (!error) return "Something went wrong. Please try again.";
  if (error.code === "23514") return "Some values are outside the allowed limits. Please check the form.";
  if (error.code === "42501") return "You are not allowed to do this.";
  return error.message || "Something went wrong. Please try again.";
}

/* ---------- Database row -> shape used by the screens ---------- */

function mapGig(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    freelancerId: row.freelancer_id,
    price: row.price,
    deliveryDays: row.delivery_days,
    revisions: row.revisions,
    image: row.image_url,
    skills: row.skills ?? [],
    tags: row.tags ?? [],
    createdAt: row.created_at,
  };
}

function mapProfile(row) {
  return {
    id: row.id,
    role: row.role,
    name: row.full_name,
    headline: row.headline ?? "",
    bio: row.bio ?? "",
    avatar: row.avatar_url || initialsAvatar(row.full_name),
    location: row.location ?? "",
    skills: row.skills ?? [],
    languages: row.languages ?? [],
    experience: row.experience_years ?? 0,
    startingPrice: row.starting_price ?? 0,
    completedOrders: row.completed_orders ?? 0,
    joinedAt: row.created_at,
    portfolio: (row.portfolio_items ?? []).map((item) => ({
      id: item.id,
      title: item.title,
      image: item.image_url,
    })),
  };
}

function mapOrder(row) {
  const events = [...(row.order_events ?? [])].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at) || a.id - b.id
  );
  return {
    id: row.id,
    gigId: row.gig_id,
    clientId: row.client_id,
    freelancerId: row.freelancer_id,
    price: row.price,
    status: row.status,
    requirements: row.requirements,
    deliveryLink: row.delivery_link ?? "",
    deliveryNote: row.delivery_note ?? "",
    revisionsUsed: row.revisions_used ?? 0,
    createdAt: row.created_at,
    gigSnapshot: {
      title: row.gig_title,
      image: row.gig_image,
      deliveryDays: row.gig_delivery_days,
      revisions: row.gig_revisions,
    },
    timeline: events.map((e) => ({ status: e.status, label: e.label, date: e.created_at })),
  };
}

function mapReview(row, nameById) {
  return {
    id: row.id,
    orderId: row.order_id,
    gigId: row.gig_id,
    freelancerId: row.freelancer_id,
    clientId: row.client_id,
    clientName: nameById.get(row.client_id) ?? "Client",
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at,
  };
}

/* ---------- Loading from Supabase ---------- */

async function fetchPublicData() {
  const supabase = createClient();
  const [gigsRes, profilesRes, reviewsRes] = await Promise.all([
    supabase.from("gigs").select("*").order("created_at", { ascending: false }),
    supabase.from("profiles").select("*, portfolio_items(*)"),
    supabase.from("reviews").select("*").order("created_at", { ascending: false }),
  ]);
  const firstError = gigsRes.error || profilesRes.error || reviewsRes.error;
  if (firstError) console.error("Could not load marketplace data:", firstError);
  return {
    gigs: (gigsRes.data ?? []).map(mapGig),
    profiles: (profilesRes.data ?? []).map(mapProfile),
    reviews: reviewsRes.data ?? [],
  };
}

async function fetchOrders() {
  const { data, error } = await createClient()
    .from("orders")
    .select("*, order_events(*)")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("Could not load orders:", error);
    return [];
  }
  return (data ?? []).map(mapOrder);
}

async function callRpc(name, args) {
  const { data, error } = await createClient().rpc(name, args);
  if (error) return fail(dbError(error));
  return ok({ data });
}

const GIG_COLUMNS = {
  title: "title",
  description: "description",
  category: "category",
  price: "price",
  deliveryDays: "delivery_days",
  revisions: "revisions",
  skills: "skills",
  tags: "tags",
};

export function MarketplaceProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [publicData, setPublicData] = useState(null);
  const [ordersState, setOrdersState] = useState({ userId: null, list: EMPTY });

  // Public data: gigs, profiles, reviews (sabko dikhta hai)
  useEffect(() => {
    let cancelled = false;
    fetchPublicData().then((data) => {
      if (!cancelled) setPublicData(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Orders: sirf logged-in user ke apne orders
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    fetchOrders().then((list) => {
      if (!cancelled) setOrdersState({ userId, list });
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const gigs = publicData ? publicData.gigs : EMPTY;
  const profiles = publicData ? publicData.profiles : EMPTY;
  const freelancers = profiles.filter((p) => p.role === "freelancer");
  const nameById = new Map(profiles.map((p) => [p.id, p.name]));
  const reviews = publicData ? publicData.reviews.map((r) => mapReview(r, nameById)) : EMPTY;
  const orders = userId && ordersState.userId === userId ? ordersState.list : EMPTY;
  const hydrated = publicData !== null && (!userId || ordersState.userId === userId);

  async function refreshPublic() {
    setPublicData(await fetchPublicData());
  }

  async function refreshOrders() {
    if (!userId) return;
    setOrdersState({ userId, list: await fetchOrders() });
  }

  /* ---------- Getters ---------- */

  const getGig = (id) => gigs.find((g) => g.id === id) ?? null;
  const getProfile = (id) => profiles.find((p) => p.id === id) ?? null;
  const getFreelancer = (id) => freelancers.find((f) => f.id === id) ?? null;
  const getOrder = (id) => orders.find((o) => o.id === id) ?? null;
  // Order ke waqt ki shartein (title, image, delivery days, revisions)
  const getOrderGig = (order) => (order ? order.gigSnapshot : null);
  const getFreelancerGigs = (freelancerId) => gigs.filter((g) => g.freelancerId === freelancerId);

  const getGigReviews = (gigId) => reviews.filter((r) => r.gigId === gigId);
  const getFreelancerReviews = (freelancerId) => reviews.filter((r) => r.freelancerId === freelancerId);
  const getOrderReview = (orderId) => reviews.find((r) => r.orderId === orderId) ?? null;

  const ratingOf = (list) => ({ average: averageRating(list), count: list.length });
  const getGigRating = (gigId) => ratingOf(reviews.filter((r) => r.gigId === gigId));
  const getFreelancerRating = (freelancerId) =>
    ratingOf(reviews.filter((r) => r.freelancerId === freelancerId));

  /* ---------- Gigs ---------- */

  async function addGig(data) {
    if (!user) return fail("Please log in first.");
    if (user.role !== "freelancer") return fail("Only freelancers can create gigs.");
    const { data: row, error } = await createClient()
      .from("gigs")
      .insert({
        freelancer_id: user.id,
        title: data.title,
        description: data.description,
        category: data.category,
        price: data.price,
        delivery_days: data.deliveryDays,
        revisions: data.revisions,
        image_url: data.image || null,
        skills: data.skills,
        tags: data.tags ?? [],
      })
      .select()
      .single();
    if (error) return fail(dbError(error));
    await refreshPublic();
    return ok({ gig: mapGig(row) });
  }

  async function updateGig(id, changes) {
    if (!user) return fail("Please log in first.");
    const payload = {};
    Object.entries(GIG_COLUMNS).forEach(([key, column]) => {
      if (key in changes) payload[column] = changes[key];
    });
    if ("image" in changes) payload.image_url = changes.image || null;

    const { data, error } = await createClient().from("gigs").update(payload).eq("id", id).select("id");
    if (error) return fail(dbError(error));
    if (!data || data.length === 0) return fail("You can only edit your own gigs.");
    await refreshPublic();
    return ok();
  }

  async function deleteGig(id) {
    if (!user) return fail("Please log in first.");
    const { data, error } = await createClient().from("gigs").delete().eq("id", id).select("id");
    if (error) return fail(dbError(error));
    if (!data || data.length === 0) return fail("You can only delete your own gigs.");
    await refreshPublic();
    return ok();
  }

  /* ---------- Orders (rules database ke functions mein hain) ---------- */

  async function createOrder({ gigId, requirements }) {
    if (!user) return fail("Please log in first.");
    const result = await callRpc("create_order", { p_gig_id: gigId, p_requirements: requirements });
    if (!result.ok) return result;
    await refreshOrders();
    return ok({ order: { id: result.data } });
  }

  async function deliverOrder(orderId, { deliveryLink = "", deliveryNote = "" } = {}) {
    const result = await callRpc("deliver_order", {
      p_order_id: orderId,
      p_link: deliveryLink,
      p_note: deliveryNote,
    });
    if (!result.ok) return result;
    await refreshOrders();
    return ok();
  }

  async function requestRevision(orderId, note = "") {
    const result = await callRpc("request_revision", { p_order_id: orderId, p_note: note });
    if (!result.ok) return result;
    await refreshOrders();
    return ok();
  }

  async function completeOrder(orderId) {
    const result = await callRpc("complete_order", { p_order_id: orderId });
    if (!result.ok) return result;
    await Promise.all([refreshOrders(), refreshPublic()]);
    return ok();
  }

  async function cancelOrder(orderId) {
    const result = await callRpc("cancel_order", { p_order_id: orderId });
    if (!result.ok) return result;
    await refreshOrders();
    return ok();
  }

  /* ---------- Reviews ---------- */

  async function addReview({ orderId, rating, comment }) {
    const result = await callRpc("add_review", {
      p_order_id: orderId,
      p_rating: rating,
      p_comment: comment,
    });
    if (!result.ok) return result;
    await refreshPublic();
    return ok({ review: { id: result.data } });
  }

  /* ---------- Freelancer profile ---------- */

  async function updateFreelancerProfile(id, changes) {
    if (!user || user.id !== id) return fail("You can only edit your own profile.");
    const payload = {};
    if ("headline" in changes) payload.headline = changes.headline;
    if ("bio" in changes) payload.bio = changes.bio;
    if ("location" in changes) payload.location = changes.location;
    if ("skills" in changes) payload.skills = changes.skills;
    if ("languages" in changes) payload.languages = changes.languages;
    if ("experience" in changes) payload.experience_years = changes.experience;
    if ("startingPrice" in changes) payload.starting_price = changes.startingPrice;
    if (typeof changes.avatar === "string" && /^https?:\/\//i.test(changes.avatar)) {
      payload.avatar_url = changes.avatar;
    }

    const { data, error } = await createClient().from("profiles").update(payload).eq("id", id).select("id");
    if (error) return fail(dbError(error));
    if (!data || data.length === 0) return fail("You can only edit your own profile.");
    await refreshPublic();
    return ok();
  }

  const value = {
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