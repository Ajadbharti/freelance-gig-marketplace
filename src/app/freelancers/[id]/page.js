import { Suspense } from "react";
import FreelancerProfile from "@/components/freelancers/FreelancerProfile";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

export const metadata = {
  title: "Audited Specialist Profile | GigCraft",
};

export function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10" role="status" aria-label="Loading profile">
      <div className="flex items-center gap-5">
        <LoadingSkeleton className="h-24 w-24 rounded-full" />
        <div className="flex-1 space-y-3">
          <LoadingSkeleton className="h-8 w-1/3" />
          <LoadingSkeleton className="h-4 w-1/2" />
        </div>
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <LoadingSkeleton className="h-64 w-full" />
        <LoadingSkeleton className="h-64 w-full" />
      </div>
    </div>
  );
}

export default function FreelancerPage({ params }) {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <FreelancerProfile params={params} />
    </Suspense>
  );
}
