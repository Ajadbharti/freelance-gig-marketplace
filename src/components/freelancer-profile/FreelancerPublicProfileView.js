"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import HomeNavbar from "@/components/home/HomeNavbar";
import HomeFooter from "@/components/home/HomeFooter";
import FreelancerProfileHeader from "./FreelancerProfileHeader";
import FreelancerSkills from "./FreelancerSkills";
import FreelancerPortfolio from "./FreelancerPortfolio";
import FreelancerPublishedGigs from "./FreelancerPublishedGigs";
import FreelancerExperienceEducation from "./FreelancerExperienceEducation";
import FreelancerReviewsSection from "./FreelancerReviewsSection";
import FreelancerContactCard from "./FreelancerContactCard";

export default function FreelancerPublicProfileView({ freelancerId = "alex-morgan" }) {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Freelancers", href: "/explore?type=freelancers" },
    { label: "Full Stack Web Development", href: "/explore?category=web-development" },
    { label: "Alex Morgan", href: null, current: true },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-violet-500/20 selection:text-violet-900">
      {/* 1. Header Navigation */}
      <HomeNavbar />

      {/* Main Page Layout Container */}
      <main className="flex-1 bg-slate-50/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
          
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="py-2">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm font-sans text-slate-500">
              {breadcrumbItems.map((item, index) => (
                <li key={item.label} className="flex items-center gap-1.5">
                  {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
                  {item.current ? (
                    <span className="font-semibold text-slate-900">{item.label}</span>
                  ) : (
                    <Link
                      href={item.href || "#"}
                      className="hover:text-violet-600 transition flex items-center gap-1"
                    >
                      {index === 0 && <Home className="w-3.5 h-3.5" />}
                      <span>{item.label}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          {/* 2. Freelancer Profile Header Banner */}
          <FreelancerProfileHeader />

          {/* Main 2-Column Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start pt-4">
            
            {/* LEFT COLUMN: Main Details (8 Cols) */}
            <div className="lg:col-span-8 space-y-12">
              {/* 3. Skills and Expertise */}
              <FreelancerSkills />

              {/* 4. Portfolio Showcase */}
              <FreelancerPortfolio />

              {/* 5. Published Gigs */}
              <FreelancerPublishedGigs />

              {/* 6 & 7. Work Experience Timeline, Education & Certifications */}
              <FreelancerExperienceEducation />

              {/* 8. Client Reviews Breakdown & Cards */}
              <FreelancerReviewsSection />
            </div>

            {/* RIGHT COLUMN: Contact Card & Quick Inquiry (4 Cols) */}
            <aside className="lg:col-span-4 space-y-6">
              {/* 9. Contact Section */}
              <FreelancerContactCard />
            </aside>

          </div>

        </div>
      </main>

      {/* 10. Footer */}
      <HomeFooter />
    </div>
  );
}
