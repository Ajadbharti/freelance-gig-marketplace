"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { signInWithGooglePopup, signOutFromFirebase } from "@/lib/firebase/auth";

const AuthContext = createContext(null);

function mapSupabaseUser(sbUser, defaultRole = "client") {
  const meta = sbUser?.user_metadata || {};
  const fullName =
    meta.full_name || meta.name || meta.user_name || sbUser?.email?.split("@")[0] || "Google User";
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "GU";

  let role = defaultRole;
  if (typeof window !== "undefined") {
    const savedRole = localStorage.getItem("gigcraft_in:selected_role");
    if (savedRole) {
      role = savedRole;
    }
  }

  return {
    id: sbUser.id,
    name: fullName,
    email: sbUser.email,
    role: meta.role || role || "client",
    avatar: meta.avatar_url || meta.picture || "",
    initials: initials,
    joinedAt: sbUser.created_at || new Date().toISOString(),
    isGoogleUser: true,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let subscription = null;

    async function initAuth() {
      // 1. Check for backend HTTP-only session cookie
      try {
        const meRes = await fetch("/api/auth/me");
        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData?.ok && meData?.user) {
            setUser(meData.user);
            localStorage.setItem("gigcraft_in:user", JSON.stringify(meData.user));
            setHydrated(true);
            return;
          }
        }
      } catch {}

      // 2. Check for active Supabase session
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const mapped = mapSupabaseUser(session.user);
          setUser(mapped);
          localStorage.setItem("gigcraft_in:user", JSON.stringify(mapped));
          setHydrated(true);
          return;
        }
      } catch (e) {
        console.error("Supabase getSession error:", e);
      }

      // 2. Fallback to localStorage
      try {
        const saved = localStorage.getItem("gigcraft_in:user");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.id !== "c-raj" && parsed.id !== "f-elena") {
            setUser(parsed);
          } else {
            setUser(null);
            localStorage.removeItem("gigcraft_in:user");
          }
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
      setHydrated(true);

      // 3. Listen to Supabase auth events (e.g. Google OAuth sign-in)
      try {
        const supabase = createClient();
        const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (session?.user) {
            const mapped = mapSupabaseUser(session.user);
            setUser(mapped);
            localStorage.setItem("gigcraft_in:user", JSON.stringify(mapped));
          } else if (event === "SIGNED_OUT") {
            setUser(null);
            localStorage.removeItem("gigcraft_in:user");
          }
        });
        subscription = data?.subscription;
      } catch (err) {
        console.error("Supabase onAuthStateChange error:", err);
      }
    }

    initAuth();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const setSessionUser = useCallback((newUser) => {
    setUser(newUser);
    if (typeof window !== "undefined" && newUser) {
      localStorage.setItem("gigcraft_in:user", JSON.stringify(newUser));
    }
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

    // 1. Check Root Administrator Credentials
    if (cleanEmail === "admin@gigcraft.io" && password === "AdminSecurePass2026!") {
      const adminUser = {
        id: "admin-root",
        name: "System Administrator",
        email: "admin@gigcraft.io",
        role: "admin",
        avatar: "",
        initials: "SA",
        joinedAt: new Date().toISOString(),
      };
      setUser(adminUser);
      try {
        localStorage.setItem("gigcraft_in:user", JSON.stringify(adminUser));
      } catch {}
      return { ok: true, user: adminUser };
    }

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

    return {
      ok: false,
      error: "No account found with this email. Please register or sign in with Google.",
    };
  }, []);

  const loginWithProvider = useCallback(async (provider, preferredRole = "client", forceRedirect = false) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("gigcraft_in:selected_role", preferredRole);
      }
      const supabase = createClient();
      const redirectUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : undefined;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) {
        return {
          ok: false,
          error: error.message || `${provider === "github" ? "GitHub" : "Google"} OAuth is not configured in Supabase.`,
          isConfigError: true,
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
        error: err.message || `${provider === "github" ? "GitHub" : "Google"} login is not enabled in this environment.`,
        isConfigError: true,
      };
    }
  }, []);

  const loginWithGoogleDemo = useCallback(async ({ name, email, role = "client" }) => {
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanName = (name || cleanEmail.split("@")[0] || "Google User").trim();
    const initials = cleanName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "GU";

    const sessionUser = {
      id: "usr-google-" + Date.now().toString(36),
      name: cleanName,
      email: cleanEmail || "google.user@gmail.com",
      role: role || "client",
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=047857,0f172a`,
      initials: initials,
      joinedAt: new Date().toISOString(),
      isGoogleUser: true,
    };

    setUser(sessionUser);
    try {
      localStorage.setItem("gigcraft_in:user", JSON.stringify(sessionUser));
      const raw = localStorage.getItem("gigcraft_in:registered_users");
      const list = raw ? JSON.parse(raw) : [];
      if (!list.some((u) => u.email === cleanEmail)) {
        list.push(sessionUser);
        localStorage.setItem("gigcraft_in:registered_users", JSON.stringify(list));
      }
    } catch {}

    return { ok: true, user: sessionUser };
  }, []);

  const loginWithGithubDemo = useCallback(async ({ name, email, role = "client" }) => {
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanName = (name || cleanEmail.split("@")[0] || "GitHub User").trim();
    const initials = cleanName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "GH";

    const sessionUser = {
      id: "usr-github-" + Date.now().toString(36),
      name: cleanName,
      email: cleanEmail || "github.user@agency.io",
      role: role || "client",
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=0047bf,0b1c30`,
      initials: initials,
      joinedAt: new Date().toISOString(),
      isGithubUser: true,
    };

    setUser(sessionUser);
    try {
      localStorage.setItem("gigcraft_in:user", JSON.stringify(sessionUser));
      const raw = localStorage.getItem("gigcraft_in:registered_users");
      const list = raw ? JSON.parse(raw) : [];
      if (!list.some((u) => u.email === cleanEmail)) {
        list.push(sessionUser);
        localStorage.setItem("gigcraft_in:registered_users", JSON.stringify(list));
      }
    } catch {}

    return { ok: true, user: sessionUser };
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
      const raw = localStorage.getItem("gigcraft_in:registered_users");
      const list = raw ? JSON.parse(raw) : [];
      if (!list.some((u) => u.email === cleanEmail)) {
        list.push(sessionUser);
        localStorage.setItem("gigcraft_in:registered_users", JSON.stringify(list));
      }
    } catch {}

    return { ok: true, user: sessionUser };
  }, []);

  const loginWithBackendGoogle = useCallback(
    async ({ credential, code, redirectUri, role = "client" }) => {
      try {
        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credential, code, redirectUri, role }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          return { ok: false, error: data.error || "Google authentication failed on backend." };
        }
        setUser(data.user);
        try {
          localStorage.setItem("gigcraft_in:user", JSON.stringify(data.user));
          const raw = localStorage.getItem("gigcraft_in:registered_users");
          const list = raw ? JSON.parse(raw) : [];
          if (!list.some((u) => u.email === data.user.email)) {
            list.push(data.user);
            localStorage.setItem("gigcraft_in:registered_users", JSON.stringify(list));
          }
        } catch {}
        return { ok: true, user: data.user, isNew: data.isNew };
      } catch (err) {
        return { ok: false, error: err.message || "Failed to reach authentication backend." };
      }
    },
    []
  );

  const loginWithFirebaseGoogle = useCallback(async (role = "client") => {
    return signInWithGooglePopup(role);
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    try {
      localStorage.removeItem("gigcraft_in:user");
    } catch {}
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {}
    try {
      await signOutFromFirebase();
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
    () => ({
      user,
      hydrated,
      login,
      loginWithProvider,
      loginWithBackendGoogle,
      loginWithFirebaseGoogle,
      loginWithGoogleDemo,
      loginWithGithubDemo,
      register,
      logout,
      switchRole,
      setSessionUser,
    }),
    [
      user,
      hydrated,
      login,
      loginWithProvider,
      loginWithBackendGoogle,
      loginWithFirebaseGoogle,
      loginWithGoogleDemo,
      loginWithGithubDemo,
      register,
      logout,
      switchRole,
      setSessionUser,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
