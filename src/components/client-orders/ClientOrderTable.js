"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  Eye,
  FileCode,
  FileText,
  MessageSquare,
  RefreshCw,
  ShieldCheck,
  X,
  XCircle,
} from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

export const SAMPLE_ORDERS = [
  {
    id: "ORD-8812",
    gigTitle: "Modern and professional business logo design",
    gigCover: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=400&q=80",
    freelancer: {
      name: "Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80",
      initials: "ER",
      level: "Top Rated Pro",
    },
    package: "Standard",
    orderDate: "Nov 24, 2026",
    deliveryDate: "Nov 27, 2026",
    amount: 50,
    status: "Delivered",
    deliverables: ["Modern_Logo_Vector_Pack.zip (24 MB)", "Brand_Guidelines_Presentation.pdf (8 MB)"],
  },
  {
    id: "ORD-8790",
    gigTitle: "Full-stack SaaS web application with Next.js and Tailwind",
    gigCover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80",
    freelancer: {
      name: "Alex Morgan",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
      initials: "AM",
      level: "Top Rated Pro",
    },
    package: "Premium",
    orderDate: "Nov 22, 2026",
    deliveryDate: "Nov 30, 2026",
    amount: 280,
    status: "In Progress",
    deliverables: [],
  },
  {
    id: "ORD-8640",
    gigTitle: "Autonomous AI Agent & LangChain vector search pipeline",
    gigCover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80",
    freelancer: {
      name: "Marcus Vance",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
      initials: "MV",
      level: "AI Specialist",
    },
    package: "Standard",
    orderDate: "Nov 18, 2026",
    deliveryDate: "Nov 21, 2026",
    amount: 140,
    status: "Completed",
    deliverables: ["LangChain_Pipeline_Source.zip (18 MB)", "Deployment_Guide.md"],
  },
  {
    id: "ORD-8580",
    gigTitle: "Enterprise Figma Design System & Component Tokens",
    gigCover: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=400&q=80",
    freelancer: {
      name: "Elena Rostova",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80",
      initials: "ER",
      level: "Top Rated Pro",
    },
    package: "Standard",
    orderDate: "Nov 16, 2026",
    deliveryDate: "Nov 20, 2026",
    amount: 85,
    status: "Revision Requested",
    deliverables: ["Figma_Design_Tokens_v1.fig"],
  },
  {
    id: "ORD-8521",
    gigTitle: "High-throughput REST API with Express & MongoDB",
    gigCover: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80",
    freelancer: {
      name: "Priya Sharma",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
      initials: "PS",
      level: "Level 2 Seller",
    },
    package: "Basic",
    orderDate: "Nov 15, 2026",
    deliveryDate: "Nov 19, 2026",
    amount: 65,
    status: "Completed",
    deliverables: ["Express_API_Source_Code.zip (12 MB)"],
  },
  {
    id: "ORD-8480",
    gigTitle: "Cloud Kubernetes & Docker Architecture Setup",
    gigCover: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=400&q=80",
    freelancer: {
      name: "Arjun Patel",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
      initials: "AP",
      level: "Cloud Architect",
    },
    package: "Standard",
    orderDate: "Nov 12, 2026",
    deliveryDate: "Nov 18, 2026",
    amount: 150,
    status: "Pending",
    deliverables: [],
  },
  {
    id: "ORD-8410",
    gigTitle: "Mobile App Figma Prototype & Design Tokens",
    gigCover: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=400&q=80",
    freelancer: {
      name: "Sarah Jenkins",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
      initials: "SJ",
      level: "Top Rated",
    },
    package: "Basic",
    orderDate: "Nov 10, 2026",
    deliveryDate: "Nov 14, 2026",
    amount: 45,
    status: "Cancelled",
    deliverables: [],
  },
  {
    id: "ORD-8390",
    gigTitle: "Cinematic SaaS Product Demo & Video Ads",
    gigCover: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=400&q=80",
    freelancer: {
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
      initials: "DK",
      level: "Video Pro",
    },
    package: "Standard",
    orderDate: "Nov 05, 2026",
    deliveryDate: "Nov 09, 2026",
    amount: 75,
    status: "Completed",
    deliverables: ["Product_Demo_4K_Master.mp4 (420 MB)"],
  },
];

export function getStatusBadgeConfig(status) {
  switch (status) {
    case "Pending":
      return {
        label: "Pending",
        color: "bg-amber-50 text-amber-700 border-amber-200/80",
        icon: Clock,
      };
    case "In Progress":
      return {
        label: "In Progress",
        color: "bg-violet-50 text-violet-700 border-violet-200/80",
        icon: Clock,
      };
    case "Delivered":
      return {
        label: "Delivered",
        color: "bg-blue-50 text-blue-700 border-blue-200/80",
        icon: Clock,
      };
    case "Completed":
      return {
        label: "Completed",
        color: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
        icon: CheckCircle2,
      };
    case "Revision Requested":
      return {
        label: "Revision Requested",
        color: "bg-orange-50 text-orange-700 border-orange-200/80",
        icon: RefreshCw,
      };
    case "Cancelled":
      return {
        label: "Cancelled",
        color: "bg-rose-50 text-rose-700 border-rose-200/80",
        icon: XCircle,
      };
    default:
      return {
        label: status || "Unknown",
        color: "bg-slate-100 text-slate-700 border-slate-200",
        icon: AlertCircle,
      };
  }
}

export default function ClientOrderTable({ orders = SAMPLE_ORDERS }) {
  const { showToast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState(null);

  function handleReleaseFunds(order) {
    showToast(`Milestone approved for #${order.id}! $${order.amount} released from escrow to ${order.freelancer.name}.`, "success");
    setSelectedOrder(null);
  }

  function handleRequestRevision(order) {
    showToast(`Revision request sent to ${order.freelancer.name} for #${order.id}.`, "info");
    setSelectedOrder(null);
  }

  function handleDownloadDeliverables(filename) {
    showToast(`Downloading ${filename}...`, "success");
  }

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          {/* Table Head */}
          <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-sans">
            <tr>
              <th className="py-4 pl-6 pr-3">Order ID</th>
              <th className="py-4 px-4">Gig &amp; Service</th>
              <th className="py-4 px-4">Freelancer</th>
              <th className="py-4 px-3">Package</th>
              <th className="py-4 px-3">Order Date</th>
              <th className="py-4 px-3">Delivery Date</th>
              <th className="py-4 px-4">Amount</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 pl-4 pr-6 text-right">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => {
              const statusCfg = getStatusBadgeConfig(order.status);
              const StatusIcon = statusCfg.icon;

              return (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  {/* Order ID */}
                  <td className="py-4 pl-6 pr-3 font-mono font-bold whitespace-nowrap">
                    <Link
                      href={`/orders/${order.id}`}
                      className="text-violet-600 hover:text-violet-800 hover:underline"
                    >
                      #{order.id}
                    </Link>
                  </td>

                  {/* Gig Thumbnail & Title */}
                  <td className="py-4 px-4">
                    <Link
                      href={`/orders/${order.id}`}
                      className="flex items-center gap-3 max-w-xs sm:max-w-sm group"
                    >
                      <img
                        src={order.gigCover}
                        alt={order.gigTitle}
                        className="h-10 w-10 rounded-xl object-cover shrink-0 border border-slate-200 group-hover:border-violet-400 transition"
                        loading="lazy"
                      />
                      <span className="font-semibold text-slate-900 truncate leading-snug group-hover:text-violet-600 transition">
                        {order.gigTitle}
                      </span>
                    </Link>
                  </td>

                  {/* Freelancer */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <img
                        src={order.freelancer.avatar}
                        alt={order.freelancer.name}
                        className="h-7 w-7 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <span className="font-medium text-slate-800 text-xs block">
                          {order.freelancer.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {order.freelancer.level}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Package */}
                  <td className="py-4 px-3 whitespace-nowrap">
                    <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                      {order.package}
                    </span>
                  </td>

                  {/* Order Date */}
                  <td className="py-4 px-3 whitespace-nowrap text-xs text-slate-500 font-sans">
                    {order.orderDate}
                  </td>

                  {/* Target Delivery Date */}
                  <td className="py-4 px-3 whitespace-nowrap text-xs font-medium text-slate-700 font-sans">
                    {order.deliveryDate}
                  </td>

                  {/* Total Amount */}
                  <td className="py-4 px-4 whitespace-nowrap font-headline font-extrabold text-slate-900">
                    ${order.amount}
                  </td>

                  {/* Distinct Status Badge */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusCfg.color}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5 shrink-0" />
                      <span>{statusCfg.label}</span>
                    </span>
                  </td>

                  {/* View Details Action */}
                  <td className="py-4 pl-4 pr-6 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:text-violet-600 hover:border-violet-200 hover:bg-violet-50 transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Comprehensive Order Details / Milestone Review Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-violet-700 bg-violet-50 border border-violet-100 px-2.5 py-0.5 rounded-md">
                    Order #{selectedOrder.id}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      getStatusBadgeConfig(selectedOrder.status).color
                    }`}
                  >
                    <span>{selectedOrder.status}</span>
                  </span>
                </div>

                <h3 className="font-headline text-lg sm:text-xl font-bold text-slate-900 mt-2">
                  {selectedOrder.gigTitle}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Freelancer & Financial Summary */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[10px]">
                  Specialist
                </span>
                <span className="font-semibold text-slate-900">{selectedOrder.freelancer.name}</span>
                <span className="text-[11px] text-slate-400 block font-mono">
                  {selectedOrder.freelancer.level}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block uppercase font-bold text-[10px]">
                  Package &amp; Total
                </span>
                <span className="font-headline font-bold text-slate-900 text-sm">
                  {selectedOrder.package} Tier · ${selectedOrder.amount} USD
                </span>
              </div>

              <div>
                <span className="text-slate-400 block uppercase font-bold text-[10px]">
                  Contract Date
                </span>
                <span className="font-medium text-slate-700">{selectedOrder.orderDate}</span>
              </div>

              <div>
                <span className="text-slate-400 block uppercase font-bold text-[10px]">
                  Target Delivery
                </span>
                <span className="font-medium text-slate-700">{selectedOrder.deliveryDate}</span>
              </div>
            </div>

            {/* Deliverables Section (If any) */}
            {selectedOrder.deliverables && selectedOrder.deliverables.length > 0 && (
              <div className="space-y-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Delivered Files for Review:
                </p>

                <div className="space-y-2">
                  {selectedOrder.deliverables.map((file) => (
                    <div
                      key={file}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/70 text-xs"
                    >
                      <div className="flex items-center gap-2 text-slate-800 font-mono font-medium truncate">
                        <FileText className="w-4 h-4 text-violet-600 shrink-0" />
                        <span className="truncate">{file}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDownloadDeliverables(file)}
                        className="inline-flex items-center gap-1 font-semibold text-violet-600 hover:underline shrink-0 pl-2 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Escrow Milestone Guarantee Notice */}
            <div className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/80 text-xs text-emerald-800 flex items-start gap-2.5 leading-snug">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">100% Milestone Escrow Protection</span>
                Your payment of ${selectedOrder.amount} remains locked securely in the escrow vault until you review and confirm acceptance.
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <Link
                href={`/orders/${selectedOrder.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 hover:text-violet-800 hover:underline"
              >
                <span>Open Full Order Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Close
                </button>

                {selectedOrder.status === "Delivered" && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleRequestRevision(selectedOrder)}
                      className="px-4 py-2.5 rounded-xl border border-orange-200 bg-orange-50 text-orange-700 text-xs font-semibold hover:bg-orange-100 transition cursor-pointer"
                    >
                      Request Revision
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReleaseFunds(selectedOrder)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-semibold shadow-md shadow-emerald-500/20 hover:from-emerald-700 hover:to-teal-700 transition cursor-pointer"
                    >
                      Approve &amp; Release Funds (${selectedOrder.amount})
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
