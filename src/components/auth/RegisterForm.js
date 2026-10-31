"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Briefcase, ShoppingBag } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useToast } from "@/components/ui/ToastProvider";
import AuthCard, { DemoNotice } from "@/components/auth/AuthCard";
import FormField, { inputClass } from "@/components/ui/FormField";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ROLES = [
  { value: "client", label: "Client", text: "I want to hire freelancers", icon: ShoppingBag },
  { value: "freelancer", label: "Freelancer", text: "I want to sell my services", icon: Briefcase },
];

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, hydrated, register: registerUser } = useAuth();
  const { createFreelancerProfile } = useMarketplace();
  const { showToast } = useToast();
  const [redirecting, setRedirecting] = useState(false);

  const initialRole = searchParams.get("role") === "freelancer" ? "freelancer" : "client";

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", role: initialRole },
  });

  useEffect(() => {
    if (hydrated && user && !redirecting) {
      router.replace(user.role === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client");
    }
  }, [hydrated, user, redirecting, router]);

  function onSubmit(values) {
    const result = registerUser({
      name: values.name,
      email: values.email,
      password: values.password,
      role: values.role,
    });
    if (!result.ok) {
      setError("email", { type: "server", message: result.error });
      return;
    }
    setRedirecting(true);
    if (values.role === "freelancer") {
      createFreelancerProfile(result.user);
      showToast("Account created! Complete your profile and publish your first gig.");
      router.push("/dashboard/freelancer");
    } else {
      showToast("Account created! You can now browse gigs and place orders.");
      router.push("/dashboard/client");
    }
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Join as a client or a freelancer. It takes less than a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Log in
          </Link>
        </>
      }
    >
      <DemoNotice>
        <p className="font-semibold">Demo authentication only</p>
        <p className="mt-1">
          Your account is saved only in this browser (LocalStorage). Do not use a real password or real personal
          data.
        </p>
      </DemoNotice>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
        <fieldset>
          <legend className="mb-1.5 block text-sm font-medium text-slate-800">I am joining as</legend>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map((role) => {
              const Icon = role.icon;
              return (
                <label key={role.value} className="cursor-pointer">
                  <input type="radio" value={role.value} className="peer sr-only" {...register("role")} />
                  <div className="h-full rounded-xl border border-slate-300 p-4 transition peer-checked:border-indigo-600 peer-checked:bg-indigo-50 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500">
                    <Icon className="h-5 w-5 text-indigo-600" />
                    <p className="mt-2 text-sm font-semibold text-slate-900">{role.label}</p>
                    <p className="mt-1 text-xs text-slate-600">{role.text}</p>
                  </div>
                </label>
              );
            })}
          </div>
        </fieldset>

        <FormField id="name" label="Full name" error={errors.name?.message}>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
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

        <FormField id="password" label="Password" error={errors.password?.message} hint="At least 6 characters.">
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            aria-invalid={errors.password ? "true" : "false"}
            aria-describedby={errors.password ? "password-error" : undefined}
            className={inputClass}
            {...register("password", {
              required: "Password is required.",
              minLength: { value: 6, message: "Password must be at least 6 characters." },
            })}
          />
        </FormField>

        <FormField id="confirmPassword" label="Confirm password" error={errors.confirmPassword?.message}>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            aria-invalid={errors.confirmPassword ? "true" : "false"}
            aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
            className={inputClass}
            {...register("confirmPassword", {
              required: "Please confirm your password.",
              validate: (value) => value === getValues("password") || "Passwords do not match.",
            })}
          />
        </FormField>

        <button
          type="submit"
          className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
          Create account
        </button>
      </form>
    </AuthCard>
  );
}