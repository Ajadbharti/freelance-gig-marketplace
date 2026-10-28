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
      className="mx-auto max-w-7xl px-4 py-8 lg:grid lg:grid-cols-[220px_1fr] lg:gap-8"
      role="status"
      aria-label="Loading dashboard"
    >
      <LoadingSkeleton className="h-32 w-full" />
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
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <ShieldAlert className="h-14 w-14 text-slate-300" />
      <h1 className="mt-4 text-2xl font-bold text-slate-900">{title}</h1>
      <p className="mt-2 text-slate-600">{text}</p>
      <Link
        href={href}
        className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
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
        title="Please log in"
        text="You need to log in to view this dashboard."
        href={`/login?next=${encodeURIComponent(path)}`}
        linkLabel="Go to login"
      />
    );
  }

  if (user.role !== role) {
    const ownDashboard = user.role === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client";
    return (
      <Notice
        title="This area is not for your account type"
        text={`This page is only for ${role} accounts. You are logged in as a ${user.role}.`}
        href={ownDashboard}
        linkLabel="Go to my dashboard"
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:grid lg:grid-cols-[220px_1fr] lg:gap-8">
      <DashboardSidebar role={role} userId={user.id} />
      <div className="mt-6 min-w-0 lg:mt-0">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h1>
            {subtitle && <p className="mt-1 text-slate-600">{subtitle}</p>}
          </div>
          {actions}
        </div>
        {children}
      </div>
    </div>
  );
}