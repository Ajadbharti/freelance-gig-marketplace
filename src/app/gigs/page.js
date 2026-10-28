import { Suspense } from "react";
import GigsExplorer from "@/components/gigs/GigsExplorer";
import { GigGridSkeleton } from "@/components/ui/LoadingSkeleton";

export const metadata = {
  title: "Explore gigs | GigNest",
};

export default function GigsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Suspense fallback={<GigGridSkeleton count={6} />}>
        <GigsExplorer />
      </Suspense>
    </div>
  );
}