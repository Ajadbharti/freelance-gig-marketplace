"use client";

import { useAuth } from "@/context/AuthContext";
import Landing from "@/components/home/Landing";
import MarketplaceHome from "@/components/home/MarketplaceHome";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

export default function Home() {
  const { user, hydrated } = useAuth();

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-7xl space-y-4 px-4 py-16" role="status" aria-label="Loading">
        <LoadingSkeleton className="h-10 w-2/3" />
        <LoadingSkeleton className="h-6 w-1/2" />
        <LoadingSkeleton className="h-64 w-full" />
      </div>
    );
  }

  return user ? <MarketplaceHome /> : <Landing />;
}