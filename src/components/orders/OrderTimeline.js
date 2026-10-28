import { cn } from "@/lib/utils";

function formatDateTime(iso) {
  return new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

export default function OrderTimeline({ timeline }) {
  return (
    <ol className="relative space-y-6 border-l-2 border-slate-200 pl-6">
      {timeline.map((step, index) => {
        const isLast = index === timeline.length - 1;
        return (
          <li key={`${step.date}-${index}`} className="relative">
            <span
              aria-hidden="true"
              className={cn(
                "absolute -left-[33px] top-1 h-4 w-4 rounded-full border-2 border-white ring-2",
                isLast ? "bg-indigo-600 ring-indigo-200" : "bg-slate-300 ring-slate-200"
              )}
            />
            <p className="text-sm font-semibold text-slate-900">{step.label}</p>
            <p className="text-xs text-slate-500">{formatDateTime(step.date)}</p>
          </li>
        );
      })}
    </ol>
  );
}