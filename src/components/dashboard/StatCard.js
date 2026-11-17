import { cn } from "@/lib/utils";

const TONES = {
  indigo: "bg-[#eaf6ee] text-[#0a5c36]",
  emerald: "bg-[#eaf6ee] text-[#0a5c36]",
  amber: "bg-amber-50 text-amber-700",
  slate: "bg-slate-100 text-slate-700",
};

export default function StatCard({ icon: Icon, label, value, hint, tone = "indigo" }) {
  return (
    <div className="border border-slate-200 bg-white p-5 shadow-sm font-mono">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase font-semibold text-slate-600">{label}</p>
        <span className={cn("flex h-8 w-8 items-center justify-center border border-slate-200", TONES[tone] ?? TONES.indigo)}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-2 font-serif text-3xl font-bold text-slate-950">{value}</p>
      {hint && <p className="mt-1.5 text-[10px] text-slate-500 uppercase">{hint}</p>}
    </div>
  );
}
