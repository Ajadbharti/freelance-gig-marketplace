"use client";

import { useState } from "react";
import { CheckCircle2, ShieldAlert, X } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import { formatPrice } from "@/lib/utils";

export default function GigDetailsModal({ gig, open, onClose, onApprove, onReject, onSuspend }) {
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open || !gig) return null;

  async function handleApprove() {
    setIsSubmitting(true);
    await onApprove(gig._id || gig.id);
    setIsSubmitting(false);
    onClose();
  }

  async function handleReject() {
    if (!rejectReason.trim()) {
      alert("A specific rejection reason is mandatory before rejecting specifications.");
      return;
    }
    setIsSubmitting(true);
    await onReject(gig._id || gig.id, rejectReason.trim());
    setIsSubmitting(false);
    setShowRejectInput(false);
    setRejectReason("");
    onClose();
  }

  async function handleSuspend() {
    setIsSubmitting(true);
    await onSuspend(gig._id || gig.id, "Violates marketplace standard");
    setIsSubmitting(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-3xl border-2 border-[#0b1c30] bg-white p-6 shadow-[6px_6px_0px_#0b1c30] max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#0b1c30] pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-[#005d42]" />
            <h2 className="font-headline text-lg font-bold uppercase text-[#0b1c30] truncate">
              AUDIT SPECIFICATION // {gig.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="border border-[#0b1c30] p-1 text-[#0b1c30] hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Top Details Grid */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4">
          <div className="aspect-[16/10] md:aspect-square overflow-hidden border border-[#0b1c30] bg-slate-100">
            <SafeImage src={gig.image} alt={gig.title} className="h-full w-full object-cover" />
          </div>

          <div className="space-y-2 font-mono text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="border border-[#0b1c30] bg-[#eff4ff] px-2 py-0.5 font-bold uppercase text-[#005d42]">
                STATUS: {gig.status}
              </span>
              <span className="border border-[#e5e7eb] px-2 py-0.5 uppercase text-[#3e4943]">
                CATEGORY: {gig.category}
              </span>
              <span className="border border-[#005d42] bg-[#005d42] px-2 py-0.5 font-bold text-white">
                STARTING: {formatPrice(gig.price)}
              </span>
            </div>

            <p className="font-sans text-sm text-[#3e4943] leading-relaxed pt-2">
              {gig.description}
            </p>

            <div className="border-t border-[#e5e7eb] pt-2 text-[#6e7a73]">
              <p>DELIVERY SLA: {gig.deliveryDays} DAYS // REVISIONS: {gig.revisions}</p>
            </div>
          </div>
        </div>

        {gig.rejectionReason && (
          <div className="mt-4 border-l-4 border-red-500 bg-red-50 p-3 font-mono text-xs text-red-900">
            <span className="font-bold uppercase">REJECTION LOG:</span> {gig.rejectionReason}
          </div>
        )}

        {/* Action Controls */}
        <div className="mt-6 border-t border-[#0b1c30] pt-4 font-mono text-xs">
          <h3 className="font-bold uppercase tracking-wider text-[#0b1c30]">
            GOVERNANCE AUDIT ACTION
          </h3>

          {showRejectInput ? (
            <div className="mt-3 space-y-2">
              <label className="block text-[#ba1a1a] font-bold uppercase">
                SPECIFY MANDATORY REJECTION REASON:
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Explain exact non-compliance reasons (e.g. low resolution images, prohibited domain, unclear deliverables)..."
                className="w-full border border-[#ba1a1a] p-2 text-xs focus:outline-none"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={isSubmitting}
                  className="bg-[#ba1a1a] px-4 py-2 font-bold uppercase tracking-wider text-white hover:bg-red-700"
                >
                  CONFIRM SPEC REJECTION
                </button>
                <button
                  type="button"
                  onClick={() => setShowRejectInput(false)}
                  className="border border-slate-300 bg-white px-4 py-2 font-bold uppercase text-slate-700"
                >
                  CANCEL
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleApprove}
                disabled={isSubmitting || gig.status === "published" || gig.status === "approved"}
                className="border border-[#005d42] bg-[#005d42] px-4 py-2 font-bold uppercase tracking-wider text-white hover:bg-[#065f46] shadow-[2px_2px_0px_#0b1c30] disabled:opacity-40"
              >
                ✓ APPROVE & PUBLISH TO CATALOG
              </button>

              <button
                type="button"
                onClick={() => setShowRejectInput(true)}
                disabled={isSubmitting}
                className="border border-[#ba1a1a] bg-white px-4 py-2 font-bold uppercase tracking-wider text-[#ba1a1a] hover:bg-red-50 shadow-[2px_2px_0px_#ba1a1a] disabled:opacity-40"
              >
                ✕ REJECT SPECIFICATION
              </button>

              <button
                type="button"
                onClick={handleSuspend}
                disabled={isSubmitting || gig.status === "suspended"}
                className="border border-slate-400 bg-white px-4 py-2 font-bold uppercase tracking-wider text-slate-800 hover:bg-slate-100 shadow-[2px_2px_0px_#0b1c30] disabled:opacity-40"
              >
                SUSPEND SPEC
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
