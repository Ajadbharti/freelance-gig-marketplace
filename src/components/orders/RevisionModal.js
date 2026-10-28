"use client";

import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import FormField, { inputClass } from "@/components/ui/FormField";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useToast } from "@/components/ui/ToastProvider";

function RevisionForm({ order, left, onClose }) {
  const { requestRevision } = useMarketplace();
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { note: "" } });

  function onSubmit({ note }) {
    const result = requestRevision(order.id, note);
    if (!result.ok) {
      showToast(result.error, "error");
      return;
    }
    showToast("Revision requested. The freelancer can now deliver an update.");
    onClose();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
        You have <strong>{left}</strong> revision{left === 1 ? "" : "s"} left on this order. This request will use
        one.
      </p>

      <FormField id="note" label="What should be changed?" error={errors.note?.message}>
        <textarea
          id="note"
          rows={4}
          placeholder="Explain clearly what you would like the freelancer to fix or improve."
          aria-invalid={errors.note ? "true" : "false"}
          aria-describedby={errors.note ? "note-error" : undefined}
          className={inputClass}
          {...register("note", {
            required: "Please describe the changes you need.",
            minLength: { value: 10, message: "Please write at least 10 characters." },
            maxLength: { value: 200, message: "Keep it under 200 characters." },
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
          Request revision
        </button>
      </div>
    </form>
  );
}

export default function RevisionModal({ order, left, open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Request a revision">
      {order && <RevisionForm key={order.id} order={order} left={left} onClose={onClose} />}
    </Modal>
  );
}