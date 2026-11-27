"use client";

import { useState } from "react";
import ClientDashboardSidebar from "./ClientDashboardSidebar";
import ClientDashboardHeader from "./ClientDashboardHeader";
import ClientWelcomeBanner from "./ClientWelcomeBanner";
import ClientStatsCards from "./ClientStatsCards";
import ClientRecentOrders from "./ClientRecentOrders";
import ClientSavedGigs from "./ClientSavedGigs";
import ClientRecentMessages from "./ClientRecentMessages";
import ClientRecommendedGigs from "./ClientRecommendedGigs";
import ClientAccountOverview from "./ClientAccountOverview";

export default function ClientDashboardView() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("overview");

  function handleNavClick(navId) {
    setActiveNav(navId);
    if (navId === "orders") {
      const el = document.getElementById("recent-orders-section");
      el?.scrollIntoView({ behavior: "smooth" });
    } else if (navId === "saved") {
      const el = document.getElementById("saved-gigs");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex selection:bg-violet-500/20 selection:text-violet-900">
      
      {/* 1. Left Sidebar Navigation */}
      <ClientDashboardSidebar
        activeNav={activeNav}
        onNavClick={handleNavClick}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Layout Area (Offset by sidebar width on lg screens) */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        
        {/* Top Header */}
        <ClientDashboardHeader
          onOpenMobile={() => setMobileSidebarOpen(true)}
        />

        {/* Dashboard Main Scrollable Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
          
          {/* 3. Welcome Section Banner */}
          <ClientWelcomeBanner />

          {/* 4. Four Statistics Cards */}
          <ClientStatsCards />

          {/* Grid Layout: Main Activity & Side Info */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 8 Columns */}
            <div className="lg:col-span-8 space-y-8">
              {/* 5. Recent Orders Table */}
              <div id="recent-orders-section">
                <ClientRecentOrders />
              </div>

              {/* 6. Saved Gigs */}
              <ClientSavedGigs />

              {/* 8. Recommended Gigs */}
              <ClientRecommendedGigs />
            </div>

            {/* Right 4 Columns */}
            <aside className="lg:col-span-4 space-y-8">
              {/* 9. Account Overview Card */}
              <ClientAccountOverview />

              {/* 7. Recent Messages List */}
              <ClientRecentMessages />
            </aside>

          </div>

        </main>

        {/* Mini Clean Dashboard Footer */}
        <footer className="py-6 px-8 border-t border-slate-200/80 bg-white/70 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 GigMarket Inc. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span>Escrow Protected</span>
            <span>·</span>
            <span>Priority Support</span>
            <span>·</span>
            <span>v2.4 Platform Release</span>
          </div>
        </footer>

      </div>

    </div>
  );
}
