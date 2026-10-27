"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RatingStars({
  rating = 0,
  count,
  size = 16,
  showNumber = false,
  onChange,
  className,
}) {
  const [hover, setHover] = useState(0);
  const interactive = typeof onChange === "function";
  const shown = interactive && hover ? hover : Math.round(rating);

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <div
        className="flex items-center"
        role={interactive ? "radiogroup" : "img"}
        aria-label={interactive ? "Select a rating" : `Rated ${rating} out of 5`}
      >
        {[1, 2, 3, 4, 5].map((value) => {
          const star = (
            <Star
              width={size}
              height={size}
              className={cn(value <= shown ? "fill-amber-400 text-amber-400" : "text-slate-300")}
            />
          );
          return interactive ? (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={Math.round(rating) === value}
              aria-label={`${value} star${value > 1 ? "s" : ""}`}
              onClick={() => onChange(value)}
              onMouseEnter={() => setHover(value)}
              onMouseLeave={() => setHover(0)}
              className="rounded p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              {star}
            </button>
          ) : (
            <span key={value}>{star}</span>
          );
        })}
      </div>
      {showNumber && (
        <span className="text-sm font-semibold text-slate-800">
          {rating ? Number(rating).toFixed(1) : "New"}
        </span>
      )}
      {typeof count === "number" && <span className="text-sm text-slate-500">({count})</span>}
    </div>
  );
}