import { Suspense } from "react";
import FreelancerProfile, { ProfileSkeleton } from "@/components/freelancers/FreelancerProfile";

export default function FreelancerPage({ params }) {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <FreelancerProfile params={params} />
    </Suspense>
  );
}