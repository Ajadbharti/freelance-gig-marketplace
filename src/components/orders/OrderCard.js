"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { useMarketplace } from "@/context/MarketplaceContext";
import { findUserById } from "@/lib/users";
import SafeImage from "@/components/ui/SafeImage";
import StatusBadge from "@/components/ui/StatusBadge";
import { formatDate, formatPrice } from "@/lib/utils";

export default function OrderCard({ order, viewer, children }) {
  const { getOrderGig, getFreelancer } = useMarketplace();
  const gig = getOrderGig(order);

  const isClientView = viewer === "client";
  const otherLabel = isClientView ? "Freelancer" : "Client";
  const otherName = isClientView
    ? getFreelancer(order.freelancerId)?.name ?? "Unknown freelancer"
    : findUserById(order.clientId)?.name ?? "Unknown client";

  const latest = order.timeline[order.timeline.length - 1];

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 p-4 sm:flex-row">
        <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:w-44">
          <SafeImage src={gig?.image} alt="" className="h-full w-full object-cover" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <p className="text-xs font-medium text-slate-500">Order #{order.id.slice(-6).toUpperCase()}</p>
            <StatusBadge status={order.status} />
          </div>
          <h3 className="mt-1 line-clamp-2 font-semibold text-slate-900">
            {gig?.title ?? "This gig is no longer available"}
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            {otherLabel}: <span className="font-medium text-slate-800">{otherName}</span>
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" /> {formatDate(order.createdAt)}
            </span>
            <span className="font-semibold text-slate-800">{formatPrice(order.price)}</span>
            {latest && <span>Latest: {latest.label}</span>}
          </div>
        </div>

        <div className="flex items-end sm:items-center">
          <Link
            href={`/orders/${order.id}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
          >
            View order <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {children && (
        <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 bg-slate-50 px-4 py-3 text-sm">
          {children}
        </div>
      )}
    </article>
  );
}