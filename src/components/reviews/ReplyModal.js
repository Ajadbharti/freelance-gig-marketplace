"use client";

import { useForm } from "react-hook-form";
import Modal from "@/components/ui/Modal";
import FormField, { inputClass } from "@/components/ui/FormField";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useToast } from "@/components/ui/ToastProvider";
import { createClient } from "@/lib/supabase/client";

function ReplyForm({ review, onClose }) {
  const { refreshPublic } = useMarketplace();
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { reply: review.reply ?? "" } });

  async function onSubmit({ reply }) {
    const { error } = await createClient().rpc("reply_to_review", {
      p_review: review.id,
      p_reply: reply,
    });
    if (error) {
      showToast(error.message || "Could not save your reply.", "error");
      return;
    }
    await refreshPublic();
    showToast(reply.trim() ? "Reply published." : "Reply removed.");
    onClose();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="rounded-xl bg-slate-50 p-4 text-sm">
        <p className="font-semibold text-slate-900">{review.clientName} wrote:</p>
        <p className="mt-1 text-slate-700">{review.comment}</p>
      </div>

      <FormField
        id="reply"
        label="Your reply"
        hint="Be polite and professional. Leave it empty and save to remove your reply."
        error={errors.reply?.message}
      >
        <textarea
          id="reply"
          rows={4}
          aria-invalid={errors.reply ? "true" : "false"}
          aria-describedby={errors.reply ? "reply-error" : undefined}
          className={inputClass}
          {...register("reply", {
            validate: (value) => {
              const text = value.trim();
              return text === "" || (text.length >= 2 && text.length <= 500) || "Reply must be 2 to 500 characters.";
            },
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
          {isSubmitting ? "Saving..." : "Save reply"}
        </button>
      </div>
    </form>
  );
}

export default function ReplyModal({ review, open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Reply to review">
      {review && <ReplyForm key={review.id} review={review} onClose={onClose} />}
    </Modal>
  );
}