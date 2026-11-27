"use client";

import Link from "next/link";
import { Calendar, CheckCircle2, Clock, DollarSign, ExternalLink, Package, ShieldCheck } from "lucide-react";
import { getStatusBadgeConfig } from "@/components/client-orders/ClientOrderTable";

export default function OrderSummaryCard({ order }) {
  const statusCfg = getStatusBadgeConfig(order.status);
  const StatusIcon = statusCfg.icon;

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        
        {/* Left: Thumbnail & Gig Title + Package */}
        <div className="flex items-start gap-4 sm:gap-5 flex-1 min-w-0">
          <div className="relative h-20 w-24 sm:h-24 sm:w-28 shrink-0 overflow-hidden rounded-2xl border border-slate-200 shadow-2xs">
            <img
              src={order.gig.cover}
              alt={order.gig.title}
              className="h-full w-full object-cover"
            />
            <span className="absolute bottom-1 right-1 rounded-md bg-slate-950/70 backdrop-blur-xs px-1.5 py-0.5 text-[9px] font-mono font-bold text-white uppercase">
              {order.gig.subcategory}
            </span>
          </div>

          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <span>{order.gig.category}</span>
              <span>·</span>
              <span className="text-violet-600 font-bold">{order.gig.package}</span>
            </div>

            <h2 className="font-headline text-base sm:text-lg font-bold text-slate-900 leading-snug line-clamp-2">
              {order.gig.title}
            </h2>

            {/* Freelancer snippet */}
            <div className="flex items-center gap-2 pt-0.5">
              <img
                src={order.freelancer.avatar}
                alt={order.freelancer.name}
                className="h-6 w-6 rounded-full object-cover border border-slate-200"
              />
              <span className="text-xs text-slate-600">
                Provided by <strong className="text-slate-900 font-semibold">{order.freelancer.name}</strong>
              </span>
              <span className="text-[10px] font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-100">
                {order.freelancer.level}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Key Metrics Strip (Package, Order Date, Delivery, Total Amount) */}
        <div className="w-full lg:w-auto grid grid-cols-2 sm:grid-cols-4 lg:flex lg:items-center gap-4 sm:gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
          
          {/* Selected Package */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans block">
              Tier
            </span>
            <p className="font-sans text-xs sm:text-sm font-bold text-slate-800">
              {order.gig.package}
            </p>
          </div>

          {/* Order Date */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans block">
              Ordered On
            </span>
            <p className="font-sans text-xs sm:text-sm font-semibold text-slate-700">
              {order.orderDate.split(",")[0]}
            </p>
          </div>

          {/* Delivery Date */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-sans block">
              Delivery Date
            </span>
            <p className="font-sans text-xs sm:text-sm font-semibold text-emerald-700">
              {order.deliveryDate.split(",")[0]}
            </p>
          </div>

          {/* Total Amount */}
          <div className="space-y-1 bg-violet-50/70 p-3 rounded-2xl border border-violet-100 min-w-[110px] text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700 font-sans block">
              Total Escrowed
            </span>
            <p className="font-headline text-lg sm:text-xl font-extrabold text-violet-900">
              ${order.amount}.00
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
