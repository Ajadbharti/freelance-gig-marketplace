import { Suspense } from "react";
import GigsExplorer from "@/components/gigs/GigsExplorer";
import { GigGridSkeleton } from "@/components/ui/LoadingSkeleton";

export const metadata = {
  title: "Explore Gigs | GigCraft",
  description: "Browse verified engineering, design, and architecture specs contracting under multi-signature deterministic escrow.",
};

export default function ExplorePage() {
  return (
    <Suspense fallback={<GigGridSkeleton count={6} />}>
      <GigsExplorer />
    </Suspense>
  );
}
