"use client";

import { AlertCircle, CheckCircle2, Clock, ShoppingBag, XCircle } from "lucide-react";

export default function ClientOrderStats({
  stats = {
    total: 18,
    active: 4,
    completed: 12,
    cancelled: 2,
  },
}) {
  const cards = [
    {
      id: "total",
      label: "Total Orders",
      value: stats.total,
      badge: "Lifetime",
      badgeColor: "text-slate-700 bg-slate-100 border-slate-200",
      icon: ShoppingBag,
      iconColor: "text-violet-600 bg-violet-50 border-violet-100",
      subtext: "All orders placed",
    },
    {
      id: "active",
      label: "Active Orders",
      value: stats.active,
      badge: "In Progress",
      badgeColor: "text-violet-700 bg-violet-50 border-violet-200/60",
      icon: Clock,
      iconColor: "text-indigo-600 bg-indigo-50 border-indigo-100",
      subtext: "Funds locked in escrow",
    },
    {
      id: "completed",
      label: "Completed Orders",
      value: stats.completed,
      badge: "100% Satisfied",
      badgeColor: "text-emerald-700 bg-emerald-50 border-emerald-200/60",
      icon: CheckCircle2,
      iconColor: "text-emerald-600 bg-emerald-50 border-emerald-100",
      subtext: "Delivered & approved",
    },
    {
      id: "cancelled",
      label: "Cancelled Orders",
      value: stats.cancelled,
      badge: "Refunded",
      badgeColor: "text-rose-700 bg-rose-50 border-rose-200/60",
      icon: XCircle,
      iconColor: "text-rose-600 bg-rose-50 border-rose-100",
      subtext: "Returned to balance",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {cards.map((card) => {
        const IconComponent = card.icon;

        return (
          <div
            key={card.id}
            className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs hover:border-violet-300 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Card Header: Icon + Badge */}
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl border shadow-2xs ${card.iconColor}`}
                >
                  <IconComponent className="w-5 h-5" />
                </div>

                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border font-sans ${card.badgeColor}`}
                >
                  {card.badge}
                </span>
              </div>

              {/* Numerical Value & Label */}
              <div className="space-y-1 pt-1">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 font-sans">
                  {card.label}
                </p>
                <p className="font-headline text-3xl font-extrabold text-slate-900 tracking-tight">
                  {card.value}
                </p>
              </div>
            </div>

            {/* Sub-label description */}
            <p className="text-[11px] text-slate-500 pt-3 border-t border-slate-100 mt-3">
              {card.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
}
