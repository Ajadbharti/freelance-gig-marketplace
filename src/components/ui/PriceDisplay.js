import { cn, formatPrice } from "@/lib/utils";

const SIZES = { sm: "text-base", md: "text-xl", lg: "text-3xl" };

export default function PriceDisplay({ price, label = "Starting at", size = "md", className }) {
  return (
    <div className={cn("flex items-baseline gap-1.5", className)}>
      {label && <span className="font-mono text-xs uppercase tracking-wide text-[#3e4943]">{label}</span>}
      <span className={cn("font-headline font-bold text-[#0b1c30]", SIZES[size] ?? SIZES.md)}>{formatPrice(price)}</span>
    </div>
  );
}
