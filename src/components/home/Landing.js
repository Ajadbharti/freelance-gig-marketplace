"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowRight, Briefcase, Search, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/ToastProvider";
import SocialButtons from "@/components/auth/SocialButtons";
import FormField, { inputClass } from "@/components/ui/FormField";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FEATURES = [
  {
    icon: Search,
    title: "Find the right talent",
    text: "Search by skill, category, price and rating to shortlist the best gigs in minutes.",
  },
  {
    icon: ShieldCheck,
    title: "Order with confidence",
    text: "Track every order, ask for revisions and approve work only when you are happy.",
  },
  {
    icon: Briefcase,
    title: "Sell your skills",
    text: "Publish gigs, receive orders and build a profile with real client reviews.",
  },
];

function dashboardFor(user) {
  if (user.role === "admin") return "/admin";
  return user.role === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client";
}

function EmailLogin() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();
  const [formError, setFormError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: "", password: "" } });

  async function onSubmit(values) {
    setFormError("");
    const result = await login(values.email, values.password);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    showToast(`Welcome back, ${result.user.name.split(" ")[0]}!`);
    router.push(result.user.needsRole ? "/welcome" : dashboardFor(result.user));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {formError && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {formError}
        </p>
      )}

      <FormField id="landing-email" label="Email" error={errors.email?.message}>
        <input
          id="landing-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "landing-email-error" : undefined}
          className={inputClass}
          {...register("email", {
            required: "Email is required.",
            pattern: { value: EMAIL_PATTERN, message: "Enter a valid email address." },
          })}
        />
      </FormField>

      <FormField id="landing-password" label="Password" error={errors.password?.message}>
        <input
          id="landing-password"
          type="password"
          autoComplete="current-password"
          placeholder="Your password"
          aria-invalid={errors.password ? "true" : "false"}
          aria-describedby={errors.password ? "landing-password-error" : undefined}
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
  );
}

export default function Landing() {
  return (
    <>
      <section className="bg-gradient-to-b from-indigo-50 via-white to-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
              <Sparkles className="h-3.5 w-3.5" /> Hire talent. Sell your skills.
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Find the Right Freelancer for Your Next Big Idea.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-600">
              GigNest connects clients with freelancers for web development, design, writing, video and marketing.
              Sign in to order a service, or create your own gigs and start earning.
            </p>
            <Link
              href="/gigs"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
            >
              Browse gigs without signing in <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-bold text-slate-900">Welcome to GigNest</h2>
            <p className="mt-1 text-sm text-slate-600">Log in or create an account to get started.</p>

            <div className="mt-6">
              <SocialButtons />
            </div>

            <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wide text-slate-400">
              <span className="h-px flex-1 bg-slate-200" />
              or log in with email
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <EmailLogin />

                       <p className="mt-6 text-center text-sm text-slate-600">
              New to GigNest?{" "}
              <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-700">
                Create an account
              </Link>
            </p>
            <p className="mt-3 text-center text-xs text-slate-500">
              <Link href="/login?as=admin" className="hover:text-indigo-600">
                Admin login
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{feature.text}</p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}