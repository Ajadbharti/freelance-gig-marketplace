"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useMarketplace } from "@/context/MarketplaceContext";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

function ShellSkeleton() {
  return (
    <div
      className="mx-auto max-w-7xl px-4 py-8 lg:grid lg:grid-cols-[240px_1fr] lg:gap-8 font-mono text-xs"
      role="status"
      aria-label="Loading dashboard"
    >
      <LoadingSkeleton className="h-48 w-full" />
      <div className="mt-6 space-y-4 lg:mt-0">
        <LoadingSkeleton className="h-9 w-1/3" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <LoadingSkeleton key={i} className="h-28 w-full" />
          ))}
        </div>
        <LoadingSkeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

function Notice({ title, text, href, linkLabel }) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center font-mono">
      <ShieldAlert className="h-14 w-14 text-slate-300" />
      <h1 className="mt-4 font-serif text-3xl font-bold text-slate-900">{title}</h1>
      <p className="mt-2 text-xs text-slate-600">{text}</p>
      <Link
        href={href}
        className="mt-6 bg-[#0a5c36] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#084c2c]"
      >
        {linkLabel}
      </Link>
    </div>
  );
}

export default function DashboardShell({ role, path, title, subtitle, actions, children }) {
  const { user, hydrated } = useAuth();
  const { hydrated: dataReady } = useMarketplace();

  if (!hydrated || !dataReady) return <ShellSkeleton />;

  if (!user) {
    return (
      <Notice
        title="Authentication Required"
        text="You must be verified on the node network to access this workspace."
        href={`/login?next=${encodeURIComponent(path)}`}
        linkLabel="Sign In to Node"
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-[240px_1fr] lg:gap-8">
        <DashboardSidebar role={user.role} userId={user.id} />
        <div className="mt-6 min-w-0 lg:mt-0">
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-[#0a5c36]">
                <span className="text-[10px]">■</span>
                <span className="font-bold uppercase tracking-wider">
                  WORKSPACE MODE: {user.role === "freelancer" ? "BUILDER NODE" : "BUYER ESCROW CONSOLE"}
                </span>
              </div>
              <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                {title}
              </h1>
              {subtitle && <p className="mt-1 font-mono text-xs text-slate-600">{subtitle}</p>}
            </div>
            {actions}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
