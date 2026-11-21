"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, children }) {
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onCloseRef.current?.();
    };
    document.addEventListener("keydown", handleKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0b1c30]/60 backdrop-blur-xs" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto bg-white border border-[#e5e7eb] shadow-[3px_3px_0px_#0b1c30] p-6 outline-none"
      >
        <div className="mb-4 flex items-start justify-between gap-4 border-b border-[#e5e7eb] pb-3">
          <h2 className="font-headline text-lg font-bold uppercase tracking-tight text-[#0b1c30]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="border border-[#6e7a73] p-1 text-[#3e4943] transition hover:border-[#0b1c30] hover:bg-[#dce9ff] hover:text-[#0b1c30]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
