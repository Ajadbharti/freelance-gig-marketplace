import { cn } from "@/lib/utils";

export default function LoadingSkeleton({ className }) {
  return <div aria-hidden="true" className={cn("animate-pulse rounded-lg bg-slate-200", className)} />;
}

export function GigCardSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <LoadingSkeleton className="h-44 rounded-none" />
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