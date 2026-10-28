"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useToast } from "@/components/ui/ToastProvider";
import { formatPrice } from "@/lib/utils";

function OrderForm({ gig, onClose }) {
  const router = useRouter();
  const { createOrder } = useMarketplace();
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { requirements: "" } });

  function onSubmit(values) {
    const result = createOrder({ gigId: gig.id, requirements: values.requirements });
    if (!result.ok) {
      showToast(result.error, "error");
      return;
    }
    showToast("Order placed successfully!");
    onClose();
    router.push(`/orders/${result.order.id}`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="rounded-xl bg-slate-50 p-4 text-sm">
        <p className="font-semibold text-slate-900">{gig.title}</p>
        <p className="mt-1 text-slate-600">
          {formatPrice(gig.price)} · {gig.deliveryDays} day delivery · {gig.revisions} revisions
        </p>
      </div>

      <div>
        <label htmlFor="requirements" className="mb-1.5 block text-sm font-medium text-slate-800">
          Describe your requirements
        </label>
        <textarea
          id="requirements"
          rows={5}
          placeholder="Tell the freelancer what you need, your goals, and any links or references."
          aria-invalid={errors.requirements ? "true" : "false"}
          aria-describedby={errors.requirements ? "requirements-error" : undefined}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          {...register("requirements", {
            required: "Please describe your requirements.",
            minLength: { value: 10, message: "Please write at least 10 characters." },
            maxLength: { value: 1000, message: "Keep it under 1000 characters." },
          })}
        />
        {errors.requirements && (
          <p id="requirements-error" role="alert" className="mt-1.5 text-sm text-red-600">
            {errors.requirements.message}
          </p>
        )}
      </div>

      <p className="text-xs text-slate-500">
        Demo order only. No payment is taken and nothing is sent to a real freelancer.
      </p>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Place order · {formatPrice(gig.price)}
        </button>
      </div>
    </form>
  );
}

export default function OrderModal({ gig, open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Place your order">
      <OrderForm gig={gig} onClose={onClose} />
    </Modal>
  );
}