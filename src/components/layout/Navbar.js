"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronDown, LayoutDashboard, LogOut, Menu, Search, ShieldCheck, User, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/ToastProvider";
import { NAV_CATEGORIES } from "@/data/categories";
import SafeImage from "@/components/ui/SafeImage";

const emptySubscribe = () => () => {};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, switchRole } = useAuth();
  const { showToast } = useToast();

  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const userRef = useRef(null);

  const isAuthPage = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    function handleClick(e) {
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
    }
    function handleKey(e) {
      if (e.key === "Escape") setUserOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/gigs?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

  async function handleLogout() {
    setUserOpen(false);
    await logout();
    showToast("Signed out from GigCraft node.", "info");
    router.push("/login");
  }

  function handleToggleSelling() {
    if (!user) {
      router.push("/register?role=freelancer");
      return;
    }
    const nextRole = user?.role === "freelancer" ? "client" : "freelancer";
    switchRole(nextRole);
    showToast(`Switched workspace mode to ${nextRole.toUpperCase()}`, "info");
    router.push(nextRole === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client");
  }

  const dashboardHref =
    user?.role === "admin" ? "/admin" : user?.role === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client";

  // Streamlined Minimal Header for Auth Pages (Matching Screenshot)
  if (isAuthPage) {
    return (
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="font-serif text-xl font-bold tracking-tight text-[#047857]">
            GIGCRAFT
          </Link>
          <Link
            href="/gigs"
            className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-600 transition hover:text-[#047857]"
          >
            BACK TO MARKETPLACE
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      {/* Top Main Navigation Bar */}
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="font-headline text-2xl font-bold tracking-tight text-[#047857] uppercase">GIGCRAFT</span>
        </Link>

        {/* Search Bar matching image */}
        <div className="hidden max-w-md flex-1 md:block">
          <form onSubmit={handleSearchSubmit} className="flex h-9 items-center border border-slate-300 bg-white shadow-none focus-within:border-slate-800">
            <Search className="ml-2.5 h-4 w-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services, talent, or gigs..."
              className="h-full min-w-0 flex-1 px-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="h-full bg-[#047857] px-4 font-mono text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#065f46]"
            >
              SEARCH
            </button>
          </form>
        </div>

        {/* Center/Right Nav Links */}
        <nav className="ml-auto hidden items-center gap-6 lg:flex" aria-label="Main">
          <Link
            href="/gigs"
            className={`text-xs font-bold uppercase tracking-wider transition ${
              pathname.startsWith("/gigs")
                ? "border-b-2 border-[#047857] pb-1 text-[#047857]"
                : "text-slate-700 hover:text-[#047857]"
            }`}
          >
            Explore Gigs
          </Link>

          {mounted && user && (
            <>
              <Link
                href="/orders"
                className={`text-xs font-semibold uppercase tracking-wider transition hover:text-[#047857] ${
                  pathname.startsWith("/orders") ? "text-[#047857] underline underline-offset-8" : "text-slate-700"
                }`}
              >
                My Orders
              </Link>

              <Link
                href="/messages"
                className={`text-xs font-semibold uppercase tracking-wider transition hover:text-[#047857] ${
                  pathname === "/messages" ? "text-[#047857] underline underline-offset-8" : "text-slate-700"
                }`}
              >
                Messages
              </Link>

              <button
                type="button"
                onClick={handleToggleSelling}
                className="text-xs font-semibold uppercase tracking-wider text-slate-700 transition hover:text-[#047857]"
              >
                {user?.role === "freelancer" ? "Switch to Buying" : "Switch to Selling"}
              </button>
            </>
          )}
        </nav>

        {/* User & Auth Right controls */}
        <div className="flex items-center gap-3">
          {mounted && user ? (
            <>
              {/* Notification bell */}
              <Link
                href="/messages"
                aria-label="Notifications"
                className="relative flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-slate-600 transition hover:bg-slate-50"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#047857]" />
              </Link>

              <div className="relative" ref={userRef}>
                <button
                  type="button"
                  onClick={() => setUserOpen((v) => !v)}
                  className="flex items-center gap-2 rounded border border-slate-200 p-1 pr-2 transition hover:bg-slate-50"
                >
                  <SafeImage
                    src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"}
                    alt=""
                    className="h-6 w-6 rounded-full object-cover"
                  />
                  <span className="hidden max-w-[100px] truncate text-xs font-semibold text-slate-900 sm:block">
                    {user.name}
                  </span>
                  <ChevronDown className="h-3 w-3 text-slate-500" />
                </button>

                {userOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-56 rounded border border-slate-200 bg-white p-2 shadow-lg"
                  >
                    <div className="border-b border-slate-100 px-3 py-2">
                      <p className="truncate text-xs font-bold uppercase tracking-wider text-slate-900">{user.name}</p>
                      <p className="font-mono text-[10px] uppercase text-[#047857]">
                        {user.role === "freelancer" ? "BUILDER WORKSPACE" : "BUYER ESCROW MODE"}
                      </p>
                    </div>
                    <Link
                      href={dashboardHref}
                      onClick={() => setUserOpen(false)}
                      className="mt-1 flex items-center gap-2 rounded px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <LayoutDashboard className="h-3.5 w-3.5" /> Workspace Dashboard
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setUserOpen(false)}
                      className="flex items-center gap-2 rounded px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" /> Active Contracts Ledger
                    </Link>
                    <Link
                      href="/gigs"
                      onClick={() => setUserOpen(false)}
                      className="flex items-center gap-2 rounded px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <User className="h-3.5 w-3.5" /> Browse Specialists Catalog
                    </Link>
                    <Link
                      href="/account"
                      onClick={() => setUserOpen(false)}
                      className="flex items-center gap-2 rounded px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <User className="h-3.5 w-3.5" /> Account Settings
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-3.5 w-3.5" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-2 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-slate-800 transition hover:text-[#047857]"
              >
                LOG IN
              </Link>
              <Link
                href="/register"
                className="bg-[#047857] px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#065f46]"
              >
                JOIN
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-slate-700 lg:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Subcategory Technical Strip matching image */}
      <div className="border-t border-slate-200 bg-[#FAFAFA]">
        <div className="mx-auto flex h-9 max-w-7xl items-center overflow-x-auto px-4 text-[11px] font-mono tracking-wider text-slate-600 sm:px-6">
          <div className="flex items-center gap-6 whitespace-nowrap">
            {NAV_CATEGORIES.map((cat, idx) => (
              <span key={cat.slug} className="flex items-center gap-6">
                <Link
                  href={`/gigs?category=${cat.slug}`}
                  className="transition hover:text-[#047857] hover:underline"
                >
                  {cat.name}
                </Link>
                {idx < NAV_CATEGORIES.length - 1 && <span className="text-slate-300">/</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden">
          <form onSubmit={handleSearchSubmit} className="mb-4 flex h-9">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services..."
              className="h-full flex-1 rounded-l border border-slate-300 px-3 text-xs"
            />
            <button type="submit" className="bg-[#047857] px-3 font-mono text-xs text-white">
              SEARCH
            </button>
          </form>
          <div className="space-y-2 font-mono text-xs uppercase tracking-wider">
            <Link
              href="/gigs"
              onClick={() => setMobileOpen(false)}
              className="block py-1 text-slate-800 hover:text-[#047857]"
            >
              Explore Gigs
            </Link>
            <Link
              href="/orders"
              onClick={() => setMobileOpen(false)}
              className="block py-1 text-slate-800 hover:text-[#047857]"
            >
              My Orders
            </Link>
            <Link
              href="/messages"
              onClick={() => setMobileOpen(false)}
              className="block py-1 text-slate-800 hover:text-[#047857]"
            >
              Messages
            </Link>
            <Link
              href="/dashboard/client"
              onClick={() => setMobileOpen(false)}
              className="block py-1 text-slate-800 hover:text-[#047857]"
            >
              Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
