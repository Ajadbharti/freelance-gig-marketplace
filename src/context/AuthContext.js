"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { demoUsers, DEMO_PASSWORD } from "@/data/users";
import { loadFromStorage, removeFromStorage, saveToStorage } from "@/lib/storage";
import { generateId } from "@/lib/utils";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  // Page load par LocalStorage se data lo (hydration error se bachne ke liye effect mein)
  useEffect(() => {
    setUser(loadFromStorage("auth:user", null));
    setRegisteredUsers(loadFromStorage("auth:registered", []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (user) saveToStorage("auth:user", user);
    else removeFromStorage("auth:user");
  }, [user, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    saveToStorage("auth:registered", registeredUsers);
  }, [registeredUsers, hydrated]);

  const login = useCallback(
    (email, password) => {
      const normalized = (email || "").trim().toLowerCase();
      const invalid = { ok: false, error: "Incorrect email or password." };

      const demo = demoUsers.find((u) => u.email === normalized);
      if (demo) {
        if (password !== DEMO_PASSWORD) return invalid;
        setUser(demo);
        return { ok: true, user: demo };
      }

      const found = registeredUsers.find((u) => u.email === normalized);
      if (!found || found.password !== password) return invalid;

      const safeUser = {
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role,
        avatar: found.avatar,
      };
      setUser(safeUser);
      return { ok: true, user: safeUser };
    },
    [registeredUsers]
  );

  const register = useCallback(
    ({ name, email, password, role }) => {
      const normalized = (email || "").trim().toLowerCase();
      const exists =
        demoUsers.some((u) => u.email === normalized) ||
        registeredUsers.some((u) => u.email === normalized);
      if (exists) return { ok: false, error: "An account with this email already exists." };

      const newUser = {
        id: generateId(role === "freelancer" ? "f" : "c"),
        name: name.trim(),
        email: normalized,
        role,
        avatar: `https://i.pravatar.cc/200?u=${encodeURIComponent(normalized)}`,
      };
      setRegisteredUsers((prev) => [...prev, { ...newUser, password }]);
      setUser(newUser);
      return { ok: true, user: newUser };
    },
    [registeredUsers]
  );

  const logout = useCallback(() => setUser(null), []);

  const value = useMemo(
    () => ({ user, hydrated, login, register, logout }),
    [user, hydrated, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}