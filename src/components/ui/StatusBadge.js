import { cn } from "@/lib/utils";

const STYLES = {
  active: "bg-[#dae2fd] text-[#0047bf] border border-[#1e5fe7]",
  delivered: "bg-[#e5eeff] text-[#005d42] border border-[#047857]",
  completed: "bg-[#9ffdd3] text-[#005d42] border border-[#005d42]",
  cancelled: "bg-[#ffdad6] text-[#ba1a1a] border border-[#ba1a1a]",
  standard: "bg-[#eff4ff] text-[#0b1c30] border border-[#6e7a73]",
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
