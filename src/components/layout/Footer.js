import Link from "next/link";
import { categories } from "@/data/categories";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
              G
            </span>
            <span className="text-xl font-bold text-slate-900">GigNest</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-slate-600">
            A demo freelance marketplace where clients discover talent and freelancers sell digital services.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">Categories</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            {categories.slice(0, 5).map((c) => (
              <li key={c.slug}>
                <Link href={`/gigs?category=${c.slug}`} className="transition hover:text-indigo-600">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">For freelancers</h3>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            <li>
              <Link href="/register?role=freelancer" className="transition hover:text-indigo-600">
                Become a freelancer
              </Link>
            </li>
            <li>
              <Link href="/dashboard/freelancer" className="transition hover:text-indigo-600">
                Freelancer dashboard
              </Link>
            </li>
            <li>
              <Link href="/dashboard/freelancer/gigs/new" className="transition hover:text-indigo-600">
                Create a gig
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900">Demo notice</h3>
          <p className="mt-4 text-sm text-slate-600">
            This is a frontend-only demo. Data is mock data saved in your browser (LocalStorage), and login is
            demo authentication, not production-secure. No real payments or messages are processed.
          </p>
        </div>
      </div>
      <div className="border-t border-slate-200 py-5 text-center text-xs text-slate-500">
        © 2026 GigNest demo project. Not affiliated with any real marketplace.
      </div>
    </footer>
  );
}