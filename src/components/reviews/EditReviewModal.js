"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import RatingStars from "@/components/ui/RatingStars";
import FormField, { inputClass } from "@/components/ui/FormField";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useToast } from "@/components/ui/ToastProvider";
import { createClient } from "@/lib/supabase/client";

function EditForm({ review, onClose }) {
  const { refreshPublic } = useMarketplace();
  const { showToast } = useToast();
  const [rating, setRating] = useState(review.rating);
  const [ratingError, setRatingError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { comment: review.comment } });

  async function onSubmit({ comment }) {
    if (rating < 1) {
      setRatingError("Please select a rating from 1 to 5.");
      return;
    }
    const { error } = await createClient().rpc("update_review", {
      p_review: review.id,
      p_rating: rating,
      p_comment: comment,
    });
    if (error) {
      showToast(error.message || "Could not update the review.", "error");
      return;
    }
    await refreshPublic();
    showToast("Review updated.");
    onClose();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
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

      <FormField id="edit-comment" label="Your feedback" error={errors.comment?.message}>
        <textarea
          id="edit-comment"
          rows={4}
          aria-invalid={errors.comment ? "true" : "false"}
          aria-describedby={errors.comment ? "edit-comment-error" : undefined}
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
          disabled={isSubmitting}
          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          {isSubmitting ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}

export default function EditReviewModal({ review, open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Edit your review">
      {review && <EditForm key={review.id} review={review} onClose={onClose} />}
    </Modal>
  );
}