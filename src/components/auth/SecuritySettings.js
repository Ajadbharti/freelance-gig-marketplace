"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/ToastProvider";
import { createClient } from "@/lib/supabase/client";
import FormField, { inputClass } from "@/components/ui/FormField";
import Modal from "@/components/ui/Modal";

function ChangePassword() {
  const { showToast } = useToast();
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { password: "", confirm: "" } });

  async function onSubmit(values) {
    const { error } = await createClient().auth.updateUser({ password: values.password });
    if (error) {
      showToast(error.message || "Could not change the password.", "error");
      return;
    }
    reset();
    showToast("Password updated.");
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-semibold text-slate-900">Change password</h2>

      <FormField id="new-password" label="New password" error={errors.password?.message} hint="At least 6 characters.">
        <input
          id="new-password"
          type="password"
          autoComplete="new-password"
          aria-invalid={errors.password ? "true" : "false"}
          aria-describedby={errors.password ? "new-password-error" : undefined}
          className={inputClass}
          {...register("password", {
            required: "Enter a new password.",
            minLength: { value: 6, message: "Password must be at least 6 characters." },
          })}
        />
      </FormField>

      <FormField id="confirm-password" label="Confirm new password" error={errors.confirm?.message}>
        <input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          aria-invalid={errors.confirm ? "true" : "false"}
          aria-describedby={errors.confirm ? "confirm-password-error" : undefined}
          className={inputClass}
          {...register("confirm", {
            required: "Please confirm your new password.",
            validate: (value) => value === getValues("password") || "Passwords do not match.",
          })}
        />
      </FormField>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
      >
        {isSubmitting ? "Updating..." : "Update password"}
      </button>
    </form>
  );
}

function DeleteAccount() {
  const router = useRouter();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function close() {
    if (busy) return;
    setOpen(false);
    setConfirmText("");
    setError("");
  }

  async function handleDelete() {
    setBusy(true);
    setError("");
    const supabase = createClient();
    const { error: rpcError } = await supabase.rpc("delete_my_account");
    if (rpcError) {
      setError(rpcError.message || "Could not delete your account.");
      setBusy(false);
      return;
    }
    await supabase.auth.signOut({ scope: "local" }).catch(() => {});
    showToast("Your account has been deleted.", "info");
    router.push("/");
  }

  return (
    <section className="rounded-2xl border border-red-200 bg-red-50/50 p-6">
      <h2 className="text-lg font-semibold text-red-800">Delete account</h2>
      <p className="mt-2 text-sm text-slate-700">
        This permanently deletes your account, gigs, orders and reviews. It cannot be undone. You must finish or
        cancel your open orders first.
      </p>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 rounded-xl border border-red-300 bg-white px-5 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50"
      >
        Delete my account
      </button>

      <Modal open={open} onClose={close} title="Delete your account?">
        <div className="space-y-4 text-sm text-slate-700">
          <p>
            Your profile, gigs, orders, messages and reviews will be removed for good. Orders shared with other
            people will disappear for them too.
          </p>
          <div>
            <label htmlFor="delete-confirm" className="mb-1.5 block font-medium text-slate-800">
              Type <strong>DELETE</strong> to confirm
            </label>
            <input
              id="delete-confirm"
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              autoComplete="off"
              className={inputClass}
            />
          </div>
          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-red-700">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={close}
              className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={busy || confirmText !== "DELETE"}
              className="rounded-lg bg-red-600 px-5 py-2 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
            >
              {busy ? "Deleting..." : "Delete account"}
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
}

export default function SecuritySettings() {
  const { user } = useAuth();

  return (
    <div className="mt-8 space-y-6">
      <ChangePassword />
      {user?.role !== "admin" && <DeleteAccount />}
    </div>
  );
}