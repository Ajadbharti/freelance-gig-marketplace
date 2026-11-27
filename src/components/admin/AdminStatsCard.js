"use client";

export default function AdminStatsCard({ label, value, sublabel, icon: Icon, tone = "navy" }) {
  const borderTone =
    tone === "emerald"
      ? "border-b-[#005d42]"
      : tone === "amber"
      ? "border-b-amber-500"
      : tone === "red"
      ? "border-b-[#ba1a1a]"
      : tone === "blue"
      ? "border-b-[#0047bf]"
      : "border-b-[#0b1c30]";

  const iconBg =
    tone === "emerald"
      ? "bg-[#005d42] text-white"
      : tone === "amber"
      ? "bg-amber-500 text-white"
      : tone === "red"
      ? "bg-[#ba1a1a] text-white"
      : tone === "blue"
      ? "bg-[#0047bf] text-white"
      : "bg-[#0b1c30] text-white";

  return (
    <div
      className={`border border-[#e5e7eb] bg-white p-4 shadow-[2px_2px_0px_#0b1c30] border-b-4 ${borderTone} flex flex-col justify-between`}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#6e7a73]">
          {label}
        </span>
        {Icon && (
          <div className={`flex h-6 w-6 items-center justify-center ${iconBg}`}>
            <Icon className="h-3.5 w-3.5" />
          </div>
        )}
      </div>

      <p className="mt-2 font-headline text-2xl sm:text-3xl font-bold tracking-tight text-[#0b1c30]">
        {value}
      </p>

      {sublabel ? (
        <p className="mt-1 font-mono text-[10px] uppercase text-[#6e7a73]">
          {sublabel}
        </p>
      ) : (
        <div className="mt-1 h-3" />
      )}
    </div>
  );
}
