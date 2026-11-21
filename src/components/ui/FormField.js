export const inputClass =
  "w-full px-4 py-2.5 bg-white border border-[#6e7a73] text-[#0b1c30] text-sm focus:border-2 focus:border-[#0b1c30] focus:outline-none transition-colors";

export default function FormField({ id, label, error, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-mono text-xs font-semibold uppercase tracking-wider text-[#0b1c30]">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 font-mono text-[11px] text-[#3e4943]">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 font-mono text-xs font-semibold text-[#ba1a1a]">
          {error}
        </p>
      )}
    </div>
  );
}
