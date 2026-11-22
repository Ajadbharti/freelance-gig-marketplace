"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const AuthContext = createContext(null);

const DEMO_CLIENT = {
  id: "c-raj",
  name: "Raj Patel",
  email: "rajpatel123@gmail.com",
  role: "client",
  avatar: "",
  initials: "RP",
  joinedAt: "2024-01-01T00:00:00.000Z",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("gigcraft_in:user");
      if (saved) {
        setUser(JSON.parse(saved));
      } else {
        // Pre-seed demo client Raj Patel if no user is set
        setUser(DEMO_CLIENT);
        localStorage.setItem("gigcraft_in:user", JSON.stringify(DEMO_CLIENT));
      }
    } catch {
      setUser(DEMO_CLIENT);
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

    // Direct check for demo client
    if (cleanEmail === "rajpatel123@gmail.com" || cleanEmail.includes("rajpatel")) {
      setUser(DEMO_CLIENT);
      try {
        localStorage.setItem("gigcraft_in:user", JSON.stringify(DEMO_CLIENT));
      } catch {}
      return { ok: true, user: DEMO_CLIENT };
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
        initials: found.initials || found.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "RP",
        joinedAt: found.joinedAt,
      };
      setUser(sessionUser);
      try {
        localStorage.setItem("gigcraft_in:user", JSON.stringify(sessionUser));
      } catch {}
      return { ok: true, user: sessionUser };
    }

    // Allow quick login with developer@agency.io for testing
    if (cleanEmail === "developer@agency.io") {
      const demoFreelancer = {
        id: "f-elena",
        name: "Elena Rostova",
        email: "developer@agency.io",
        role: "freelancer",
        avatar: "",
        initials: "ER",
        joinedAt: "2024-01-01T00:00:00.000Z",
      };
      setUser(demoFreelancer);
      try {
        localStorage.setItem("gigcraft_in:user", JSON.stringify(demoFreelancer));
      } catch {}
      return { ok: true, user: demoFreelancer };
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
    } catch {
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
    const initials = trimmedName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const newUser = {
      id: "usr-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: trimmedName,
      email: cleanEmail,
      password: password,
      role: role || "client",
      avatar: "",
      initials: initials || (role === "freelancer" ? "FL" : "CL"),
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
      initials: newUser.initials,
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
