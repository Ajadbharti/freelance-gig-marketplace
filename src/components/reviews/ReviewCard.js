import RatingStars from "@/components/ui/RatingStars";
import { formatDate } from "@/lib/utils";

export default function ReviewCard({ review }) {
  const initial = (review.clientName || "?").charAt(0).toUpperCase();

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700"
        >
          {initial}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">{review.clientName}</p>
          <p className="text-xs text-slate-500">{formatDate(review.createdAt)}</p>
        </div>
        <RatingStars rating={review.rating} />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-700">{review.comment}</p>
    </article>
  );
}
