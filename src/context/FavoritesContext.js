"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";

const FavoritesContext = createContext(null);
const EMPTY = [];

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const [state, setState] = useState({ userId: null, ids: EMPTY });

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    createClient()
      .from("favorites")
      .select("gig_id")
      .eq("user_id", userId)
      .then(({ data, error }) => {
        if (cancelled) return;
        setState({ userId, ids: error ? EMPTY : (data ?? []).map((row) => row.gig_id) });
      })
      .catch(() => {
        if (!cancelled) setState({ userId, ids: EMPTY });
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const ids = userId && state.userId === userId ? state.ids : EMPTY;
  const loaded = !userId || state.userId === userId;

  const isSaved = (gigId) => ids.includes(gigId);

  async function toggle(gigId) {
    if (!userId) return { ok: false, error: "Please log in to save gigs." };

    const supabase = createClient();
    const wasSaved = ids.includes(gigId);
    const { error } = wasSaved
      ? await supabase.from("favorites").delete().eq("user_id", userId).eq("gig_id", gigId)
      : await supabase.from("favorites").insert({ user_id: userId, gig_id: gigId });

    if (error) return { ok: false, error: error.message || "Could not update your saved gigs." };

    setState((previous) => ({
      userId,
      ids: wasSaved ? previous.ids.filter((id) => id !== gigId) : [...previous.ids, gigId],
    }));
    return { ok: true, saved: !wasSaved };
  }

  const value = { ids, loaded, isSaved, toggle };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside FavoritesProvider");
  return ctx;
}