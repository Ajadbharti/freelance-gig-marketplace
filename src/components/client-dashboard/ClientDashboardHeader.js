"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Check,
  ChevronDown,
  CreditCard,
  Heart,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Settings,
  ShoppingBag,
  Sparkles,
  User,
  Zap,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/ToastProvider";

const NOTIFICATIONS = [
  {
    id: 1,
    title: "Order Delivered!",
    desc: "Elena Rostova delivered files for 'Modern Business Logo'. Review milestone.",
    time: "10 mins ago",
    unread: true,
  },
  {
    id: 2,
    title: "New Message",
    desc: "Alex Morgan: 'The initial Next.js demo is ready for staging test.'",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    title: "Escrow Funded",
    desc: "₹4,200 milestone payment secured in vault contract #ord-921b.",
    time: "Yesterday",
    unread: false,
  },
];

export default function ClientDashboardHeader({ onOpenMobile }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const notifRef = useRef(null);
  const userRef = useRef(null);

  const clientName = user?.name || "John Doe";
  const clientEmail = user?.email || "john.doe@company.io";
  const initials = clientName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "JD";

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

  async function handleLogout() {
    showToast("Signing out...", "info");
    await logout();
    window.location.href = "/login";
  }

  return (
    <header className="sticky top-0 z-30 h-18 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <div className="relative flex items-center rounded-2xl border border-slate-200 bg-slate-50/70 focus-within:bg-white focus-within:border-violet-600 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all">
            <span className="pl-3.5 pr-1 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders, gigs, or freelancers..."
              className="w-full bg-transparent px-2.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </div>
        </form>
      </div>

      {/* Right: Actions, Notifications & Profile Avatar */}
      <div className="flex items-center gap-3">
        
        {/* Explore Gigs Quick Pill (Desktop) */}
        <Link
          href="/explore"
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-50 border border-violet-200 text-xs font-semibold text-violet-700 hover:bg-violet-100 transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-violet-600" />
          <span>Explore Gigs</span>
        </Link>

        {/* Notifications Bell Dropdown */}
        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => setNotifOpen((prev) => !prev)}
            aria-label="View notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {/* Notifications Dropdown Card */}
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-white p-4 shadow-2xl border border-slate-200/90 space-y-3 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-headline text-sm font-bold text-slate-900">
                  Notifications
                </span>
                <span className="text-[11px] font-bold text-violet-600 cursor-pointer hover:underline">
                  Mark all as read
                </span>
              </div>

              <div className="divide-y divide-slate-100 space-y-1">
                {NOTIFICATIONS.map((n) => (
                  <div key={n.id} className="py-2.5 flex items-start gap-3 hover:bg-slate-50/60 p-2 rounded-xl transition">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700 text-xs font-bold">
                      {n.unread ? "⚡" : "✓"}
                    </div>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <p className="text-xs font-bold text-slate-900">{n.title}</p>
                      <p className="text-[11px] text-slate-500 leading-snug">{n.desc}</p>
                      <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/orders"
                onClick={() => setNotifOpen(false)}
                className="block text-center text-xs font-bold text-violet-600 hover:underline pt-2 border-t border-slate-100"
              >
                View All Activity →
              </Link>
            </div>
          )}
        </div>

        {/* Client Profile Avatar & Dropdown */}
        <div ref={userRef} className="relative">
          <button
            type="button"
            onClick={() => setUserDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2.5 p-1 rounded-2xl hover:bg-slate-100/70 transition cursor-pointer"
          >
            <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-headline font-bold text-xs flex items-center justify-center shadow-xs">
              {initials}
            </div>
            <div className="hidden md:block text-left">
              <span className="block text-xs font-bold text-slate-900 leading-tight">
                {clientName}
              </span>
              <span className="text-[11px] text-slate-400 font-medium leading-tight">
                Client
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* User Dropdown Menu */}
          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-2 shadow-2xl border border-slate-200/90 space-y-1 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{clientName}</p>
                <p className="text-[11px] text-slate-400 truncate">{clientEmail}</p>
              </div>

              <Link
                href="/account"
                onClick={() => setUserDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>Account Profile</span>
              </Link>

              <Link
                href="/orders"
                onClick={() => setUserDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
              >
                <ShoppingBag className="w-4 h-4 text-slate-400" />
                <span>My Active Orders</span>
              </Link>

              <Link
                href="/account"
                onClick={() => setUserDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 transition"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Preferences &amp; Security</span>
              </Link>

              <div className="pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
