export const inputClass =
  "w-full rounded-none border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-sm text-[#0F172A] placeholder:text-slate-400 focus:border-2 focus:border-[#0F172A] focus:outline-none focus:ring-0 transition-colors";

export default function FormField({ id, label, error, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-mono text-xs font-semibold uppercase tracking-wider text-[#0F172A]">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 font-mono text-[11px] text-slate-500">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 font-mono text-xs font-semibold text-[#DC2626]">
          {error}
        </p>
      )}
    </div>
  );
}
