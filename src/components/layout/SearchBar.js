"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SearchBar({
  placeholder = "Search gigs, skills or freelancers",
  size = "md",
  className,
  onSearch,
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const large = size === "lg";

  function handleSubmit(e) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/gigs?q=${encodeURIComponent(q)}` : "/gigs");
    onSearch?.();
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className={cn(
        "flex w-full items-center overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100",
        className
      )}
    >
      <Search className={cn("ml-3 shrink-0 text-slate-400", large ? "h-5 w-5" : "h-4 w-4")} />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-label="Search gigs"
        className={cn(
          "min-w-0 flex-1 bg-transparent px-3 text-slate-900 placeholder:text-slate-400 focus:outline-none",
          large ? "py-4 text-base" : "py-2 text-sm"
        )}
      />
      <button
        type="submit"
        className={cn(
          "m-1 rounded-lg bg-indigo-600 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
          large ? "px-6 py-3 text-base" : "px-4 py-1.5 text-sm"
        )}
      >
        Search
      </button>
    </form>
  );
}