"use client";

import { useState } from "react";
import { AlertCircle, FileQuestion, HelpCircle, LifeBuoy, ShieldAlert, X } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

export default function OrderHelpSupport({ orderId }) {
  const { showToast } = useToast();
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [issueReason, setIssueReason] = useState("incomplete");
  const [issueNotes, setIssueNotes] = useState("");

  function handleSubmitDispute(e) {
    e.preventDefault();
    setIssueModalOpen(false);
    setIssueNotes("");
    showToast("Dispute ticket opened. GigMarket Trust & Safety team will review within 12 hours.", "info");
  }

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-4">
      {/* Title */}
      <h3 className="font-headline text-sm font-bold uppercase tracking-wider text-slate-400 font-sans pb-2 border-b border-slate-100">
        Order Support &amp; Policies
      </h3>

      <div className="space-y-2.5">
        {/* Report an Issue Button */}
        <button
          type="button"
          onClick={() => setIssueModalOpen(true)}
          className="w-full flex items-center justify-between p-3 rounded-2xl border border-rose-100 bg-rose-50/50 hover:bg-rose-50 text-xs font-semibold text-rose-700 transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Report an Issue / Resolution</span>
          </div>
          <span>→</span>
        </button>

        {/* Contact Support Link */}
        <button
          type="button"
          onClick={() => showToast("GigMarket Concierge support chat connected.", "info")}
          className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <LifeBuoy className="w-4 h-4 text-violet-600" />
            <span>Contact Priority Support</span>
          </div>
          <span className="text-slate-400">24/7 Live</span>
        </button>

        {/* Cancellation Policy Link */}
        <button
          type="button"
          onClick={() => setPolicyModalOpen(true)}
          className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <FileQuestion className="w-4 h-4 text-slate-500" />
            <span>View Cancellation Policy</span>
          </div>
          <span className="text-slate-400">Escrow terms</span>
        </button>
      </div>

      {/* Resolution Center Dispute Modal */}
      {issueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                <h4 className="font-headline text-base font-bold text-slate-900">
                  GigMarket Resolution Center
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIssueModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitDispute} className="space-y-4">
              <p className="text-xs text-slate-600">
                Opening an issue pauses automatic escrow milestone timers. Our dispute resolution specialists will mediate between both parties.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reason for Dispute
                </label>
                <select
                  value={issueReason}
                  onChange={(e) => setIssueReason(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 bg-slate-50 focus:outline-none focus:border-violet-600"
                >
                  <option value="incomplete">Deliverables are incomplete or missing source files</option>
                  <option value="unresponsive">Freelancer is unresponsive or inactive</option>
                  <option value="quality">Work does not match package description</option>
                  <option value="cancel">Mutual agreement to cancel order and refund</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Explanation &amp; Evidence
                </label>
                <textarea
                  value={issueNotes}
                  onChange={(e) => setIssueNotes(e.target.value)}
                  rows={4}
                  placeholder="Provide specific details about the issue..."
                  className="w-full rounded-2xl border border-slate-200 p-3 text-xs text-slate-900 focus:outline-none focus:border-violet-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIssueModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
                >
                  Open Dispute Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancellation Policy Modal */}
      {policyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-headline text-base font-bold text-slate-900">
                Order Cancellation &amp; Escrow Policy
              </h4>
              <button
                type="button"
                onClick={() => setPolicyModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed max-h-[60vh] overflow-y-auto">
              <p>
                <strong>1. Escrow Lock:</strong> Funds deposited for Order #{orderId} remain in an isolated bilateral escrow vault. No payouts can be made without explicit client sign-off or resolution mediation.
              </p>
              <p>
                <strong>2. Late Deliveries:</strong> If a freelancer fails to deliver by the agreed deadline without an extension request, the client has the right to cancel with an instant 100% refund.
              </p>
              <p>
                <strong>3. Revisions:</strong> Clients are entitled to the revision count stated in their package (up to 5 rounds).
              </p>
              <p>
                <strong>4. Mutual Cancellation:</strong> Both parties can agree to terminate the contract at any time, returning escrow funds to the client&apos;s original payment method.
              </p>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPolicyModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
