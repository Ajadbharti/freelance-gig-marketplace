"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  ShieldCheck,
  X,
} from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

const ORDERS_DATA = [
  {
    id: "ord-8812",
    gigTitle: "Modern and professional business logo design",
    gigCover: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=400&q=80",
    freelancer: {
      name: "Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80",
      initials: "ER",
    },
    orderDate: "Nov 24, 2026",
    deliveryDate: "Nov 27, 2026",
    package: "Standard",
    amount: 50,
    status: "Delivered",
    statusColor: "bg-blue-50 text-blue-700 border-blue-200/80",
    statusIcon: Clock,
  },
  {
    id: "ord-8790",
    gigTitle: "Full-stack SaaS web application with Next.js and Tailwind",
    gigCover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80",
    freelancer: {
      name: "Alex Morgan",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
      initials: "AM",
    },
    orderDate: "Nov 22, 2026",
    deliveryDate: "Nov 30, 2026",
    package: "Premium",
    amount: 280,
    status: "In Progress",
    statusColor: "bg-violet-50 text-violet-700 border-violet-200/80",
    statusIcon: Clock,
  },
  {
    id: "ord-8640",
    gigTitle: "Autonomous AI Agent & LangChain vector search pipeline",
    gigCover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
    freelancer: {
      name: "Marcus Vance",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
      initials: "MV",
    },
    orderDate: "Nov 18, 2026",
    deliveryDate: "Nov 21, 2026",
    package: "Standard",
    amount: 140,
    status: "Completed",
    statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    statusIcon: CheckCircle2,
  },
  {
    id: "ord-8521",
    gigTitle: "High-throughput REST API with Express & MongoDB",
    gigCover: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80",
    freelancer: {
      name: "Priya Sharma",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
      initials: "PS",
    },
    orderDate: "Nov 15, 2026",
    deliveryDate: "Nov 19, 2026",
    package: "Basic",
    amount: 65,
    status: "Completed",
    statusColor: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    statusIcon: CheckCircle2,
  },
  {
    id: "ord-8410",
    gigTitle: "Mobile App Figma Prototype & Design Tokens System",
    gigCover: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=400&q=80",
    freelancer: {
      name: "Sarah Jenkins",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
      initials: "SJ",
    },
    orderDate: "Nov 10, 2026",
    deliveryDate: "Nov 14, 2026",
    package: "Basic",
    amount: 45,
    status: "Cancelled",
    statusColor: "bg-rose-50 text-rose-700 border-rose-200/80",
    statusIcon: AlertCircle,
  },
];

const TABS = [
  { id: "all", label: "All Orders" },
  { id: "In Progress", label: "In Progress" },
  { id: "Delivered", label: "Delivered" },
  { id: "Completed", label: "Completed" },
  { id: "Cancelled", label: "Cancelled" },
];

export default function ClientRecentOrders() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = activeTab === "all"
    ? ORDERS_DATA
    : ORDERS_DATA.filter((o) => o.status === activeTab);

  function handleViewDetails(order) {
    setSelectedOrder(order);
  }

  function handleApproveMilestone(order) {
    showToast(`Milestone for ${order.id} approved! $${order.amount} released from escrow.`, "success");
    setSelectedOrder(null);
  }

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Recent Orders
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Track active deliverables, review submitted milestones, and release escrow funds.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200/80 text-xs">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
                  isActive
                    ? "bg-white text-slate-900 shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            {/* Table Head */}
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-sans">
              <tr>
                <th className="py-3.5 pl-6 pr-4">Gig &amp; Service</th>
                <th className="py-3.5 px-4">Freelancer</th>
                <th className="py-3.5 px-4">Timeline</th>
                <th className="py-3.5 px-4">Package</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 pl-4 pr-6 text-right">Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const StatusIcon = order.statusIcon;

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      {/* Gig Title & Cover */}
                      <td className="py-4 pl-6 pr-4">
                        <div className="flex items-center gap-3 max-w-sm">
                          <img
                            src={order.gigCover}
                            alt={order.gigTitle}
                            className="h-11 w-11 rounded-xl object-cover shrink-0 border border-slate-200"
                          />
                          <div className="min-w-0">
                            <span className="block font-semibold text-slate-900 truncate">
                              {order.gigTitle}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400">
                              Order #{order.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Freelancer Name & Avatar */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <img
                            src={order.freelancer.avatar}
                            alt={order.freelancer.name}
                            className="h-7 w-7 rounded-full object-cover border border-slate-200"
                          />
                          <span className="font-medium text-slate-800 text-xs">
                            {order.freelancer.name}
                          </span>
                        </div>
                      </td>

                      {/* Timeline: Order & Delivery Date */}
                      <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-500">
                        <div className="font-medium text-slate-700">Due: {order.deliveryDate}</div>
                        <div className="text-[11px] text-slate-400">Placed: {order.orderDate}</div>
                      </td>

                      {/* Package */}
                      <td className="py-4 px-4 whitespace-nowrap text-xs">
                        <span className="rounded-lg bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                          {order.package}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="py-4 px-4 whitespace-nowrap font-headline font-bold text-slate-900">
                        ${order.amount}
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${order.statusColor}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          <span>{order.status}</span>
                        </span>
                      </td>

                      {/* View Details Action */}
                      <td className="py-4 pl-4 pr-6 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleViewDetails(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:text-violet-600 hover:border-violet-200 hover:bg-violet-50/50 transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No orders found under &ldquo;{activeTab}&rdquo; filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="font-mono text-xs font-bold text-violet-600 uppercase tracking-wider">
                  Order Summary #{selectedOrder.id}
                </span>
                <h3 className="font-headline text-lg font-bold text-slate-900 mt-1">
                  {selectedOrder.gigTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Freelancer & Package Metas */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs">
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[10px]">Freelancer</span>
                <span className="font-semibold text-slate-800">{selectedOrder.freelancer.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[10px]">Package Tier</span>
                <span className="font-semibold text-slate-800">{selectedOrder.package} (${selectedOrder.amount})</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[10px]">Order Date</span>
                <span className="font-semibold text-slate-800">{selectedOrder.orderDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[10px]">Target Delivery</span>
                <span className="font-semibold text-slate-800">{selectedOrder.deliveryDate}</span>
              </div>
            </div>

            {/* Escrow Milestone Status Notice */}
            <div className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/70 text-xs text-emerald-800 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Escrow Protection Active</span>
                Payment of ${selectedOrder.amount} is securely held in vault trust.
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Close
              </button>

              {selectedOrder.status === "Delivered" && (
                <button
                  type="button"
                  onClick={() => handleApproveMilestone(selectedOrder)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-semibold shadow-md shadow-emerald-500/20 hover:from-emerald-700 hover:to-teal-700 transition cursor-pointer"
                >
                  Approve &amp; Release Funds
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
