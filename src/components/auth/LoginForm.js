"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/ToastProvider";
import { DEMO_PASSWORD } from "@/data/users";
import AuthCard, { DemoNotice } from "@/components/auth/AuthCard";
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
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: { email: "", password: "" } });

  // Pehle se logged in ho to login page nahi dikhana
  useEffect(() => {
    if (hydrated && user && !redirecting) {
      router.replace(next ?? dashboardFor(user));
    }
  }, [hydrated, user, redirecting, next, router]);

  function fillDemo(email) {
    setValue("email", email);
    setValue("password", DEMO_PASSWORD);
    setFormError("");
  }

  function onSubmit(values) {
    const result = login(values.email, values.password);
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
      <DemoNotice>
        <p className="font-semibold">Demo authentication only</p>
        <p className="mt-1">
          This is not production-secure login. Accounts live in your browser (LocalStorage) and passwords are not
          protected. Never enter a real password.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => fillDemo("rohan@demo.com")}
            className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 transition hover:bg-amber-100"
          >
            Fill client demo
          </button>
          <button
            type="button"
            onClick={() => fillDemo("aarav@demo.com")}
            className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 transition hover:bg-amber-100"
          >
            Fill freelancer demo
          </button>
        </div>
        <p className="mt-3 text-xs">
          Password for all demo accounts: <strong>{DEMO_PASSWORD}</strong>. Clients: rohan@demo.com, lisa@demo.com.
          Freelancers: aarav, sofia, daniel, priya, emma, kenji (each @demo.com).
        </p>
      </DemoNotice>

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
          className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
          Log in
        </button>
      </form>
    </AuthCard>
  );
}