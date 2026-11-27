"use client";

import Link from "next/link";
import {
  Bell,
  Bookmark,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Heart,
  HelpCircle,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Package,
  Search,
  Settings,
  ShoppingBag,
  Sparkles,
  Star,
  User,
  X,
  Zap,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/ToastProvider";

export const SIDEBAR_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, href: "/dashboard/client" },
  { id: "orders", label: "My Orders", icon: ShoppingBag, href: "/orders", badge: "4" },
  { id: "saved", label: "Saved Gigs", icon: Heart, href: "/saved-gigs", badge: "8" },
  { id: "messages", label: "Messages", icon: MessageSquare, href: "/messages", badge: "2", badgeColor: "bg-violet-600 text-white" },
  { id: "reviews", label: "My Reviews", icon: Star, href: "#my-reviews" },
  { id: "settings", label: "Account Settings", icon: Settings, href: "/account" },
];

export default function ClientDashboardSidebar({
  activeNav = "overview",
  onNavClick,
  mobileOpen = false,
  onCloseMobile,
}) {
  const { user, logout } = useAuth();
  const { showToast } = useToast();

  const clientName = user?.name || "John Doe";
  const clientEmail = user?.email || "john.doe@company.io";
  const initials = clientName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "JD";

  async function handleLogout() {
    showToast("Signing out...", "info");
    await logout();
    window.location.href = "/login";
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200/90 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Sidebar Top: GigMarket Brand Logo */}
          <div className="h-18 px-6 flex items-center justify-between border-b border-slate-100">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25">
                <Zap className="h-5 w-5 fill-white text-white" />
              </div>
              <div>
                <span className="font-headline text-lg font-bold tracking-tight text-slate-900">
                  GigMarket
                </span>
                <span className="block text-[10px] font-mono font-bold tracking-wider text-violet-600 uppercase">
                  Client Portal
                </span>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-1">
            <p className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans">
              Main Menu
            </p>

            <nav className="space-y-1">
              {SIDEBAR_ITEMS.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeNav === item.id;
                const className = `w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                  isActive
                    ? "bg-violet-600 text-white shadow-md shadow-violet-500/20 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`;

                const content = (
                  <>
                    <div className="flex items-center gap-3">
                      <IconComponent className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          isActive
                            ? "bg-white/20 text-white"
                            : item.badgeColor || "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                );

                if (item.href && item.href.startsWith("/")) {
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => {
                        if (onNavClick) onNavClick(item.id);
                        if (onCloseMobile) onCloseMobile();
                      }}
                      className={className}
                    >
                      {content}
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (onNavClick) onNavClick(item.id);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={className}
                  >
                    {content}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Escrow Assurance Banner */}
          <div className="p-4 mx-4 my-2 rounded-2xl bg-gradient-to-br from-violet-50/80 to-indigo-50/50 border border-violet-100 space-y-2">
            <div className="flex items-center gap-2 text-violet-700 font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Escrow Vault Active</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Your payments are securely safeguarded until you review and approve deliverables.
            </p>
            <Link
              href="/explore"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-violet-700 hover:underline pt-1"
            >
              <span>Browse Catalog →</span>
            </Link>
          </div>
        </div>

        {/* Sidebar Footer: Client Profile & Logout */}
        <div className="p-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-3 p-2 rounded-2xl bg-slate-50 border border-slate-200/60">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-headline font-bold text-xs flex items-center justify-center shadow-xs">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">{clientName}</p>
              <p className="text-[11px] text-slate-500 truncate">{clientEmail}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
