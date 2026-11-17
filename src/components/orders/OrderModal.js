"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Lock, ShieldCheck } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useToast } from "@/components/ui/ToastProvider";
import { formatPrice } from "@/lib/utils";

function OrderForm({ gig, selectedPackage, onClose }) {
  const router = useRouter();
  const { createOrder } = useMarketplace();
  const { showToast } = useToast();

  const price = selectedPackage?.price || gig.price || 280;
  const deliveryDays = selectedPackage?.deliveryDays || gig.deliveryDays || 3;
  const revisions = selectedPackage?.revisions || gig.revisions || 4;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      requirements:
        "Production-ready multi-tenant administrative dashboard complete with dark/light design tokens, data-dense analytics tables, and responsive navigation layouts.",
    },
  });

  async function onSubmit(values) {
    const result = await createOrder({
      gigId: gig.id,
      requirements: values.requirements,
      packageTier: selectedPackage?.name || "standard",
    });
    if (!result.ok) {
      showToast(result.error, "error");
      return;
    }
    showToast("Escrow contract initialized! Milestone 1 locked.");
    onClose();
    router.push(`/orders/${result.order.id}`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5 font-sans">
      {/* Contract Spec Summary */}
      <div className="border border-slate-200 bg-[#FAFBFB] p-4 font-mono text-xs">
        <div className="flex items-start justify-between">
          <div>
            <span className="font-bold uppercase tracking-wider text-slate-900">
              CONTRACT: {gig.title}
            </span>
            <p className="mt-1 text-slate-500">
              TIER: {selectedPackage?.name || "STANDARD CORE SUITE"}
            </p>
          </div>
          <span className="font-serif text-xl font-bold text-slate-950">
            ${price}.00
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-2.5 text-[11px] text-slate-600">
          <span>⚡ {deliveryDays}-Day SLA Delivery</span>
          <span>↺ {revisions} Iteration Revisions</span>
          <span className="text-[#0a5c36] font-bold">100% Escrow Protected</span>
        </div>
      </div>

      <div>
        <label htmlFor="requirements" className="block font-mono text-xs font-semibold uppercase tracking-wider text-slate-800">
          Engineering Scope & Deliverable Requirements
        </label>
        <textarea
          id="requirements"
          rows={4}
          placeholder="Specify exact user flows, Figma frames, API endpoints, or repository requirements..."
          className="mt-1.5 w-full border border-slate-300 p-3 text-xs leading-relaxed text-slate-900 focus:border-slate-800 focus:outline-none"
          {...register("requirements", {
            required: "Please describe your scope.",
            minLength: { value: 10, message: "Please write at least 10 characters." },
          })}
        />
        {errors.requirements && (
          <p className="mt-1 font-mono text-xs text-red-600">{errors.requirements.message}</p>
        )}
      </div>

      <div className="border border-emerald-200 bg-[#f7fcf9] p-3 flex items-start gap-2.5 font-mono text-xs text-[#0a5c36]">
        <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed text-slate-700">
          <strong>Deterministic Escrow Vault:</strong> Funds are locked in a neutral smart-contract vault and disbursed in automated tranches as milestone deliverables pass review.
        </p>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="border border-slate-300 px-4 py-2 font-mono text-xs font-semibold uppercase text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#0a5c36] px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white hover:bg-[#084c2c] disabled:opacity-50"
        >
          {isSubmitting ? "Locking Escrow..." : `LOCK IN ESCROW VAULT ($${price}) →`}
        </button>
      </div>
    </form>
  );
}

export default function OrderModal({ gig, selectedPackage, open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="INITIATE MILESTONE ESCROW CONTRACT">
      <OrderForm gig={gig} selectedPackage={selectedPackage} onClose={onClose} />
    </Modal>
  );
}
