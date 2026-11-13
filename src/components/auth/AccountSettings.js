"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useToast } from "@/components/ui/ToastProvider";
import { createClient } from "@/lib/supabase/client";
import FormField, { inputClass } from "@/components/ui/FormField";
import ImageUploader from "@/components/ui/ImageUploader";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import { ROLE_LABELS } from "@/lib/roles";

function SettingsForm({ user }) {
  const { refreshProfile } = useAuth();
  const { refreshPublic } = useMarketplace();
  const { showToast } = useToast();
  const [avatarUrl, setAvatarUrl] = useState(user.avatar?.startsWith("http") ? user.avatar : "");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { name: user.name } });

  async function onSubmit(values) {
    const { data, error } = await createClient()
      .from("profiles")
      .update({ full_name: values.name.trim(), avatar_url: avatarUrl || null })
      .eq("id", user.id)
      .select("id");

    if (error) {
      showToast(
        error.code === "23514" ? "Name must be 2 to 50 characters." : error.message || "Could not save.",
        "error"
      );
      return;
    }
    if (!data || data.length === 0) {
      showToast("Could not save your changes.", "error");
      return;
    }

    await Promise.all([refreshProfile(), refreshPublic()]);
    showToast("Account updated.");
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="text-2xl font-bold text-slate-900">Account settings</h1>
      <p className="mt-1 text-slate-600">Update your name and profile photo.</p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <ImageUploader
          label="Profile photo"
          value={avatarUrl}
          userId={user.id}
          folder="avatar"
          maxSide={600}
          shape="avatar"
          hint="JPG, PNG or WebP, up to 5 MB. Without a photo, your initials are shown."
          onChange={setAvatarUrl}
        />

        <FormField id="name" label="Full name" error={errors.name?.message}>
          <input
            id="name"
            type="text"
            autoComplete="name"
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={inputClass}
            {...register("name", {
              required: "Name is required.",
              minLength: { value: 2, message: "Name must be at least 2 characters." },
              maxLength: { value: 50, message: "Name must be under 50 characters." },
            })}
          />
        </FormField>

        <dl className="grid gap-3 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">Email</dt>
            <dd className="break-all font-medium text-slate-900">{user.email || "-"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Account type</dt>
            <dd className="font-medium text-slate-900">{ROLE_LABELS[user.role] ?? user.role}</dd>
          </div>
        </dl>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          {isSubmitting ? "Saving..." : "Save changes"}
        </button>
      </form>
    </div>
  );
}

export default function AccountSettings() {
  const { user, hydrated } = useAuth();

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-xl space-y-4 px-4 py-12" role="status" aria-label="Loading account">
        <LoadingSkeleton className="h-8 w-1/2" />
        <LoadingSkeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Please log in</h1>
        <p className="mt-2 text-slate-600">You need to log in to open your account settings.</p>
        <Link
          href={`/login?next=${encodeURIComponent("/account")}`}
          className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Go to login
        </Link>
      </div>
    );
  }

  return <SettingsForm key={user.id} user={user} />;
}