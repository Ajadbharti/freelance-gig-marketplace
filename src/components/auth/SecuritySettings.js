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
      className="space-y-4 card-neo"
    >
      <h2 className="font-headline text-lg font-bold uppercase tracking-wide text-[#0b1c30]">Change password</h2>

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
        className="btn-primary"
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
    <section className="card-neo border border-[#ba1a1a]/30 bg-[#ffdad6]/20">
      <h2 className="font-headline text-lg font-bold uppercase tracking-wide text-[#ba1a1a]">Delete account</h2>
      <p className="mt-2 text-sm text-[#3e4943]">
        This permanently deletes your account, gigs, orders and reviews. It cannot be undone. You must finish or
        cancel your open orders first.
      </p>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-danger mt-4"
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
            <p role="alert" className="border border-[#ba1a1a] bg-[#ffdad6] p-3 text-xs font-bold text-[#ba1a1a]">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={close}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={busy || confirmText !== "DELETE"}
              className="btn-danger"
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