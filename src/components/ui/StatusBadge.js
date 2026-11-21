import { cn } from "@/lib/utils";

const STYLES = {
  active: "bg-[#DBEAFE] text-[#2563EB] border border-[#BFDBFE]",
  delivered: "bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]",
  completed: "bg-[#D1FAE5] text-[#047857] border border-[#A7F3D0]",
  cancelled: "bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]",
  standard: "bg-[#F1F5F9] text-[#0F172A] border border-[#E2E8F0]",
};

const LABELS = {
  active: "Active",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function StatusBadge({ status, className }) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center px-2 font-mono text-[11px] font-semibold uppercase tracking-[0.05em] rounded-none",
        STYLES[status] ?? STYLES.standard,
        className
      )}
    >
      {LABELS[status] ?? status}
    </span>
  );
}
