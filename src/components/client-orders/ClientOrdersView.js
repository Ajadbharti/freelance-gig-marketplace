"use client";

import { useState, useMemo } from "react";
import ClientDashboardSidebar from "@/components/client-dashboard/ClientDashboardSidebar";
import ClientDashboardHeader from "@/components/client-dashboard/ClientDashboardHeader";
import ClientOrdersHeader from "./ClientOrdersHeader";
import ClientOrderStats from "./ClientOrderStats";
import ClientOrderFilters from "./ClientOrderFilters";
import ClientOrderTable, { SAMPLE_ORDERS } from "./ClientOrderTable";
import ClientOrderPagination from "./ClientOrderPagination";
import ClientOrderEmptyState from "./ClientOrderEmptyState";

export default function ClientOrdersView() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Filter & Pagination States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Filter & Sort Logic
  const filteredOrders = useMemo(() => {
    let result = [...SAMPLE_ORDERS];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.gigTitle.toLowerCase().includes(q) ||
          o.freelancer.name.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((o) => o.status === statusFilter);
    }

    // Sort order
    if (sortBy === "highest") {
      result.sort((a, b) => b.amount - a.amount);
    } else if (sortBy === "lowest") {
      result.sort((a, b) => a.amount - b.amount);
    } else if (sortBy === "oldest") {
      result.reverse();
    }

    return result;
  }, [searchQuery, statusFilter, dateFilter, sortBy]);

  // Statistics Calculation
  const stats = useMemo(() => {
    const total = SAMPLE_ORDERS.length;
    const active = SAMPLE_ORDERS.filter(
      (o) => o.status === "In Progress" || o.status === "Delivered" || o.status === "Pending"
    ).length;
    const completed = SAMPLE_ORDERS.filter((o) => o.status === "Completed").length;
    const cancelled = SAMPLE_ORDERS.filter((o) => o.status === "Cancelled").length;

    return { total, active, completed, cancelled };
  }, []);

  // Pagination Slice
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  function handleResetFilters() {
    setSearchQuery("");
    setStatusFilter("all");
    setDateFilter("all");
    setSortBy("newest");
    setCurrentPage(1);
  }

  function handlePageChange(newPage) {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  }

  function handleItemsPerPageChange(newLimit) {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  }

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex selection:bg-violet-500/20 selection:text-violet-900">
      
      {/* 1. Left Sidebar Navigation (active: orders) */}
      <ClientDashboardSidebar
        activeNav="orders"
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area (Offset by sidebar width on lg screens) */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        
        {/* Top Header */}
        <ClientDashboardHeader
          onOpenMobile={() => setMobileSidebarOpen(true)}
        />

        {/* Orders Page Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          
          {/* 3. Page Header: Title, Subtitle, Explore Gigs Button */}
          <ClientOrdersHeader totalCount={stats.total} />

          {/* 4. Order Statistics: 4 Summary Cards */}
          <ClientOrderStats stats={stats} />

          {/* 5. Order Filters: Search, Status, Date & Sort */}
          <ClientOrderFilters
            searchQuery={searchQuery}
            onSearchChange={(q) => {
              setSearchQuery(q);
              setCurrentPage(1);
            }}
            statusFilter={statusFilter}
            onStatusChange={(s) => {
              setStatusFilter(s);
              setCurrentPage(1);
            }}
            dateFilter={dateFilter}
            onDateChange={(d) => {
              setDateFilter(d);
              setCurrentPage(1);
            }}
            sortBy={sortBy}
            onSortChange={(sb) => {
              setSortBy(sb);
              setCurrentPage(1);
            }}
            onResetFilters={handleResetFilters}
            totalResults={filteredOrders.length}
          />

          {/* 6. Orders Table OR 9. Empty State */}
          {paginatedOrders.length > 0 ? (
            <div className="space-y-4">
              <ClientOrderTable orders={paginatedOrders} />

              {/* 8. Pagination */}
              <ClientOrderPagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={filteredOrders.length}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
          ) : (
            <ClientOrderEmptyState
              isFiltered={
                searchQuery.trim() !== "" ||
                statusFilter !== "all" ||
                dateFilter !== "all" ||
                sortBy !== "newest"
              }
              onResetFilters={handleResetFilters}
            />
          )}

        </main>

        {/* Dashboard Footer */}
        <footer className="py-6 px-8 border-t border-slate-200/80 bg-white/70 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 GigMarket Inc. All orders protected by bilateral escrow milestones.</span>
          <div className="flex items-center gap-4">
            <span>Escrow Protected</span>
            <span>·</span>
            <span>Deterministic Releases</span>
            <span>·</span>
            <span>Priority Client Support</span>
          </div>
        </footer>

      </div>

    </div>
  );
}
