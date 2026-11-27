import HomeNavbar from "@/components/home/HomeNavbar";
import HeroSection from "@/components/home/HeroSection";
import PopularCategories from "@/components/home/PopularCategories";
import FeaturedGigs from "@/components/home/FeaturedGigs";
import TopFreelancers from "@/components/home/TopFreelancers";
import HowItWorks from "@/components/home/HowItWorks";
import CtaSection from "@/components/home/CtaSection";
import HomeFooter from "@/components/home/HomeFooter";

export const metadata = {
  title: "GigMarket — Freelance Gig Marketplace | Hire Top Talent & Sell Digital Services",
  description:
    "Discover skilled freelancers and quality services to bring your ideas to life. Protected by deterministic milestone escrow contracts on GigMarket.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-violet-500/20 selection:text-violet-900 flex flex-col">
      {/* 1. Header / Navigation */}
      <HomeNavbar />

      {/* Main Homepage Sections */}
      <main className="flex-1">
        {/* 2. Hero Section */}
        <HeroSection />

        {/* 3. Popular Categories */}
        <PopularCategories />

        {/* 4. Featured Gigs */}
        <FeaturedGigs />

        {/* 5. Top Freelancers */}
        <TopFreelancers />

        {/* 6. How GigMarket Works */}
        <HowItWorks />

        {/* 7. Call-to-Action Section */}
        <CtaSection />
      </main>

      {/* 8. Footer */}
      <HomeFooter />
    </div>
  );
}
