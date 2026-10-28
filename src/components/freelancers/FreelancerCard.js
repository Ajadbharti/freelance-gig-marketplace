"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { useMarketplace } from "@/context/MarketplaceContext";
import SafeImage from "@/components/ui/SafeImage";
import RatingStars from "@/components/ui/RatingStars";
import PriceDisplay from "@/components/ui/PriceDisplay";

export default function FreelancerCard({ freelancer }) {
  const { getFreelancerRating } = useMarketplace();
  const { average, count } = getFreelancerRating(freelancer.id);

  return (
    <Link
      href={`/freelancers/${freelancer.id}`}
      className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      <div className="flex items-center gap-3">
        <SafeImage src={freelancer.avatar} alt="" className="h-14 w-14 rounded-full object-cover" />
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-slate-900 transition group-hover:text-indigo-600">
            {freelancer.name}
          </h3>
          {freelancer.location && (
            <p className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{freelancer.location}</span>
            </p>
          )}
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-slate-600">{freelancer.headline}</p>

      <RatingStars className="mt-3" rating={average} count={count > 0 ? count : undefined} showNumber />

      <div className="mt-3 flex flex-wrap gap-1.5">
        {freelancer.skills.slice(0, 3).map((skill) => (
          <span key={skill} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
        <span>{freelancer.completedOrders} orders done</span>
        <PriceDisplay price={freelancer.startingPrice} size="sm" label="From" />
      </div>
    </Link>
  );
}