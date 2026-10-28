import Link from "next/link";
import {
  Code,
  LayoutDashboard,
  Palette,
  PenLine,
  Share2,
  Smartphone,
  TrendingUp,
  Video,
} from "lucide-react";

const ICONS = { Code, Palette, TrendingUp, Video, PenLine, LayoutDashboard, Smartphone, Share2 };

export default function CategoryCard({ category }) {
  const Icon = ICONS[category.icon] ?? Code;

  return (
    <Link
      href={`/gigs?category=${category.slug}`}
      className="group flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
        <Icon className="h-6 w-6" />
      </span>
      <span className="text-sm font-semibold text-slate-900">{category.name}</span>
    </Link>
  );
}