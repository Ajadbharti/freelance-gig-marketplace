import { cn, formatPrice } from "@/lib/utils";

const SIZES = { sm: "text-base", md: "text-xl", lg: "text-3xl" };

export default function PriceDisplay({ price, label = "Starting at", size = "md", className }) {
  return (
    <div className={cn("flex items-baseline gap-1.5", className)}>
      {label && <span className="text-xs uppercase tracking-wide text-slate-500">{label}</span>}
      <span className={cn("font-bold text-slate-900", SIZES[size] ?? SIZES.md)}>{formatPrice(price)}</span>
    </div>
  );
}