"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, LayoutDashboard, LogOut, Menu, Search, User, X, Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import SafeImage from "@/components/ui/SafeImage";

export default function HomeNavbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

  const dashboardHref =
    user?.role === "admin"
      ? "/admin/dashboard"
      : user?.role === "freelancer"
      ? "/freelancer/dashboard"
      : "/client/dashboard";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 transition"
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25 group-hover:scale-105 transition-transform duration-200">
              <Zap className="w-5 h-5 fill-current" />
            </span>
            <span className="font-headline text-2xl font-bold tracking-tight text-slate-900">
              Gig<span className="text-violet-600">Market</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 font-sans text-sm font-semibold text-slate-600">
            <Link href="#explore" className="hover:text-violet-600 transition">
              Explore
            </Link>
            <Link href="#categories" className="hover:text-violet-600 transition">
              Categories
            </Link>
            <Link href="#how-it-works" className="hover:text-violet-600 transition">
              How It Works
            </Link>
          </nav>
        </div>

        {/* Center/Right: Search Bar & Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Compact Search Field */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden sm:flex items-center rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs focus-within:border-violet-600 focus-within:bg-white focus-within:ring-2 focus-within:ring-violet-500/10 transition-all w-52 lg:w-64"
          >
            <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services..."
              className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </form>

          {/* User Auth Buttons */}
          {user ? (
            <div className="flex items-center gap-2.5">
              <Link
                href={dashboardHref}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white px-3.5 py-2 font-sans text-xs font-semibold text-slate-800 hover:border-violet-300 hover:text-violet-600 shadow-2xs transition"
              >
                <LayoutDashboard className="w-4 h-4 text-violet-600" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <button
                type="button"
                onClick={logout}
                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-rose-600 hover:border-rose-200 transition cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/login"
                className="font-sans text-xs sm:text-sm font-semibold text-slate-700 hover:text-violet-600 px-3 py-2 transition"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-sans text-xs sm:text-sm font-semibold shadow-md shadow-violet-500/25 hover:from-violet-700 hover:to-indigo-700 active:scale-[0.99] transition-all"
              >
                <span>Sign Up</span>
                <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-5 space-y-4 animate-fade-in">
          <form onSubmit={handleSearchSubmit} className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs">
            <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services or skills..."
              className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </form>

          <nav className="flex flex-col gap-3 font-sans text-sm font-semibold text-slate-700">
            <Link
              href="#explore"
              onClick={() => setMobileOpen(false)}
              className="py-1.5 hover:text-violet-600 transition"
            >
              Explore Services
            </Link>
            <Link
              href="#categories"
              onClick={() => setMobileOpen(false)}
              className="py-1.5 hover:text-violet-600 transition"
            >
              Categories
            </Link>
            <Link
              href="#how-it-works"
              onClick={() => setMobileOpen(false)}
              className="py-1.5 hover:text-violet-600 transition"
            >
              How It Works
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
