"use client";

import { useState } from "react";
import ClientDashboardSidebar from "@/components/client-dashboard/ClientDashboardSidebar";
import ClientDashboardHeader from "@/components/client-dashboard/ClientDashboardHeader";
import OrderDetailsHeader from "./OrderDetailsHeader";
import OrderSummaryCard from "./OrderSummaryCard";
import OrderProgressTimeline from "./OrderProgressTimeline";
import OrderDeliverySection from "./OrderDeliverySection";
import OrderRequirementsSection from "./OrderRequirementsSection";
import OrderConversationSection from "./OrderConversationSection";
import OrderFreelancerCard from "./OrderFreelancerCard";
import OrderPaymentSummary from "./OrderPaymentSummary";
import OrderHelpSupport from "./OrderHelpSupport";
import { getOrderById } from "./orderData";

export default function ClientOrderDetailsView({ initialOrderId = "ORD-8812" }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [order, setOrder] = useState(() => getOrderById(initialOrderId));

  // Handle Approve Delivery Action
  function handleApproveDelivery() {
    setOrder((prev) => ({
      ...prev,
      status: "Completed",
      timeline: prev.timeline.map((t) =>
        t.step === 5
          ? {
              ...t,
              completed: true,
              timestamp: "Completed just now",
              description: "Approved by client. $50.00 disbursed to freelancer.",
            }
          : t
      ),
      payment: {
        ...prev.payment,
        status: "Completed & Disbursed",
      },
    }));
  }

  // Handle Request Revision Action
  function handleRequestRevision(notes) {
    setOrder((prev) => ({
      ...prev,
      status: "Revision Requested",
      timeline: prev.timeline.map((t) =>
        t.step === 4
          ? {
              ...t,
              description: `Revision requested: "${notes.slice(0, 45)}..."`,
            }
          : t
      ),
    }));
  }

  // Handle Contact Freelancer click (smooth scroll to conversation)
  function handleScrollToConversation() {
    const el = document.getElementById("order-conversation");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      const textarea = el.querySelector("textarea");
      if (textarea) textarea.focus();
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex selection:bg-violet-500/20 selection:text-violet-900">
      
      {/* 1. Left Sidebar Navigation (activeNav: orders) */}
      <ClientDashboardSidebar
        activeNav="orders"
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        
        {/* Top Header */}
        <ClientDashboardHeader
          onOpenMobile={() => setMobileSidebarOpen(true)}
        />

        {/* Order Details Main Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          
          {/* 2. Page Header: Breadcrumb, Order ID, Status Badge, Back to Orders */}
          <OrderDetailsHeader order={order} />

          {/* 3. Order Summary Card */}
          <OrderSummaryCard order={order} />

          {/* 4. Order Progress Timeline */}
          <OrderProgressTimeline timeline={order.timeline} />

          {/* Two-Column Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column (8 Cols on Desktop): Delivery, Requirements, Conversation */}
            <div className="lg:col-span-8 space-y-6 min-w-0">
              
              {/* 6. Delivery Section */}
              <OrderDeliverySection
                order={order}
                onApproveDelivery={handleApproveDelivery}
                onRequestRevision={handleRequestRevision}
              />

              {/* 5. Requirements Section */}
              <OrderRequirementsSection order={order} />

              {/* 9. Order Conversation */}
              <OrderConversationSection
                order={order}
                conversation={order.conversation}
              />

            </div>

            {/* Right Column (4 Cols on Desktop): Specialist, Payment, Support */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* 7. Freelancer Information Card */}
              <OrderFreelancerCard
                freelancer={order.freelancer}
                onContactClick={handleScrollToConversation}
              />

              {/* 8. Payment Summary Card */}
              <OrderPaymentSummary payment={order.payment} />

              {/* 10. Help & Support */}
              <OrderHelpSupport orderId={order.id} />

            </div>

          </div>

        </main>

        {/* Dashboard Footer */}
        <footer className="py-6 px-8 border-t border-slate-200/80 bg-white/70 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 GigMarket Inc. Bilateral Smart Escrow Contract Ledger.</span>
          <div className="flex items-center gap-4">
            <span>Escrow Protected</span>
            <span>·</span>
            <span>Bilateral Dispute Mediation</span>
            <span>·</span>
            <span>Deterministic Milestones</span>
          </div>
        </footer>

      </div>

    </div>
  );
}
