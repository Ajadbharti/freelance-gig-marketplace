"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogOut, Menu, User, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/ToastProvider";
import { categories } from "@/data/categories";
import SearchBar from "@/components/layout/SearchBar";
import SafeImage from "@/components/ui/SafeImage";

export default function Navbar() {
  const router = useRouter();
  const { user, hydrated, logout } = useAuth();
  const { showToast } = useToast();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const catRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    }
    function handleKey(e) {
      if (e.key === "Escape") {
        setCatOpen(false);
        setUserOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  function closeAll() {
    setMobileOpen(false);
    setCatOpen(false);
    setUserOpen(false);
  }

  function handleLogout() {
    logout();
    closeAll();
    showToast("You have been logged out.", "info");
    router.push("/");
  }

  const dashboardHref = user?.role === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <Link href="/" onClick={closeAll} className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
            G
          </span>
          <span className="text-xl font-bold text-slate-900">GigNest</span>
        </Link>

        <div className="hidden max-w-md flex-1 md:block">
          <SearchBar />
        </div>

        <nav className="ml-auto hidden items-center gap-1 lg:flex" aria-label="Main">
          <Link
            href="/gigs"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Explore
          </Link>

          <div className="relative" ref={catRef}>
            <button
              type="button"
              onClick={() => setCatOpen((v) => !v)}
              aria-expanded={catOpen}
              aria-haspopup="menu"
              className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Categories
              <ChevronDown className={`h-4 w-4 transition ${catOpen ? "rotate-180" : ""}`} />
            </button>
            {catOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-lg"
              >
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/gigs?category=${c.slug}`}
                    role="menuitem"
                    onClick={closeAll}
                    className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          {!hydrated ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-slate-200" aria-hidden="true" />
          ) : user ? (
            <div className="relative" ref={userRef}>
              <button
                type="button"
                onClick={() => setUserOpen((v) => !v)}
                aria-expanded={userOpen}
                aria-haspopup="menu"
                aria-label="Open user menu"
                className="flex items-center gap-2 rounded-full border border-slate-200 p-1 pr-3 transition hover:bg-slate-50"
              >
                <SafeImage src={user.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                <span className="hidden max-w-[110px] truncate text-sm font-medium text-slate-800 sm:block">
                  {user.name}
                </span>
                <ChevronDown className="h-4 w-4 text-slate-500" />
              </button>
              {userOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg"
                >
                  <div className="border-b border-slate-100 px-3 py-2">
                    <p className="truncate text-sm font-semibold text-slate-900">{user.name}</p>
                    <p className="text-xs capitalize text-slate-500">{user.role} (demo)</p>
                  </div>
                  <Link
                    href={dashboardHref}
                    role="menuitem"
                    onClick={closeAll}
                    className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                  >
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                  {user.role === "freelancer" && (
                    <Link
                      href={`/freelancers/${user.id}`}
                      role="menuitem"
                      onClick={closeAll}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                    >
                      <User className="h-4 w-4" /> My profile
                    </Link>
                  )}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 sm:block"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Sign Up
              </Link>
            </>
          )}

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 lg:hidden"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <div className="md:hidden">
            <SearchBar onSearch={closeAll} />
          </div>
          <nav className="mt-4 space-y-1 md:mt-0" aria-label="Mobile">
            <Link
              href="/gigs"
              onClick={closeAll}
              className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
            >
              Explore all gigs
            </Link>
            <p className="px-3 pt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Categories</p>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/gigs?category=${c.slug}`}
                onClick={closeAll}
                className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                {c.name}
              </Link>
            ))}
            {hydrated && !user && (
              <Link
                href="/login"
                onClick={closeAll}
                className="block rounded-lg px-3 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 sm:hidden"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}