import { Suspense } from "react";
import GigDetails from "@/components/gigs/GigDetails";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

export const metadata = {
  title: "Specification & Escrow Contract Details | GigCraft",
};

export function GigDetailsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10" role="status" aria-label="Loading gig spec">
      <LoadingSkeleton className="h-5 w-64" />
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <LoadingSkeleton className="h-9 w-3/4" />
          <LoadingSkeleton className="h-10 w-1/3" />
          <LoadingSkeleton className="aspect-[16/10] w-full" />
        </div>
        <LoadingSkeleton className="h-72 w-full" />
      </div>
    </div>
  );
}

export default function GigPage({ params }) {
  return (
    <Suspense fallback={<GigDetailsSkeleton />}>
      <GigDetails params={params} />
    </Suspense>
  );
}
