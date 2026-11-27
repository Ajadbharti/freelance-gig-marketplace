"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function GigBreadcrumb() {
  const items = [
    { label: "Home", href: "/" },
    { label: "Graphics & Design", href: "/explore?category=graphics-design" },
    { label: "Logo Design", href: "/explore?category=graphics-design&sub=logo-design" },
    { label: "Gig Details", href: null, current: true },
  ];

  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm font-sans text-slate-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
              {item.current ? (
                <span className="font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-none">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href || "#"}
                  className="hover:text-violet-600 transition flex items-center gap-1"
                >
                  {index === 0 && <Home className="w-3.5 h-3.5" />}
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
