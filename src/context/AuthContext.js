"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("gigcraft_in:user");
      if (saved) {
        setUser(JSON.parse(saved));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
    setHydrated(true);
  }, []);

  const login = useCallback(async (email, password) => {
    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail) {
      return { ok: false, error: "Please enter your corporate email." };
    }
    if (!password) {
      return { ok: false, error: "Please enter your access key / password." };
    }

    // Check registered accounts in storage
    let registeredUsers = [];
    try {
      const raw = localStorage.getItem("gigcraft_in:registered_users");
      if (raw) registeredUsers = JSON.parse(raw);
    } catch {}

    const found = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (found) {
      if (found.password && found.password !== password) {
        return { ok: false, error: "Invalid password for this account." };
      }
      const sessionUser = {
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role,
        avatar: found.avatar,
        joinedAt: found.joinedAt,
      };
      setUser(sessionUser);
      try {
        localStorage.setItem("gigcraft_in:user", JSON.stringify(sessionUser));
      } catch {}
      return { ok: true, user: sessionUser };
    }

    return {
      ok: false,
      error: "No account found with this email. Please register as a Client or apply as a Freelancer.",
    };
  }, []);

  const loginWithProvider = useCallback(async (provider) => {
    try {
      const supabase = createClient();
      const redirectUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : undefined;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        return {
          ok: false,
          error: `${provider === "github" ? "GitHub" : "Google"} OAuth is not configured in Supabase. Please sign in or register with your work email below.`,
        };
      }

      if (data?.url) {
        window.location.href = data.url;
        return { ok: true, redirecting: true };
      }

      return {
        ok: false,
        error: `${provider === "github" ? "GitHub" : "Google"} authentication provider is not available. Please sign in with your work email.`,
      };
    } catch (err) {
      return {
        ok: false,
        error: `${provider === "github" ? "GitHub" : "Google"} login is not enabled in this environment. Please sign in with your corporate email.`,
      };
    }
  }, []);

  const register = useCallback(async ({ name, email, password, role }) => {
    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail) {
      return { ok: false, error: "Email is required." };
    }
    if (!password || password.length < 6) {
      return { ok: false, error: "Password must be at least 6 characters." };
    }

    let registeredUsers = [];
    try {
      const raw = localStorage.getItem("gigcraft_in:registered_users");
      if (raw) registeredUsers = JSON.parse(raw);
    } catch {}

    const existing = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { ok: false, error: "An account with this email already exists. Please log in." };
    }

    const trimmedName = (name || cleanEmail.split("@")[0]).trim();
    const newUser = {
      id: "usr-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: trimmedName,
      email: cleanEmail,
      password: password,
      role: role || "client",
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(trimmedName)}&backgroundColor=047857,0f172a`,
      joinedAt: new Date().toISOString(),
    };

    registeredUsers.push(newUser);
    try {
      localStorage.setItem("gigcraft_in:registered_users", JSON.stringify(registeredUsers));
    } catch {}

    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.avatar,
      joinedAt: newUser.joinedAt,
    };

    setUser(sessionUser);
    try {
      localStorage.setItem("gigcraft_in:user", JSON.stringify(sessionUser));
    } catch {}

    return { ok: true, user: sessionUser };
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    try {
      localStorage.removeItem("gigcraft_in:user");
    } catch {}
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {}
  }, []);

  const switchRole = useCallback((newRole) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, role: newRole };
      try {
        localStorage.setItem("gigcraft_in:user", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const value = useMemo(
    () => ({ user, hydrated, login, loginWithProvider, register, logout, switchRole }),
    [user, hydrated, login, loginWithProvider, register, logout, switchRole]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
