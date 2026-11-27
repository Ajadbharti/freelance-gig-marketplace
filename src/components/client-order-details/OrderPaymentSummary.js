"use client";

import { useState } from "react";
import { Check, Copy, CreditCard, DollarSign, Lock, ShieldCheck } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

export default function OrderPaymentSummary({ payment }) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  function handleCopyTxn() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(payment.transactionId);
      setCopied(true);
      showToast("Transaction ID copied to clipboard", "info");
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-5">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="font-headline text-sm font-bold uppercase tracking-wider text-slate-400 font-sans">
          Payment Breakdown
        </h3>
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-100">
          <Lock className="w-3 h-3 text-violet-600" />
          <span>Escrow Secured</span>
        </span>
      </div>

      {/* Financial Breakdown Table */}
      <div className="space-y-2.5 text-xs">
        <div className="flex items-center justify-between text-slate-600">
          <span>Package Subtotal</span>
          <span className="font-semibold text-slate-900">${payment.packagePrice.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between text-slate-600">
          <span>Additional Services</span>
          <span className="font-semibold text-slate-900">${payment.additionalServices.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between text-slate-600">
          <span>GigMarket Platform Fee</span>
          <span className="text-emerald-600 font-semibold">Included ($0.00)</span>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between font-headline text-sm font-bold text-slate-900">
          <span>Total Paid</span>
          <span className="text-base text-violet-900 font-extrabold">${payment.totalPaid.toFixed(2)} USD</span>
        </div>
      </div>

      {/* Transaction & Payment Method Details */}
      <div className="space-y-2 rounded-2xl bg-slate-50 border border-slate-100 p-3.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-sans text-[11px]">Payment Method</span>
          <span className="font-semibold text-slate-800 flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5 text-slate-500" />
            <span>{payment.paymentMethod}</span>
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400 font-sans text-[11px]">Transaction ID</span>
          <div className="flex items-center gap-1">
            <span className="font-mono text-[11px] text-slate-700 font-semibold">{payment.transactionId}</span>
            <button
              type="button"
              onClick={handleCopyTxn}
              className="text-slate-400 hover:text-violet-600 p-0.5"
              title="Copy Transaction ID"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-slate-400 font-sans text-[11px]">Status</span>
          <span className="inline-flex items-center gap-1 font-bold text-[11px] text-emerald-700">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{payment.status}</span>
          </span>
        </div>
      </div>

      {/* Escrow Guarantee Statement */}
      <p className="text-[11px] text-slate-400 leading-normal text-center">
        GigMarket holds payment in escrow until you approve final deliverables.
      </p>
    </div>
  );
}
