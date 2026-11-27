"use client";

import { useState, useMemo } from "react";
import ClientDashboardSidebar from "@/components/client-dashboard/ClientDashboardSidebar";
import ClientDashboardHeader from "@/components/client-dashboard/ClientDashboardHeader";
import SavedGigsHeader from "./SavedGigsHeader";
import SavedGigsFilters from "./SavedGigsFilters";
import SavedGigsGrid from "./SavedGigsGrid";
import SavedGigsEmptyState from "./SavedGigsEmptyState";
import SavedGigsPagination from "./SavedGigsPagination";
import ContactFreelancerModal from "./ContactFreelancerModal";
import { INITIAL_SAVED_GIGS } from "./savedGigsData";
import { useToast } from "@/components/ui/ToastProvider";

export default function ClientSavedGigsView() {
  const { showToast } = useToast();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Gigs Collection State
  const [savedGigs, setSavedGigs] = useState(INITIAL_SAVED_GIGS);
  const [contactGig, setContactGig] = useState(null);

  // Filters & Sorting State
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Remove from saved gigs
  function handleRemoveGig(gigId) {
    const gigToRemove = savedGigs.find((g) => g.id === gigId);
    setSavedGigs((prev) => prev.filter((g) => g.id !== gigId));

    showToast(
      `Removed "${gigToRemove?.title.slice(0, 30)}..." from saved favorites.`,
      "info"
    );
  }

  // Reset all filters
  function handleResetFilters() {
    setSearchQuery("");
    setCategoryFilter("all");
    setPriceFilter("all");
    setRatingFilter("all");
    setSortBy("recent");
    setCurrentPage(1);
  }

  // Filtered & Sorted Gigs
  const filteredGigs = useMemo(() => {
    let result = [...savedGigs];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          g.freelancer.name.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q)
      );
    }

    // Category
    if (categoryFilter !== "all") {
      result = result.filter((g) => g.category === categoryFilter);
    }

    // Price
    if (priceFilter === "under50") {
      result = result.filter((g) => g.startingPrice < 50);
    } else if (priceFilter === "50to100") {
      result = result.filter((g) => g.startingPrice >= 50 && g.startingPrice <= 100);
    } else if (priceFilter === "100to200") {
      result = result.filter((g) => g.startingPrice >= 100 && g.startingPrice <= 200);
    } else if (priceFilter === "200plus") {
      result = result.filter((g) => g.startingPrice >= 200);
    }

    // Rating
    if (ratingFilter === "5.0") {
      result = result.filter((g) => g.rating >= 5.0);
    } else if (ratingFilter === "4.8") {
      result = result.filter((g) => g.rating >= 4.8);
    }

    // Sort
    if (sortBy === "highest_rated") {
      result.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);
    } else if (sortBy === "price_low") {
      result.sort((a, b) => a.startingPrice - b.startingPrice);
    } else if (sortBy === "price_high") {
      result.sort((a, b) => b.startingPrice - a.startingPrice);
    }

    return result;
  }, [savedGigs, searchQuery, categoryFilter, priceFilter, ratingFilter, sortBy]);

  // Pagination Slice
  const totalPages = Math.ceil(filteredGigs.length / itemsPerPage) || 1;
  const paginatedGigs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredGigs.slice(start, start + itemsPerPage);
  }, [filteredGigs, currentPage, itemsPerPage]);

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex selection:bg-violet-500/20 selection:text-violet-900">
      
      {/* 1. Left Sidebar Navigation (active: saved) */}
      <ClientDashboardSidebar
        activeNav="saved"
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        
        {/* Top Header */}
        <ClientDashboardHeader
          onOpenMobile={() => setMobileSidebarOpen(true)}
        />

        {/* Saved Gigs Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          
          {/* 3. Page Header: Title, Subtitle, Count Pill, Explore More CTA */}
          <SavedGigsHeader totalCount={savedGigs.length} />

          {/* 4. Search & Filters Bar */}
          <SavedGigsFilters
            searchQuery={searchQuery}
            onSearchChange={(q) => {
              setSearchQuery(q);
              setCurrentPage(1);
            }}
            categoryFilter={categoryFilter}
            onCategoryChange={(c) => {
              setCategoryFilter(c);
              setCurrentPage(1);
            }}
            priceFilter={priceFilter}
            onPriceChange={(p) => {
              setPriceFilter(p);
              setCurrentPage(1);
            }}
            ratingFilter={ratingFilter}
            onRatingChange={(r) => {
              setRatingFilter(r);
              setCurrentPage(1);
            }}
            sortBy={sortBy}
            onSortChange={(s) => {
              setSortBy(s);
              setCurrentPage(1);
            }}
            onResetFilters={handleResetFilters}
            totalResults={filteredGigs.length}
          />

          {/* 5. Saved Gigs Grid OR 7. Empty State */}
          {paginatedGigs.length > 0 ? (
            <div className="space-y-6">
              <SavedGigsGrid
                gigs={paginatedGigs}
                onRemove={handleRemoveGig}
                onContact={(gig) => setContactGig(gig)}
              />

              {/* 8. Pagination */}
              <SavedGigsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={filteredGigs.length}
                onPageChange={(p) => setCurrentPage(p)}
                onItemsPerPageChange={(limit) => {
                  setItemsPerPage(limit);
                  setCurrentPage(1);
                }}
              />
            </div>
          ) : (
            <SavedGigsEmptyState
              isFiltered={
                searchQuery.trim() !== "" ||
                categoryFilter !== "all" ||
                priceFilter !== "all" ||
                ratingFilter !== "all" ||
                sortBy !== "recent"
              }
              onResetFilters={handleResetFilters}
            />
          )}

        </main>

        {/* Dashboard Footer */}
        <footer className="py-6 px-8 border-t border-slate-200/80 bg-white/70 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 GigMarket Inc. Bookmarked talent services with verified escrow protection.</span>
          <div className="flex items-center gap-4">
            <span>Escrow Protected</span>
            <span>·</span>
            <span>Zero Booking Fee</span>
            <span>·</span>
            <span>Direct Specialist Communication</span>
          </div>
        </footer>

      </div>

      {/* 6. Contact Freelancer Modal */}
      {contactGig && (
        <ContactFreelancerModal
          gig={contactGig}
          onClose={() => setContactGig(null)}
        />
      )}

    </div>
  );
}
