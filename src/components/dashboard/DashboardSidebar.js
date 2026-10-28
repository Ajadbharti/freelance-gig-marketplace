"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Plus, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardSidebar({ role, userId }) {
  const pathname = usePathname();

  const links =
    role === "freelancer"
      ? [
          { href: "/dashboard/freelancer", label: "Overview", icon: LayoutDashboard },
          { href: "/dashboard/freelancer/gigs/new", label: "Create gig", icon: Plus },
          { href: `/freelancers/${userId}`, label: "My profile", icon: User },
        ]
      : [
          { href: "/dashboard/client", label: "Overview", icon: LayoutDashboard },
          { href: "/gigs", label: "Browse gigs", icon: Search },
        ];

  return (
    <nav
      aria-label="Dashboard"
      className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm lg:sticky lg:top-24 lg:flex-col lg:self-start lg:overflow-visible"
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
              "flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition",
              active ? "bg-indigo-600 text-white" : "text-slate-700 hover:bg-slate-100"
            )}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}