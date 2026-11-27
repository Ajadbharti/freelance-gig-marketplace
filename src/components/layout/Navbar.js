"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronDown, LayoutDashboard, LogOut, Menu, Search, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/ToastProvider";
import { NAV_CATEGORIES } from "@/data/categories";
import SafeImage from "@/components/ui/SafeImage";

const emptySubscribe = () => () => {};

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const userRef = useRef(null);

  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname.startsWith("/auth");

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
    showToast("Signed out successfully.", "info");
    router.push("/explore");
  }

  const dashboardHref =
    user?.role === "admin" ? "/admin" : user?.role === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client";

  // Minimal Header for Auth Pages: Return null so LoginForm/RegisterForm render their single header without duplicates
  if (isAuthPage) {
    return null;
  }

  const isExploreActive = pathname === "/" || pathname.startsWith("/explore") || pathname.startsWith("/gigs");
  const isOrdersActive = pathname.startsWith("/orders");
  const isMessagesActive = pathname === "/messages";

  return (
    <header className="sticky top-0 z-40 border-b border-[#e5e7eb] bg-white">
      {/* Top Main Navigation Bar */}
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="font-headline text-2xl font-bold tracking-tight text-[#005d42] uppercase">GIGCRAFT</span>
        </Link>

        {/* Search Bar matching screenshot */}
        <div className="hidden max-w-md flex-1 md:block">
          <form onSubmit={handleSearchSubmit} className="flex h-9 items-center border border-[#6e7a73] bg-white focus-within:border-[#0b1c30]">
            <Search className="ml-2.5 h-4 w-4 text-[#6e7a73] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services, talent, or gigs..."
              className="h-full min-w-0 flex-1 px-2.5 text-xs text-[#0b1c30] placeholder:text-[#6e7a73] focus:outline-none"
            />
            <button
              type="submit"
              className="h-full bg-[#005d42] px-4 font-mono text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#047857]"
            >
              SEARCH
            </button>
          </form>
        </div>

        {/* Center/Right Nav Links */}
        <nav className="ml-auto hidden items-center gap-6 lg:flex" aria-label="Main">
          <Link
            href="/explore"
            className={`text-xs font-bold uppercase tracking-wider transition ${
              isExploreActive
                ? "border-b-2 border-[#005d42] pb-1 text-[#005d42]"
                : "text-[#3e4943] hover:text-[#005d42]"
            }`}
          >
            Explore Gigs
          </Link>

          {mounted && user && (
            <>
              <Link
                href="/orders"
                className={`text-xs font-semibold uppercase tracking-wider transition hover:text-[#005d42] ${
                  isOrdersActive ? "border-b-2 border-[#005d42] pb-1 text-[#005d42]" : "text-[#3e4943]"
                }`}
              >
                My Orders
              </Link>

              <Link
                href="/messages"
                className={`text-xs font-semibold uppercase tracking-wider transition hover:text-[#005d42] ${
                  isMessagesActive ? "border-b-2 border-[#005d42] pb-1 text-[#005d42]" : "text-[#3e4943]"
                }`}
              >
                Messages
              </Link>
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
                className="flex items-center justify-center p-1 text-[#0b1c30] hover:text-[#005d42] transition"
              >
                <Bell className="h-5 w-5" />
              </Link>

              {/* User Dropdown */}
              <div className="relative" ref={userRef}>
                <button
                  type="button"
                  onClick={() => setUserOpen((v) => !v)}
                  className="flex items-center gap-1.5 transition hover:opacity-80 focus:outline-none"
                  aria-label="User menu"
                  aria-expanded={userOpen}
                >
                  {user.avatar ? (
                    <SafeImage
                      src={user.avatar}
                      alt=""
                      className="h-8 w-8 rounded-full border border-[#e5e7eb] object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e2e8f0] font-mono text-xs font-bold text-[#0b1c30]">
                      {user.initials || "RP"}
                    </div>
                  )}
                  <ChevronDown className="h-3.5 w-3.5 text-[#0b1c30]" />
                </button>

                {userOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-64 border border-[#0b1c30] bg-white p-4 shadow-[3px_3px_0px_#0b1c30] z-50 rounded-none"
                  >
                    <div>
                      <p className="font-sans text-sm font-bold text-[#0b1c30]">{user.name}</p>
                      <p className="font-sans text-xs text-[#6e7a73] mt-0.5">{user.email}</p>
                      <span className="mt-2 inline-block border border-[#005d42]/30 bg-[#eff4ff] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#005d42]">
                        {user.role === "admin" ? "ADMINISTRATOR" : user.role === "freelancer" ? "FREELANCER" : "CLIENT"}
                      </span>
                    </div>

                    <div className="border-b border-[#e5e7eb] my-3" />

                    <Link
                      href={dashboardHref}
                      onClick={() => setUserOpen(false)}
                      className="flex items-center gap-2 font-sans text-xs font-semibold text-[#0b1c30] hover:text-[#005d42] transition"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>{user?.role === "admin" ? "Admin Console" : "Dashboard"}</span>
                    </Link>

                    <div className="border-b border-[#e5e7eb] my-3" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 font-sans text-xs font-semibold text-[#ba1a1a] hover:underline transition"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center gap-1 border border-[#0b1c30] bg-[#eff4ff] px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-[#005d42] hover:bg-[#005d42] hover:text-white shadow-[1px_1px_0px_#0b1c30] transition"
              >
                🛡️ ADMIN
              </Link>
              <Link
                href="/login"
                className="px-2 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-[#0b1c30] transition hover:text-[#005d42]"
              >
                LOG IN
              </Link>
              <Link
                href="/register"
                className="px-4 py-1.5 bg-[#005d42] text-white border border-[#005d42] font-semibold text-xs uppercase tracking-wide hover:bg-[#047857] shadow-[2px_2px_0px_#0b1c30] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
              >
                JOIN
              </Link>
            </div>
          )}

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-8 w-8 items-center justify-center border border-[#e5e7eb] text-[#0b1c30] lg:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Subcategory Technical Strip matching image */}
      <div className="border-t border-[#e5e7eb] bg-white">
        <div className="mx-auto flex h-9 max-w-7xl items-center overflow-x-auto px-4 text-[11px] font-mono tracking-wider text-[#3e4943] sm:px-6">
          <div className="flex items-center gap-6 whitespace-nowrap">
            {NAV_CATEGORIES.map((cat, idx) => (
              <span key={cat.slug} className="flex items-center gap-6">
                <Link
                  href={`/explore?category=${cat.slug}`}
                  className="font-mono text-[11px] uppercase tracking-wider text-[#0b1c30] transition hover:text-[#005d42]"
                >
                  {cat.name}
                </Link>
                {idx < NAV_CATEGORIES.length - 1 && <span className="text-[#6e7a73]/40">/</span>}
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
              className="h-full flex-1 border border-[#6e7a73] px-3 text-xs"
            />
            <button type="submit" className="bg-[#005d42] px-3 font-mono text-xs text-white">
              SEARCH
            </button>
          </form>
          <div className="space-y-2 font-mono text-xs uppercase tracking-wider">
            <Link
              href="/explore"
              onClick={() => setMobileOpen(false)}
              className="block py-1 text-slate-800 hover:text-[#005d42]"
            >
              Explore Gigs
            </Link>
            <Link
              href="/orders"
              onClick={() => setMobileOpen(false)}
              className="block py-1 text-slate-800 hover:text-[#005d42]"
            >
              My Orders
            </Link>
            <Link
              href="/messages"
              onClick={() => setMobileOpen(false)}
              className="block py-1 text-slate-800 hover:text-[#005d42]"
            >
              Messages
            </Link>
            <Link
              href="/dashboard/client"
              onClick={() => setMobileOpen(false)}
              className="block py-1 text-slate-800 hover:text-[#005d42]"
            >
              Dashboard
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
