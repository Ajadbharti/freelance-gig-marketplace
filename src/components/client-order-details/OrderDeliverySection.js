"use client";

import { useState } from "react";
import {
  AlertCircle,
  Archive,
  ArrowRight,
  CheckCircle2,
  Clock,
  Download,
  FileCode,
  FileText,
  FolderArchive,
  MessageSquare,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

export default function OrderDeliverySection({
  order,
  onApproveDelivery,
  onRequestRevision,
}) {
  const { showToast } = useToast();
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState("");

  const delivery = order.delivery;
  const isDelivered = order.status === "Delivered";
  const isCompleted = order.status === "Completed";
  const isRevision = order.status === "Revision Requested";

  function handleDownloadFile(fileName) {
    showToast(`Downloading ${fileName}...`, "success");
  }

  function handleDownloadAll() {
    showToast(`Packaging and downloading all deliverables (${delivery?.files?.length || 0} files)...`, "success");
  }

  function handleSubmitRevision(e) {
    e.preventDefault();
    if (!revisionNotes.trim()) {
      showToast("Please write detailed revision notes for the freelancer.", "error");
      return;
    }
    onRequestRevision(revisionNotes);
    setRevisionModalOpen(false);
    setRevisionNotes("");
    showToast("Revision request sent to Elena Rostova. The delivery has been updated.", "info");
  }

  function handleConfirmApprove() {
    onApproveDelivery();
    setApproveModalOpen(false);
    showToast(`Order approved! $${order.amount}.00 released to ${order.freelancer.name}.`, "success");
  }

  function getFileIcon(type) {
    switch (type) {
      case "ZIP":
        return <FolderArchive className="w-5 h-5 text-amber-600" />;
      case "PDF":
        return <FileText className="w-5 h-5 text-rose-600" />;
      case "FIG":
        return <FileCode className="w-5 h-5 text-violet-600" />;
      default:
        return <FileText className="w-5 h-5 text-slate-500" />;
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-headline text-lg sm:text-xl font-bold text-slate-900">
              Work Delivery &amp; Assets
            </h3>
            {isDelivered && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-[11px] font-bold text-blue-700">
                <Clock className="w-3 h-3" />
                <span>Ready for Client Review</span>
              </span>
            )}
            {isCompleted && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                <CheckCircle2 className="w-3 h-3" />
                <span>Approved &amp; Released</span>
              </span>
            )}
          </div>
          <p className="font-sans text-xs text-slate-500 mt-1">
            {delivery
              ? `Delivered by ${order.freelancer.name} on ${delivery.deliveredAt}`
              : "Freelancer is preparing your deliverables."}
          </p>
        </div>

        {delivery && delivery.files && delivery.files.length > 0 && (
          <button
            type="button"
            onClick={handleDownloadAll}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-800 transition cursor-pointer self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5 text-violet-600" />
            <span>Download All ({delivery.files.length} Files)</span>
          </button>
        )}
      </div>

      {/* Main Delivery Body */}
      {delivery ? (
        <div className="space-y-6">
          
          {/* Freelancer Handover Note */}
          <div className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/60 to-indigo-50/30 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={order.freelancer.avatar}
                  alt={order.freelancer.name}
                  className="h-7 w-7 rounded-full object-cover border border-violet-200"
                />
                <span className="font-sans text-xs font-bold text-slate-900">
                  {order.freelancer.name}&apos;s Delivery Message
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {delivery.deliveredAt}
              </span>
            </div>

            <p className="font-sans text-xs sm:text-sm text-slate-700 leading-relaxed italic bg-white/70 p-4 rounded-xl border border-violet-100/60">
              &ldquo;{delivery.message}&rdquo;
            </p>
          </div>

          {/* Delivered Files Grid */}
          <div className="space-y-3">
            <p className="font-sans text-xs font-bold uppercase tracking-wider text-slate-400">
              Delivered Files ({delivery.files.length})
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {delivery.files.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/90 bg-white hover:border-violet-300 hover:shadow-sm transition group"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 group-hover:bg-violet-50 transition">
                      {getFileIcon(file.type)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-mono text-xs font-bold text-slate-800 truncate">
                        {file.name}
                      </p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span>{file.size}</span>
                        <span>·</span>
                        <span className="text-violet-600 font-semibold">{file.format}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownloadFile(file.name)}
                    className="p-2 rounded-xl text-slate-400 hover:text-violet-700 hover:bg-violet-50 transition shrink-0 cursor-pointer"
                    title={`Download ${file.name}`}
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Bar (Conditional by status) */}
          {isDelivered && (
            <div className="rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-500/5 to-indigo-500/5 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-headline text-sm font-bold text-slate-900">
                  Ready to complete this milestone?
                </h4>
                <p className="font-sans text-xs text-slate-600">
                  Approve to disburse ${order.amount}.00 from escrow, or request changes if you need revisions.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
                {/* Request Revision Button */}
                <button
                  type="button"
                  onClick={() => setRevisionModalOpen(true)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer shadow-2xs"
                >
                  Request Revision
                </button>

                {/* Approve Delivery Button */}
                <button
                  type="button"
                  onClick={() => setApproveModalOpen(true)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-semibold shadow-md shadow-emerald-500/20 transition cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Delivery</span>
                </button>
              </div>
            </div>
          )}

          {isCompleted && (
            <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/80 text-xs text-emerald-800 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold block text-sm">Order Approved &amp; Completed</span>
                Payment of ${order.amount}.00 was safely transferred from escrow to {order.freelancer.name}. Thank you for using GigMarket!
              </div>
            </div>
          )}

          {isRevision && (
            <div className="p-4 rounded-2xl border border-orange-200 bg-orange-50/80 text-xs text-orange-800 flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-orange-600 shrink-0 animate-spin" />
              <div>
                <span className="font-bold block text-sm">Revision In Progress</span>
                You requested changes on this delivery. {order.freelancer.name} has been notified and is working on your updates.
              </div>
            </div>
          )}

        </div>
      ) : (
        /* Empty / In Progress state */
        <div className="p-8 text-center space-y-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60">
          <Clock className="w-8 h-8 text-slate-400 mx-auto animate-pulse" />
          <h4 className="font-headline text-sm font-bold text-slate-800">
            Work In Progress
          </h4>
          <p className="font-sans text-xs text-slate-500 max-w-md mx-auto">
            {order.freelancer.name} is currently working on your order. Expected delivery by{" "}
            <strong>{order.deliveryDate}</strong>.
          </p>
        </div>
      )}

      {/* 1. Request Revision Modal */}
      {revisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-orange-600" />
                <h4 className="font-headline text-base font-bold text-slate-900">
                  Request Revision for #{order.id}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setRevisionModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitRevision} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  What would you like adjusted or changed?
                </label>
                <textarea
                  value={revisionNotes}
                  onChange={(e) => setRevisionNotes(e.target.value)}
                  rows={4}
                  placeholder="e.g. Please try a slightly lighter shade of violet for the second concept, and provide a version with the icon aligned above the typography..."
                  className="w-full rounded-2xl border border-slate-200 p-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-600 focus:ring-4 focus:ring-violet-500/10"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Revisions used: {delivery?.revisionCount || 0} of {delivery?.maxRevisions || 5}</span>
                <span>Response within 24 hours</span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRevisionModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold transition cursor-pointer shadow-xs"
                >
                  Send Revision Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Approve Delivery Modal */}
      {approveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h4 className="font-headline text-base font-bold text-slate-900">
                  Approve Delivery &amp; Release Funds
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setApproveModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p>
                By approving this delivery, you confirm that you have inspected the delivered files and are satisfied with the completed work.
              </p>
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium space-y-1">
                <div className="flex justify-between">
                  <span>Release to {order.freelancer.name}:</span>
                  <span className="font-bold font-headline">${order.amount}.00 USD</span>
                </div>
                <div className="flex justify-between text-[11px] text-emerald-700">
                  <span>Escrow Transaction:</span>
                  <span className="font-mono">{order.payment.transactionId}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setApproveModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={handleConfirmApprove}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-semibold shadow-md shadow-emerald-500/25 transition cursor-pointer"
              >
                Confirm Approval &amp; Release Funds
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
