"use client";

import SavedGigCard from "./SavedGigCard";

export default function SavedGigsGrid({
  gigs = [],
  onRemove,
  onContact,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {gigs.map((gig) => (
        <SavedGigCard
          key={gig.id}
          gig={gig}
          onRemove={onRemove}
          onContact={onContact}
        />
      ))}
    </div>
  );
}
