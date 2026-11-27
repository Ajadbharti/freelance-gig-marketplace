"use client";

import Link from "next/link";
import { CheckCircle2, CreditCard, ShieldCheck, User, Wallet, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/ToastProvider";

export default function ClientAccountOverview() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const clientName = user?.name || "John Doe";
  const clientEmail = user?.email || "john.doe@company.io";
  const initials = clientName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "JD";

  function handleDeposit() {
    showToast("Opening escrow deposit checkout modal...", "info");
  }

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-6">
      {/* Profile Header */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3.5">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-headline text-xl font-bold flex items-center justify-center shadow-md">
            {initials}
          </div>
          <div>
            <h3 className="font-headline text-lg font-bold text-slate-900">
              {clientName}
            </h3>
            <p className="text-xs text-slate-500">{clientEmail}</p>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-0.5">
              <CheckCircle2 className="w-3 h-3" /> Verified Client Account
            </span>
          </div>
        </div>

        <Link
          href="/account"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          <User className="w-3.5 h-3.5 text-slate-500" />
          <span>Edit Profile</span>
        </Link>
      </div>

      {/* Escrow Balance Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
          <span className="flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-violet-600" />
            <span>Escrow Trust Balance</span>
          </span>
          <span className="text-emerald-600 font-bold">100% Protected</span>
        </div>

        <div className="flex items-baseline justify-between">
          <div>
            <span className="font-headline text-2xl font-extrabold text-slate-900">
              $1,200.00
            </span>
            <span className="text-[11px] text-slate-400 block">
              +$650 allocated in active orders
            </span>
          </div>

          <button
            type="button"
            onClick={handleDeposit}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-violet-600 text-white text-xs font-semibold shadow-xs hover:bg-violet-700 transition cursor-pointer"
          >
            <span>Deposit</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Security & Support Guarantee */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Bilateral escrow contract protection enabled on all purchases.</span>
      </div>
    </div>
  );
}
