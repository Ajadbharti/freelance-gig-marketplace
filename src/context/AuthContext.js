"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { demoUsers } from "@/data/users";

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
        // Default to client user for demo preview so user sees dashboard & active contracts right away
        setUser(demoUsers[0]);
      }
    } catch {
      setUser(demoUsers[0]);
    }
    setHydrated(true);
  }, []);

  const login = useCallback(async (email, password) => {
    const cleanEmail = (email || "").trim().toLowerCase();
    const found = demoUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (found) {
      setUser(found);
      try {
        localStorage.setItem("gigcraft_in:user", JSON.stringify(found));
      } catch {}
      return { ok: true, user: found };
    }
    // Any other email can also log in as client or based on domain
    const newUser = {
      id: "u-" + Date.now(),
      name: cleanEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      email: cleanEmail,
      role: cleanEmail.includes("freelance") || cleanEmail.includes("designer") ? "freelancer" : "client",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    };
    setUser(newUser);
    try {
      localStorage.setItem("gigcraft_in:user", JSON.stringify(newUser));
    } catch {}
    return { ok: true, user: newUser };
  }, []);

  const loginWithProvider = useCallback(async (provider) => {
    const providerUser = provider === "github" ? demoUsers[1] : demoUsers[0];
    setUser(providerUser);
    try {
      localStorage.setItem("gigcraft_in:user", JSON.stringify(providerUser));
    } catch {}
    return { ok: true, user: providerUser };
  }, []);

  const register = useCallback(async ({ name, email, password, role }) => {
    const cleanEmail = (email || "").trim().toLowerCase();
    const newUser = {
      id: "u-" + Date.now(),
      name: name.trim(),
      email: cleanEmail,
      role: role || "client",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    };
    setUser(newUser);
    try {
      localStorage.setItem("gigcraft_in:user", JSON.stringify(newUser));
    } catch {}
    return { ok: true, user: newUser };
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    try {
      localStorage.removeItem("gigcraft_in:user");
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
