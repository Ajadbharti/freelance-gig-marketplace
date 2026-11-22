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
      className="group flex flex-col items-center gap-3 border border-[#e5e7eb] bg-white p-5 text-center shadow-[3px_3px_0px_#0b1c30] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0b1c30] focus:outline-none"
    >
      <span className="flex h-12 w-12 items-center justify-center border border-[#0b1c30] bg-[#eff4ff] text-[#005d42] transition group-hover:bg-[#005d42] group-hover:text-white">
        <Icon className="h-6 w-6" />
      </span>
      <span className="font-headline text-sm font-bold uppercase tracking-wide text-[#0b1c30]">{category.name}</span>
    </Link>
  );
}
