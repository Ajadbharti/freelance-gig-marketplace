"use client";

import Modal from "@/components/ui/Modal";
import { cn } from "@/lib/utils";

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  danger = false,
  onConfirm,
  onClose,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm leading-relaxed text-slate-600">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Go back
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={cn(
            "rounded-lg px-5 py-2 text-sm font-semibold text-white transition",
            danger ? "bg-red-600 hover:bg-red-700" : "bg-indigo-600 hover:bg-indigo-700"
          )}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}