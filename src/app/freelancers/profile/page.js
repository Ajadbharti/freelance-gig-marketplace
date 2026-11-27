import { Suspense } from "react";
import FreelancerPublicProfileView from "@/components/freelancer-profile/FreelancerPublicProfileView";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

export const metadata = {
  title: "Alex Morgan — Full Stack Web Developer | GigMarket",
  description:
    "Hire Alex Morgan on GigMarket. Top Rated Pro specializing in React, Next.js, Node.js, and MongoDB with 142+ delivered projects under deterministic milestone escrow.",
};

function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10" role="status" aria-label="Loading profile">
      <div className="rounded-3xl bg-white p-8 border border-slate-200 flex items-center gap-6">
        <LoadingSkeleton className="h-28 w-28 rounded-3xl" />
        <div className="flex-1 space-y-3">
          <LoadingSkeleton className="h-8 w-1/3 rounded-lg" />
          <LoadingSkeleton className="h-5 w-1/4 rounded-md" />
          <LoadingSkeleton className="h-4 w-1/2 rounded-md" />
        </div>
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          <LoadingSkeleton className="h-44 w-full rounded-2xl" />
          <LoadingSkeleton className="h-72 w-full rounded-2xl" />
        </div>
        <div className="lg:col-span-4">
          <LoadingSkeleton className="h-96 w-full rounded-3xl" />
        </div>
      </div>
    </div>
  );
}

export default function FreelancerStaticProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <FreelancerPublicProfileView freelancerId="alex-morgan" />
    </Suspense>
  );
}
