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
        "flex w-full items-center border border-[#6e7a73] bg-white transition focus-within:border-2 focus-within:border-[#0b1c30]",
        className
      )}
    >
      <Search className={cn("ml-3 shrink-0 text-[#3e4943]", large ? "h-5 w-5" : "h-4 w-4")} />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-label="Search gigs"
        className={cn(
          "min-w-0 flex-1 bg-transparent px-3 font-sans text-sm text-[#0b1c30] placeholder:text-slate-400 focus:outline-none",
          large ? "py-3 text-base" : "py-2"
        )}
      />
      <button
        type="submit"
        className={cn(
          "bg-[#005d42] font-mono font-bold uppercase tracking-wider text-white transition hover:bg-[#047857]",
          large ? "px-6 py-3 text-sm" : "px-4 py-2 text-xs"
        )}
      >
        Search
      </button>
    </form>
  );
}
