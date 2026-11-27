"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Heart,
  LayoutDashboard,
  MessageSquare,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Star,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardSidebar({ role, userId }) {
  const pathname = usePathname();

  const links =
    role === "freelancer"
      ? [
          { href: "/dashboard/freelancer", label: "Workspace Overview", icon: LayoutDashboard },
          { href: "/orders", label: "Active Contracts", icon: ShieldCheck },
          { href: "/messages", label: "Encrypted Messages", icon: MessageSquare },
          { href: "/dashboard/freelancer/gigs/new", label: "Publish New Spec", icon: Plus },
          { href: userId ? `/freelancers/${userId}` : "/dashboard/freelancer", label: "Audited Profile", icon: User },
          { href: "/account", label: "Security & Keys", icon: Settings },
        ]
      : [
          { href: "/dashboard/client", label: "Buyer Console", icon: LayoutDashboard },
          { href: "/orders", label: "Contract Ledger", icon: ShieldCheck },
          { href: "/messages", label: "Messages & Audit", icon: MessageSquare },
          { href: "/dashboard/client#saved", label: "Vault Specs", icon: Heart },
          { href: "/dashboard/client#reviews", label: "Audited Reviews", icon: Star },
          { href: "/gigs", label: "Browse Contracts", icon: Search },
          { href: "/account", label: "Account Settings", icon: Settings },
        ];

  return (
    <nav
      aria-label="Dashboard"
      className="flex gap-1.5 overflow-x-auto border border-slate-200 bg-white p-2 font-mono text-xs uppercase tracking-wider shadow-sm lg:sticky lg:top-24 lg:flex-col lg:self-start lg:overflow-visible"
    >
      {links.map((link) => {
        const Icon = link.icon;
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex shrink-0 items-center gap-2 px-3.5 py-2.5 transition",
              active
                ? "bg-[#047857] font-bold text-white"
                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
