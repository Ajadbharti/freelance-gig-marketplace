"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { initialsAvatar } from "@/lib/avatar";

const AuthContext = createContext(null);

function toUser(profile, authUser) {
  return {
    id: profile.id,
    name: profile.full_name,
    email: authUser?.email ?? "",
    role: profile.role,
    needsRole: profile.role_chosen === false,
    suspended: profile.suspended === true,
    avatar: profile.avatar_url || initialsAvatar(profile.full_name),
  };
}

function friendlyError(error) {
  const message = (error?.message || "").toLowerCase();
  if (message.includes("invalid login credentials")) return "Incorrect email or password.";
  if (message.includes("email not confirmed")) return "Please confirm your email first. Check your inbox for the link.";
  if (message.includes("already registered")) return "An account with this email already exists.";
  if (message.includes("rate limit") || message.includes("too many")) {
    return "Too many attempts. Please wait a while and try again.";
  }
  if (message.includes("not authorized")) {
    return "This project cannot send emails to this address yet. Turn off email confirmation or set up custom SMTP.";
  }
  if (message.includes("provider") && message.includes("enabled")) {
    return "This sign-in method is not enabled yet.";
  }
  return error?.message || "Something went wrong. Please try again.";
}

async function fetchProfile(supabase, userId) {
  const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  return data ?? null;
}

export function AuthProvider({ children }) {
  // undefined = abhi pata nahi, null = logged out, object = logged in
  const [session, setSession] = useState(undefined);
  const [profile, setProfile] = useState(null);
  const [loadedFor, setLoadedFor] = useState(null);

  useEffect(() => {
    const supabase = createClient();
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const userId = session?.user?.id ?? null;

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    fetchProfile(createClient(), userId)
      .then((row) => {
        if (cancelled) return;
        setProfile(row);
        setLoadedFor(userId);
      })
      .catch(() => {
        if (cancelled) return;
        setProfile(null);
        setLoadedFor(userId);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const hydrated = session !== undefined && (!userId || loadedFor === userId);
  const user = session?.user && profile && profile.id === session.user.id ? toUser(profile, session.user) : null;

  const login = useCallback(async (email, password) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: (email || "").trim().toLowerCase(),
      password,
    });
    if (error) return { ok: false, error: friendlyError(error) };

    const row = await fetchProfile(supabase, data.user.id);
    if (!row) return { ok: false, error: "Your profile could not be loaded. Please try again." };

    if (row.suspended) {
      await supabase.auth.signOut();
      return { ok: false, error: "Your account has been suspended. Please contact support." };
    }
    return { ok: true, user: toUser(row, data.user) };
  }, []);

  // Google ya GitHub se login. Browser provider ke page par chala jata hai.
  const loginWithProvider = useCallback(async (provider) => {
    const { error } = await createClient().auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) return { ok: false, error: friendlyError(error) };
    return { ok: true };
  }, []);

  const register = useCallback(async ({ name, email, password, role }) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: (email || "").trim().toLowerCase(),
      password,
      options: { data: { full_name: name.trim(), role } },
    });
    if (error) return { ok: false, error: friendlyError(error) };

    // Email pehle se registered ho to Supabase bina identities wala user lautata hai
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      return { ok: false, error: "An account with this email already exists." };
    }

    // Email confirmation on ho to abhi session nahi milta
    if (!data.session) return { ok: true, needsConfirmation: true };

    const row = await fetchProfile(supabase, data.user.id);
    if (!row) return { ok: false, error: "Your account was created but the profile could not be loaded." };
    return { ok: true, needsConfirmation: false, user: toUser(row, data.user) };
  }, []);

  // Google/GitHub se aaye naye user ka role (client ya freelancer) set karna
  const setRole = useCallback(
    async (role) => {
      const supabase = createClient();
      const { error } = await supabase.rpc("set_my_role", { p_role: role });
      if (error) return { ok: false, error: friendlyError(error) };

      const row = userId ? await fetchProfile(supabase, userId) : null;
      if (!row) return { ok: false, error: "Could not load your profile. Please refresh." };
      setProfile(row);
      return { ok: true, user: toUser(row, session?.user) };
    },
    [userId, session]
  );

  const logout = useCallback(async () => {
    await createClient().auth.signOut();
  }, []);

  const value = useMemo(
    () => ({ user, hydrated, login, loginWithProvider, register, setRole, logout }),
    [user, hydrated, login, loginWithProvider, register, setRole, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}