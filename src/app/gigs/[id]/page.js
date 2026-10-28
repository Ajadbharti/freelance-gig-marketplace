import { Suspense } from "react";
import GigDetails, { GigDetailsSkeleton } from "@/components/gigs/GigDetails";

export default function GigPage({ params }) {
  return (
    <Suspense fallback={<GigDetailsSkeleton />}>
      <GigDetails params={params} />
    </Suspense>
  );
}