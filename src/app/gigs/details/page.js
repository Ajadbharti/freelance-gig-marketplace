import { Suspense } from "react";
import GigDetailsView from "@/components/gig-details/GigDetailsView";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

export const metadata = {
  title: "I will design a modern and professional business logo | GigMarket",
  description:
    "Hire Elena Rostova, Top Rated Pro on GigMarket. Get custom minimalist business logo design with vector files, 3D mockups, and 100% milestone escrow protection.",
};

function GigDetailsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10" role="status" aria-label="Loading gig details">
      <LoadingSkeleton className="h-5 w-64 rounded-md" />
      <div className="mt-6 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-4">
          <LoadingSkeleton className="h-10 w-3/4 rounded-lg" />
          <LoadingSkeleton className="h-12 w-1/2 rounded-md" />
          <LoadingSkeleton className="aspect-[16/10] w-full rounded-2xl" />
        </div>
        <div className="lg:col-span-4">
          <LoadingSkeleton className="h-96 w-full rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

export default function GigStaticDetailsPage() {
  return (
    <Suspense fallback={<GigDetailsSkeleton />}>
      <GigDetailsView gigId="gig-1" />
    </Suspense>
  );
}
