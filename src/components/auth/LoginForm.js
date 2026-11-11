"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/ToastProvider";
import AuthCard from "@/components/auth/AuthCard";
import SocialButtons from "@/components/auth/SocialButtons";
import FormField, { inputClass } from "@/components/ui/FormField";
import { dashboardPath, ROLE_LABELS } from "@/lib/roles";
import { cn } from "@/lib/utils";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROLE_TABS = ["client", "freelancer", "admin"];

const SUBTITLES = {
  client: "Log in to order services and track your orders.",
  freelancer: "Log in to manage your gigs and incoming orders.",
  admin: "Administrator access for managing users, gigs, orders and reviews.",
};

// Sirf apni site ke andar ke paths allow karo (open redirect se bachne ke liye)
function getSafeNext(value) {
  if (value && value.startsWith("/") && !value.startsWith("//")) return value;
  return null;
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, hydrated, login, logout } = useAuth();
  const { showToast } = useToast();

  const [tab, setTab] = useState(() => {
    const requested = searchParams.get("as");
    return ROLE_TABS.includes(requested) ? requested : "client";
  });
  const [busy, setBusy] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [formError, setFormError] = useState("");

  const next = getSafeNext(searchParams.get("next"));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: "", password: "" } });

  // Pehle se logged in ho to login page nahi dikhana
  useEffect(() => {
    if (hydrated && user && !redirecting && !busy) {
      router.replace(next ?? dashboardPath(user));
    }
  }, [hydrated, user, redirecting, busy, next, router]);

  async function onSubmit(values) {
    setFormError("");
    setBusy(true);

    const result = await login(values.email, values.password);
    if (!result.ok) {
      setFormError(result.error);
      setBusy(false);
      return;
    }

    // Galat tab se login: pehle bahar nikalo, phir batao
    if (result.user.role !== tab) {
      await logout();
      setFormError(
        `This is a ${ROLE_LABELS[result.user.role]} account. Please choose the "${ROLE_LABELS[result.user.role]}" tab to log in.`
      );
      setBusy(false);
      return;
    }

    setRedirecting(true);
    showToast(`Welcome back, ${result.user.name.split(" ")[0]}!`);
    router.push(next ?? dashboardPath(result.user));
  }

  return (
    <AuthCard
      title="Log in"
      subtitle={SUBTITLES[tab]}
      footer={
        tab === "admin" ? null : (
          <>
            New to GigNest?{" "}
            <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
              Create an account
            </Link>
          </>
        )
      }
    >
      <div
        className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1"
        role="radiogroup"
        aria-label="Log in as"
      >
        {ROLE_TABS.map((role) => (
          <button
            key={role}
            type="button"
            role="radio"
            aria-checked={tab === role}
            onClick={() => {
              setTab(role);
              setFormError("");
            }}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
              tab === role ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
            )}
          >
            {ROLE_LABELS[role]}
          </button>
        ))}
      </div>

      {tab !== "admin" && (
        <>
          <div className="mt-6">
            <SocialButtons />
          </div>
          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            or use email
            <span className="h-px flex-1 bg-slate-200" />
          </div>
        </>
      )}

      {tab === "admin" && (
        <p className="mt-6 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Admin accounts cannot be created here. They are set up by the site owner.
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
        {formError && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </p>
        )}

        <FormField id="email" label="Email" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={inputClass}
            {...register("email", {
              required: "Email is required.",
              pattern: { value: EMAIL_PATTERN, message: "Enter a valid email address." },
            })}
          />
        </FormField>

        <FormField id="password" label="Password" error={errors.password?.message}>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Your password"
            aria-invalid={errors.password ? "true" : "false"}
            aria-describedby={errors.password ? "password-error" : undefined}
            className={inputClass}
            {...register("password", { required: "Password is required." })}
          />
        </FormField>

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          {busy ? "Logging in..." : `Log in as ${ROLE_LABELS[tab]}`}
        </button>
      </form>
    </AuthCard>
  );
}