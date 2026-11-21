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
      <p className="text-sm leading-relaxed text-[#3E4943]">{message}</p>
      <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-none border border-[#0F172A] bg-white px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-[#0F172A] shadow-[2px_2px_0px_#0F172A] transition hover:bg-[#F8FAFC] active:translate-x-[1px] active:translate-y-[1px]"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={cn(
            "rounded-none px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-[2px_2px_0px_#0F172A] transition active:translate-x-[1px] active:translate-y-[1px]",
            danger
              ? "border border-[#DC2626] bg-[#DC2626] hover:bg-[#B91C1C]"
              : "border border-[#047857] bg-[#047857] hover:bg-[#065F46]"
          )}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
