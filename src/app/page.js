"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useToast } from "@/components/ui/ToastProvider";
import RatingStars from "@/components/ui/RatingStars";
import PriceDisplay from "@/components/ui/PriceDisplay";
import Modal from "@/components/ui/Modal";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

export default function Home() {
  const { user, login, logout } = useAuth();
  const { gigs, orders, reviews, hydrated, getGigRating } = useMarketplace();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(3);

  function handleLogin() {
    const result = login("rohan@demo.com", "demo123");
    showToast(result.ok ? "Logged in as Rohan (demo)" : result.error, result.ok ? "success" : "error");
  }

  if (!hydrated) {
    return (
      <div className="p-6">
        <LoadingSkeleton className="h-8 w-64" />
      </div>
    );
  }

  const g1 = getGigRating("g1");

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-bold text-slate-900">Phase 2 test page</h1>

      <p>
        Logged in user: <strong>{user ? `${user.name} (${user.role})` : "nobody"}</strong>
      </p>

      <div className="flex flex-wrap gap-3">
        <button onClick={handleLogin} className="rounded-lg bg-indigo-600 px-4 py-2 text-white">
          Login as Rohan
        </button>
        <button
          onClick={() => {
            logout();
            showToast("Logged out", "info");
          }}
          className="rounded-lg border border-slate-300 px-4 py-2"
        >
          Logout
        </button>
        <button onClick={() => setOpen(true)} className="rounded-lg border border-slate-300 px-4 py-2">
          Open modal
        </button>
      </div>

      <p>
        Gigs: {gigs.length} | Orders: {orders.length} | Reviews: {reviews.length}
      </p>

      <div className="space-y-2">
        <p>Gig g1 rating (expected 4.5 with 2 reviews):</p>
        <RatingStars rating={g1.average} count={g1.count} showNumber />
        <PriceDisplay price={250} />
      </div>

      <div className="space-y-2">
        <p>Click the stars (selected: {rating}):</p>
        <RatingStars rating={rating} onChange={setRating} size={26} />
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Test modal">
        <p className="text-slate-700">Modal sahi kaam kar raha hai. Esc dabao ya bahar click karo.</p>
      </Modal>
    </main>
  );
}