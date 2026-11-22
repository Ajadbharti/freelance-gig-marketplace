export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-12">
      <div className="card-neo sm:p-8">
        <h1 className="font-headline text-2xl font-bold uppercase tracking-tight text-[#0b1c30]">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-[#3e4943]">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
      {footer && <p className="mt-6 text-center text-sm text-[#3e4943]">{footer}</p>}
    </div>
  );
}
