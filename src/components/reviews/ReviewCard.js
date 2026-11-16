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

      {review.reply && (
        <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm">
          <p className="text-xs font-semibold text-slate-500">
            Reply from the freelancer{review.replyAt ? ` · ${formatDate(review.replyAt)}` : ""}
          </p>
          <p className="mt-1 leading-relaxed text-slate-700">{review.reply}</p>
        </div>
      )}
    </article>
  );
}