import { cn } from "@/lib/utils";

const STYLES = {
  active: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  delivered: "bg-amber-50 text-amber-800 ring-amber-200",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  cancelled: "bg-slate-100 text-slate-600 ring-slate-300",
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
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        STYLES[status] ?? STYLES.cancelled,
        className
      )}
    >
      {LABELS[status] ?? status}
    </span>
  );
}