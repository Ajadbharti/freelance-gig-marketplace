"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import RatingStars from "@/components/ui/RatingStars";
import FormField, { inputClass } from "@/components/ui/FormField";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useToast } from "@/components/ui/ToastProvider";

function ReviewForm({ order, onClose }) {
  const { addReview, getOrderGig } = useMarketplace();
  const { showToast } = useToast();
  const [rating, setRating] = useState(0);
  const [ratingError, setRatingError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { comment: "" } });

  const gig = getOrderGig(order);

  function onSubmit({ comment }) {
    if (rating < 1) {
      setRatingError("Please select a rating from 1 to 5.");
      return;
    }
    const result = addReview({ orderId: order.id, rating, comment });
    if (!result.ok) {
      showToast(result.error, "error");
      return;
    }
    showToast("Thank you! Your review has been published.");
    onClose();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {gig?.title && <p className="rounded-xl bg-slate-50 p-3 text-sm font-medium text-slate-800">{gig.title}</p>}

      <div>
        <p className="mb-1.5 text-sm font-medium text-slate-800">Your rating</p>
        <RatingStars
          rating={rating}
          size={30}
          onChange={(value) => {
            setRating(value);
            setRatingError("");
          }}
        />
        {ratingError && (
          <p role="alert" className="mt-1.5 text-sm text-red-600">
            {ratingError}
          </p>
        )}
      </div>

      <FormField id="comment" label="Your feedback" error={errors.comment?.message}>
        <textarea
          id="comment"
          rows={4}
          placeholder="How was your experience working with this freelancer?"
          aria-invalid={errors.comment ? "true" : "false"}
          aria-describedby={errors.comment ? "comment-error" : undefined}
          className={inputClass}
          {...register("comment", {
            required: "Please write a short review.",
            minLength: { value: 10, message: "Please write at least 10 characters." },
            maxLength: { value: 500, message: "Keep your review under 500 characters." },
          })}
        />
      </FormField>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Submit review
        </button>
      </div>
    </form>
  );
}

export default function ReviewModal({ order, open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Review your order">
      {order && <ReviewForm key={order.id} order={order} onClose={onClose} />}
    </Modal>
  );
}