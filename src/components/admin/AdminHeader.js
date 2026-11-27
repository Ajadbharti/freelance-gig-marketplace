"use client";

import { RefreshCw, Search, ShieldCheck } from "lucide-react";

export default function AdminHeader({ title, subtitle, onRefresh, isRefreshing }) {
  return (
    <div className="border border-[#e5e7eb] bg-white p-5 shadow-[3px_3px_0px_#0b1c30] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-[#005d42]">
          <span className="h-2 w-2 bg-[#005d42]" />
          <span>PLATFORM GOVERNANCE CONSOLE</span>
        </div>
        <h1 className="mt-1 font-headline text-2xl font-bold uppercase tracking-tight text-[#0b1c30] sm:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-0.5 text-xs text-[#3e4943] font-sans">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 border border-[#0b1c30] bg-white px-3.5 py-2 font-bold uppercase tracking-wider text-[#0b1c30] hover:bg-[#eff4ff] active:translate-x-[1px] active:translate-y-[1px] shadow-[2px_2px_0px_#0b1c30] transition disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>SYNC TELEMETRY</span>
        </button>
      </div>
    </div>
  );
}
