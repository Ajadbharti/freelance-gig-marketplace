import { cn } from "@/lib/utils";

export default function LoadingSkeleton({ className }) {
  return <div aria-hidden="true" className={cn("animate-pulse bg-[#eff4ff]", className)} />;
}

export function GigCardSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="overflow-hidden border border-[#e5e7eb] bg-white shadow-[3px_3px_0px_#0b1c30]"
    >
      <LoadingSkeleton className="h-44 w-full" />
      <div className="space-y-3 p-4">
        <LoadingSkeleton className="h-4 w-1/3" />
        <LoadingSkeleton className="h-4 w-full" />
        <LoadingSkeleton className="h-4 w-4/5" />
        <LoadingSkeleton className="h-6 w-1/4" />
      </div>
    </div>
  );
}

export function GigGridSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <GigCardSkeleton key={i} />
      ))}
    </div>
  );
}
