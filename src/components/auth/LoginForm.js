"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/ToastProvider";
import AuthCard from "@/components/auth/AuthCard";
import FormField, { inputClass } from "@/components/ui/FormField";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Sirf apni site ke andar ke paths allow karo (open redirect se bachne ke liye)
function getSafeNext(value) {
  if (value && value.startsWith("/") && !value.startsWith("//")) return value;
  return null;
}

function dashboardFor(user) {
  return user.role === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client";
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, hydrated, login } = useAuth();
  const { showToast } = useToast();
  const [redirecting, setRedirecting] = useState(false);
  const [formError, setFormError] = useState("");

  const next = getSafeNext(searchParams.get("next"));

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: "", password: "" } });

  // Pehle se logged in ho to login page nahi dikhana
  useEffect(() => {
    if (hydrated && user && !redirecting) {
      router.replace(next ?? dashboardFor(user));
    }
  }, [hydrated, user, redirecting, next, router]);

  async function onSubmit(values) {
    setFormError("");
    const result = await login(values.email, values.password);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    setRedirecting(true);
    showToast(`Welcome back, ${result.user.name.split(" ")[0]}!`);
    router.push(next ?? dashboardFor(result.user));
  }

  return (
    <AuthCard
      title="Log in"
      subtitle="Welcome back. Log in to manage your orders and gigs."
      footer={
        <>
          New to GigNest?{" "}
          <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
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
          disabled={isSubmitting}
          className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>
      </form>
    </AuthCard>
  );
}