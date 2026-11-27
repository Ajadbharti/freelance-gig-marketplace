"use client";

import Link from "next/link";
import { Zap } from "lucide-react";

export default function AuthHeader({ actionText = "Create an account", actionHref = "/register" }) {
  return (
    <header className="flex items-center justify-between gap-4">
      {/* Brand Logo */}
      <Link
        href="/"
        className="group inline-flex items-center gap-2.5 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 transition"
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25 group-hover:scale-105 transition-transform duration-200">
          <Zap className="w-5 h-5 fill-current" />
        </span>
        <span className="font-headline text-2xl font-bold tracking-tight text-slate-900">
          Gig<span className="text-violet-600">Market</span>
        </span>
      </Link>

      {/* Top right secondary link */}
      <Link
        href={actionHref}
        className="font-sans text-xs sm:text-sm font-semibold text-violet-600 hover:text-violet-700 hover:underline transition"
      >
        {actionText}
      </Link>
    </header>
  );
}
