"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { categories } from "@/data/categories";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useToast } from "@/components/ui/ToastProvider";
import FormField, { inputClass } from "@/components/ui/FormField";

const toList = (text) =>
  text
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const isInt = (value, min, max) => {
  const n = Number(value);
  return String(value).trim() !== "" && Number.isInteger(n) && n >= min && n <= max;
};

export default function GigForm({ gig, onDone }) {
  const router = useRouter();
  const { addGig, updateGig } = useMarketplace();
  const { showToast } = useToast();
  const editing = Boolean(gig);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: gig?.title ?? "",
      description: gig?.description ?? "",
      category: gig?.category ?? "",
      price: gig ? String(gig.price) : "",
      deliveryDays: gig ? String(gig.deliveryDays) : "",
      revisions: gig ? String(gig.revisions) : "2",
      image: gig?.image ?? "",
      skills: gig ? gig.skills.join(", ") : "",
      tags: gig ? gig.tags.join(", ") : "",
    },
  });

  const field = (name) => ({
    "aria-invalid": errors[name] ? "true" : "false",
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  function onSubmit(values) {
    const slug = values.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 30);

    const data = {
      title: values.title.trim(),
      description: values.description.trim(),
      category: values.category,
      price: Number(values.price),
      deliveryDays: Number(values.deliveryDays),
      revisions: Number(values.revisions),
      image: values.image.trim() || `https://picsum.photos/seed/${slug || "new-gig"}/800/500`,
      skills: toList(values.skills),
      tags: toList(values.tags),
    };

    if (editing) {
      const result = updateGig(gig.id, data);
      if (!result.ok) {
        showToast(result.error, "error");
        return;
      }
      showToast("Gig updated successfully.");
      onDone?.();
      return;
    }

    const result = addGig(data);
    if (!result.ok) {
      showToast(result.error, "error");
      return;
    }
    showToast("Gig published successfully!");
    router.push("/dashboard/freelancer");
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className={editing ? "space-y-4" : "space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"}
    >
      <FormField id="title" label="Gig title" error={errors.title?.message} hint="Example: I will build a responsive website">
        <input
          id="title"
          type="text"
          className={inputClass}
          {...field("title")}
          {...register("title", {
            required: "Title is required.",
            minLength: { value: 10, message: "Title must be at least 10 characters." },
            maxLength: { value: 100, message: "Keep the title under 100 characters." },
          })}
        />
      </FormField>

      <FormField id="description" label="Description" error={errors.description?.message}>
        <textarea
          id="description"
          rows={5}
          className={inputClass}
          {...field("description")}
          {...register("description", {
            required: "Description is required.",
            minLength: { value: 30, message: "Description must be at least 30 characters." },
            maxLength: { value: 1000, message: "Keep the description under 1000 characters." },
          })}
        />
      </FormField>

      <FormField id="category" label="Category" error={errors.category?.message}>
        <select
          id="category"
          className={inputClass}
          {...field("category")}
          {...register("category", { required: "Please choose a category." })}
        >
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </FormField>

      <div className="grid gap-4 sm:grid-cols-3">
        <FormField id="price" label="Price (USD)" error={errors.price?.message}>
          <input
            id="price"
            type="number"
            min="5"
            className={inputClass}
            {...field("price")}
            {...register("price", {
              validate: (v) => isInt(v, 5, 10000) || "Enter a whole number from 5 to 10000.",
            })}
          />
        </FormField>
        <FormField id="deliveryDays" label="Delivery (days)" error={errors.deliveryDays?.message}>
          <input
            id="deliveryDays"
            type="number"
            min="1"
            className={inputClass}
            {...field("deliveryDays")}
            {...register("deliveryDays", {
              validate: (v) => isInt(v, 1, 90) || "Enter 1 to 90 days.",
            })}
          />
        </FormField>
        <FormField id="revisions" label="Revisions" error={errors.revisions?.message}>
          <input
            id="revisions"
            type="number"
            min="0"
            className={inputClass}
            {...field("revisions")}
            {...register("revisions", {
              validate: (v) => isInt(v, 0, 10) || "Enter 0 to 10 revisions.",
            })}
          />
        </FormField>
      </div>

      <FormField
        id="image"
        label="Cover image URL (optional)"
        hint="Leave empty to get a sample image."
        error={errors.image?.message}
      >
        <input
          id="image"
          type="url"
          placeholder="https://..."
          className={inputClass}
          {...field("image")}
          {...register("image", {
            pattern: { value: /^$|^https?:\/\/\S+$/i, message: "Enter a valid http(s) image URL." },
          })}
        />
      </FormField>

      <FormField id="skills" label="Skills" hint="Separate with commas." error={errors.skills?.message}>
        <input
          id="skills"
          type="text"
          placeholder="React, Tailwind CSS"
          className={inputClass}
          {...field("skills")}
          {...register("skills", {
            validate: (v) => toList(v).length > 0 || "Add at least one skill.",
          })}
        />
      </FormField>

      <FormField id="tags" label="Tags (optional)" hint="Separate with commas." error={errors.tags?.message}>
        <input
          id="tags"
          type="text"
          placeholder="website, frontend"
          className={inputClass}
          {...field("tags")}
          {...register("tags")}
        />
      </FormField>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => (editing ? onDone?.() : router.push("/dashboard/freelancer"))}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          {editing ? "Save changes" : "Publish gig"}
        </button>
      </div>
    </form>
  );
}