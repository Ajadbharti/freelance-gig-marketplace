"use client";

import Link from "next/link";
import { ArrowLeft, Check, Copy, ExternalLink, HelpCircle, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";
import { getStatusBadgeConfig } from "@/components/client-orders/ClientOrderTable";

export default function OrderDetailsHeader({ order }) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const statusCfg = getStatusBadgeConfig(order.status);
  const StatusIcon = statusCfg.icon;

  function handleCopyOrderId() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(order.id);
      setCopied(true);
      showToast(`Copied #${order.id} to clipboard`, "info");
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="space-y-4 pb-2 border-b border-slate-200/80">
      {/* 1. Breadcrumbs & Back Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 font-sans">
          <Link
            href="/dashboard/client"
            className="hover:text-violet-600 transition"
          >
            Dashboard
          </Link>
          <span className="text-slate-300">/</span>
          <Link
            href="/orders"
            className="hover:text-violet-600 transition"
          >
            My Orders
          </Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-bold">Order Details</span>
        </nav>

        {/* Back to My Orders CTA */}
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-violet-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs hover:bg-slate-50 transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to My Orders</span>
        </Link>
      </div>

      {/* 2. Title, Order ID chip, Status Badge & Escrow Protection */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-headline text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Order Details
            </h1>

            {/* Order ID Pill with Copy button */}
            <div className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-mono font-bold text-slate-800 shadow-2xs">
              <span>#{order.id}</span>
              <button
                type="button"
                onClick={handleCopyOrderId}
                className="text-slate-400 hover:text-violet-600 transition p-0.5"
                title="Copy Order ID"
                aria-label="Copy Order ID"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Status Badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusCfg.color}`}
            >
              <StatusIcon className="w-3.5 h-3.5 shrink-0" />
              <span>{statusCfg.label}</span>
            </span>
          </div>

          <p className="font-sans text-xs sm:text-sm text-slate-500">
            Ordered on <strong className="text-slate-700 font-semibold">{order.orderDate}</strong> · Managed under GigMarket Escrow Protection
          </p>
        </div>

        {/* Escrow Guarantee Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-sans self-start md:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold block text-[11px] uppercase tracking-wider text-emerald-900">
              100% Escrow Protected
            </span>
            <span className="text-[11px] text-emerald-700">
              Funds disbursed only upon your explicit approval
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
