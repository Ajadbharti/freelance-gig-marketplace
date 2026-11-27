"use client";

import { useState } from "react";
import HomeNavbar from "@/components/home/HomeNavbar";
import HomeFooter from "@/components/home/HomeFooter";
import GigBreadcrumb from "./GigBreadcrumb";
import GigHeaderInfo from "./GigHeaderInfo";
import GigGallery from "./GigGallery";
import GigStickyOrderCard from "./GigStickyOrderCard";
import GigPricingPackages from "./GigPricingPackages";
import GigDescription from "./GigDescription";
import GigFreelancerProfile from "./GigFreelancerProfile";
import GigReviews from "./GigReviews";
import GigRelatedGigs from "./GigRelatedGigs";

export default function GigDetailsView({ gigId = "gig-1" }) {
  const [activePackageTier, setActivePackageTier] = useState("standard");

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-violet-500/20 selection:text-violet-900">
      {/* 1. Header Navigation */}
      <HomeNavbar />

      {/* Main Page Layout Container */}
      <main className="flex-1 bg-slate-50/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          
          {/* 2. Breadcrumb Navigation */}
          <GigBreadcrumb />

          {/* Main 2-Column Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start mt-2">
            
            {/* LEFT COLUMN: Main Gig Content (8 Cols) */}
            <div className="lg:col-span-8 space-y-8">
              {/* 3. Gig Information Headline & Meta */}
              <GigHeaderInfo />

              {/* 4. Gig Image Gallery */}
              <GigGallery />

              {/* Mobile-Only Package Selector */}
              <div className="block lg:hidden">
                <GigStickyOrderCard
                  activeTab={activePackageTier}
                  onTabChange={setActivePackageTier}
                />
              </div>

              {/* 6. About This Gig Narrative, Deliverables & FAQ */}
              <GigDescription />

              {/* 5. Pricing Packages (Side-by-Side Comparison Matrix) */}
              <GigPricingPackages
                activeTab={activePackageTier}
                onSelectPackage={setActivePackageTier}
              />

              {/* 7. About the Freelancer Profile */}
              <GigFreelancerProfile />

              {/* 8. Reviews and Ratings Breakdown */}
              <GigReviews />
            </div>

            {/* RIGHT COLUMN: Desktop Sticky Order Summary (4 Cols) */}
            <aside className="hidden lg:block lg:col-span-4 sticky top-24">
              <GigStickyOrderCard
                activeTab={activePackageTier}
                onTabChange={setActivePackageTier}
              />
            </aside>

          </div>

          {/* 9. Related Gigs Showcase */}
          <div className="mt-12">
            <GigRelatedGigs />
          </div>

        </div>
      </main>

      {/* Footer */}
      <HomeFooter />
    </div>
  );
}
