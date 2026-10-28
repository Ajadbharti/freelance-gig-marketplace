"use client";

import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import FormField, { inputClass } from "@/components/ui/FormField";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useToast } from "@/components/ui/ToastProvider";

function DeliverForm({ order, onClose }) {
  const { deliverOrder } = useMarketplace();
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ defaultValues: { deliveryLink: "", deliveryNote: "" } });

  function onSubmit(values) {
    if (!values.deliveryLink.trim() && !values.deliveryNote.trim()) {
      setError("deliveryNote", { type: "manual", message: "Add a delivery link or a note (or both)." });
      return;
    }
    const result = deliverOrder(order.id, values);
    if (!result.ok) {
      showToast(result.error, "error");
      return;
    }
    showToast("Work delivered. The client has been notified (demo).");
    onClose();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <FormField
        id="deliveryLink"
        label="Delivery link (optional)"
        hint="For example a demo link to files, a repo or a design."
        error={errors.deliveryLink?.message}
      >
        <input
          id="deliveryLink"
          type="url"
          placeholder="https://example.com/my-delivery"
          aria-invalid={errors.deliveryLink ? "true" : "false"}
          aria-describedby={errors.deliveryLink ? "deliveryLink-error" : undefined}
          className={inputClass}
          {...register("deliveryLink", {
            pattern: { value: /^$|^https?:\/\/\S+$/i, message: "Enter a valid http(s) link." },
          })}
        />
      </FormField>

      <FormField id="deliveryNote" label="Delivery note" error={errors.deliveryNote?.message}>
        <textarea
          id="deliveryNote"
          rows={4}
          placeholder="Describe what you are delivering and anything the client should know."
          aria-invalid={errors.deliveryNote ? "true" : "false"}
          aria-describedby={errors.deliveryNote ? "deliveryNote-error" : undefined}
          className={inputClass}
          {...register("deliveryNote", {
            maxLength: { value: 600, message: "Keep the note under 600 characters." },
          })}
        />
      </FormField>

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
          Deliver work
        </button>
      </div>
    </form>
  );
}

export default function DeliverModal({ order, open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Deliver your work">
      {order && <DeliverForm key={order.id} order={order} onClose={onClose} />}
    </Modal>
  );
}