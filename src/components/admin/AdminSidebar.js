"use client";

import {
  AlertTriangle,
  Briefcase,
  CheckCircle2,
  Clock,
  Layers,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShieldCheck,
  Star,
  User,
  UserCheck,
  Users,
  Wallet,
} from "lucide-react";

export const NAV_SECTIONS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "users", label: "Manage All Users", icon: Users },
  { id: "freelancers", label: "Manage Freelancers", icon: Briefcase },
  { id: "clients", label: "Manage Clients", icon: UserCheck },
  { id: "gigs", label: "Manage Gigs", icon: Package },
  { id: "gig-approvals", label: "Gig Approvals", icon: Clock, badgeKey: "pendingGigs" },
  { id: "categories", label: "Manage Categories", icon: Layers },
  { id: "orders", label: "Manage Orders", icon: ShieldCheck },
  { id: "reviews", label: "Manage Reviews", icon: Star },
  { id: "payments", label: "Simulated Payments", icon: Wallet },
  { id: "reports", label: "Reports & Complaints", icon: AlertTriangle },
  { id: "settings", label: "Platform Settings", icon: Settings },
];

export default function AdminSidebar({ activeSection, onSelectSection, stats, user, onLogout }) {
  return (
    <aside className="w-full lg:w-64 shrink-0 flex flex-col border border-[#0b1c30] bg-white shadow-[3px_3px_0px_#0b1c30]">
      {/* Brand & Role Header */}
      <div className="border-b border-[#0b1c30] bg-[#0b1c30] p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-[#005d42]" />
            <span className="font-headline text-base font-bold tracking-tight uppercase">
              GIGCRAFT ADMIN
            </span>
          </div>
          <span className="border border-[#9ffdd3] bg-[#005d42] px-1.5 py-0.5 font-mono text-[9px] font-bold text-white uppercase tracking-wider">
            ROOT ACCESS
          </span>
        </div>
        <p className="mt-1 font-mono text-[10px] text-slate-300">
          Deterministic Governance & Escrow Console
        </p>
      </div>

      {/* Nav Menu */}
      <nav aria-label="Admin Navigation" className="flex-1 py-3 space-y-0.5 font-mono text-xs">
        {NAV_SECTIONS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          const badgeCount = item.badgeKey && stats ? stats[item.badgeKey] : null;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectSection(item.id)}
              className={`flex w-full items-center justify-between px-4 py-2.5 text-left font-bold transition ${
                isActive
                  ? "border-l-4 border-[#005d42] bg-[#eff4ff] text-[#005d42]"
                  : "text-[#3e4943] hover:bg-slate-50 hover:text-[#0b1c30]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-[#005d42]" : "text-[#6e7a73]"}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {badgeCount > 0 && (
                <span className="rounded-none border border-[#ba1a1a] bg-[#ba1a1a] px-1.5 py-0.2 font-mono text-[10px] font-bold text-white">
                  {badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Profile & Logout Footer */}
      <div className="border-t border-[#0b1c30] bg-slate-50 p-4 font-mono text-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#0b1c30] bg-[#eff4ff] font-headline font-bold text-[#0047bf]">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : "AD"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-sans font-bold text-[#0b1c30]">
              {user?.name || "Administrator"}
            </p>
            <p className="truncate text-[10px] text-[#6e7a73]">
              {user?.email || "admin@gigcraft.io"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="mt-3 flex w-full items-center justify-center gap-1.5 border border-[#ba1a1a] bg-white py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#ba1a1a] hover:bg-red-50 transition shadow-[1px_1px_0px_#ba1a1a]"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>SIGN OUT</span>
        </button>
      </div>
    </aside>
  );
}
