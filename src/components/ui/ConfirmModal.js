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
      <p className="text-sm leading-relaxed text-[#3e4943]">{message}</p>
      <div className="mt-6 flex justify-end gap-3 border-t border-[#e5e7eb] pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 border border-[#0b1c30] text-[#0b1c30] font-semibold text-sm uppercase tracking-wide hover:bg-[#dce9ff] shadow-[2px_2px_0px_#0b1c30] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all bg-white"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={cn(
            "px-5 py-2.5 font-semibold text-sm uppercase tracking-wide text-white shadow-[2px_2px_0px_#0b1c30] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all",
            danger
              ? "border border-[#ba1a1a] bg-[#ba1a1a] hover:bg-[#93000a]"
              : "border border-[#005d42] bg-[#005d42] hover:bg-[#047857]"
          )}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
