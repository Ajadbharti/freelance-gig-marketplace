"use client";

import { Briefcase, UserCheck } from "lucide-react";

export default function RoleSelector({ role, onRoleChange }) {
  return (
    <div
      className="p-1 rounded-xl bg-slate-100/80 border border-slate-200/80 grid grid-cols-2 gap-1"
      role="tablist"
      aria-label="Account role selector"
    >
      <button
        type="button"
        role="tab"
        aria-selected={role === "client"}
        onClick={() => onRoleChange("client")}
        className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 ${
          role === "client"
            ? "bg-white text-slate-900 shadow-sm border border-slate-200/80"
            : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
        }`}
      >
        <Briefcase className={`w-4 h-4 ${role === "client" ? "text-violet-600" : "text-slate-400"}`} />
        <span>I&apos;m hiring talent</span>
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={role === "freelancer"}
        onClick={() => onRoleChange("freelancer")}
        className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 ${
          role === "freelancer"
            ? "bg-white text-slate-900 shadow-sm border border-slate-200/80"
            : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
        }`}
      >
        <UserCheck className={`w-4 h-4 ${role === "freelancer" ? "text-violet-600" : "text-slate-400"}`} />
        <span>I&apos;m a freelancer</span>
      </button>
    </div>
  );
}
