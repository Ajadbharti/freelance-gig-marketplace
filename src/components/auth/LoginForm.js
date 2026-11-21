"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Landmark,
  Lock,
  LogIn,
  Mail,
  Shield,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useToast } from "@/components/ui/ToastProvider";

function GithubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loginWithProvider } = useAuth();
  const { platformMetrics } = useMarketplace();
  const { showToast } = useToast();

  const [rememberHardware, setRememberHardware] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const nextPath = searchParams.get("next") || "/dashboard/client";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data) {
    const result = await login(data.email, data.password);
    if (result.ok) {
      showToast(`Welcome back, ${result.user.name}!`, "success");
      const target =
        nextPath && nextPath !== "/login"
          ? nextPath
          : result.user.role === "freelancer"
          ? "/dashboard/freelancer"
          : "/dashboard/client";
      router.push(target);
    } else {
      showToast(result.error || "Login failed.", "error");
    }
  }

  async function handleSocial(provider) {
    await loginWithProvider(provider);
    showToast(`Signed in with ${provider.toUpperCase()}`, "success");
    router.push("/dashboard/client");
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Top Protocol Subheader matching user screenshot */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 font-mono text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="border border-slate-200 bg-slate-50 px-2 py-0.5 font-bold uppercase tracking-wider text-[#047857]">
              ■ SECURE SIGN-IN
            </span>
            <span className="text-slate-500">HTTPS // HTTPONLY SESSION COOKIE</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-700">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-[#047857]" /> BCRYPT PASSWORDS
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1">
              <Lock className="h-3.5 w-3.5 text-[#047857]" /> SIMULATED ESCROW
            </span>
          </div>
        </div>

        {/* 2-Column Split: Form (Left) + Platform Metrics (Right) */}
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left Column: Login Card */}
          <div className="border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
            <div className="inline-flex items-center gap-1.5 border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-700">
              <Shield className="h-3 w-3 text-[#047857]" />
              SECURE ESCROW AUTHENTICATION
            </div>

            <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Sign in to GigCraft
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Access your digital contracts, active sprints, and milestone disbursements.
            </p>

            {/* Social Auth Buttons */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSocial("github")}
                className="flex h-11 items-center justify-center gap-2 border border-slate-300 bg-white font-mono text-xs font-semibold uppercase tracking-wider text-slate-800 transition hover:bg-slate-50"
              >
                <GithubIcon className="h-4 w-4" />
                GitHub Workspace
              </button>
              <button
                type="button"
                onClick={() => handleSocial("google")}
                className="flex h-11 items-center justify-center gap-2 border border-slate-300 bg-white font-mono text-xs font-semibold uppercase tracking-wider text-slate-800 transition hover:bg-slate-50"
              >
                <span className="font-bold text-blue-600">G</span>
                Google Cloud Identity
              </button>
            </div>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-slate-400">
              <span className="h-px flex-1 bg-slate-200" />
              OR WITH WORK EMAIL
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="login-email" className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-800">
                    CORPORATE EMAIL
                  </label>
                  <span className="font-mono text-[10px] font-bold text-slate-500">REQUIRED</span>
                </div>
                <div className="relative mt-1.5 flex h-11 items-center border border-slate-300 bg-white focus-within:border-slate-800">
                  <span className="px-3 font-mono text-sm text-slate-400">@</span>
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@company.com"
                    className="h-full w-full bg-transparent pr-3 font-mono text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    {...register("email", { required: "Email is required" })}
                  />
                </div>
                {errors.email && (
                  <p role="alert" className="mt-1 font-mono text-xs text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="login-pass" className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-800">
                    ACCESS KEY / PASSWORD
                  </label>
                  <Link href="/register" className="font-mono text-xs font-semibold text-[#047857] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative mt-1.5 flex h-11 items-center border border-slate-300 bg-white focus-within:border-slate-800">
                  <span className="px-3 text-slate-400 shrink-0">
                    <KeyRound className="h-4 w-4" />
                  </span>
                  <input
                    id="login-pass"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="h-full flex-1 bg-transparent px-1 font-mono text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    {...register("password", { required: "Password is required" })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="mr-3 flex h-7 w-7 shrink-0 items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p role="alert" className="mt-1 font-mono text-xs text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={rememberHardware}
                    onChange={(e) => setRememberHardware(e.target.checked)}
                    className="h-4 w-4 rounded-none accent-[#047857]"
                  />
                  <span>Keep me signed in on this hardware</span>
                </label>
                <span className="flex items-center gap-1 border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[10px] text-slate-600">
                  <ShieldCheck className="h-3 w-3 text-[#047857]" /> HTTPS session
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-12 w-full items-center justify-center gap-2 bg-[#047857] font-mono text-sm font-bold uppercase tracking-wider text-white shadow-[2px_2px_0px_#0F172A] transition hover:bg-[#065f46] active:translate-x-[1px] active:translate-y-[1px] disabled:opacity-70"
              >
                <LogIn className="h-4 w-4" />
                <span>{isSubmitting ? "Authenticating..." : "Sign In to Workspace"}</span>
              </button>

              {/* Bottom Register Switch */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 pt-4 font-mono text-xs text-slate-600">
                <span>Don&apos;t have an enterprise account?</span>
                <div className="flex items-center gap-2">
                  <Link
                    href="/register?role=client"
                    className="border border-slate-200 px-2 py-1 uppercase text-slate-900 transition hover:bg-slate-100 font-semibold"
                  >
                    SIGN UP AS CLIENT
                  </Link>
                  <Link
                    href="/register?role=freelancer"
                    className="border border-slate-200 px-2 py-1 uppercase text-slate-900 transition hover:bg-slate-100 font-semibold"
                  >
                    APPLY AS FREELANCER
                  </Link>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column: Platform Metrics & Telemetry matching user screenshot */}
          <div className="space-y-5">
            {/* Header Bar */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-800">
                PLATFORM METRICS
              </span>
              <span className="bg-[#047857] px-2 py-0.5 font-mono text-[10px] font-bold text-white uppercase tracking-wider">
                LIVE DATA
              </span>
            </div>

            {/* 2x2 Grid of Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-slate-200 bg-white p-4 shadow-sm">
                <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">PUBLISHED GIGS</p>
                <p suppressHydrationWarning className="mt-1 font-serif text-3xl font-bold text-slate-950">
                  {platformMetrics.publishedGigs}
                </p>
              </div>
              <div className="border border-slate-200 bg-white p-4 shadow-sm">
                <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">FREELANCERS</p>
                <p suppressHydrationWarning className="mt-1 font-serif text-3xl font-bold text-slate-950">
                  {platformMetrics.freelancersCount}
                </p>
              </div>
              <div className="border border-slate-200 bg-white p-4 shadow-sm">
                <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">COMPLETED ORDERS</p>
                <p suppressHydrationWarning className="mt-1 font-serif text-3xl font-bold text-slate-950">
                  {platformMetrics.completedOrders}
                </p>
              </div>
              <div className="border border-slate-200 bg-white p-4 shadow-sm">
                <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">AVERAGE RATING</p>
                <p suppressHydrationWarning className="mt-1 font-serif text-3xl font-bold text-slate-950">
                  {platformMetrics.averageRating} ★
                </p>
              </div>
            </div>

            {/* Simulated Escrow Released Card */}
            <div className="border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">SIMULATED ESCROW RELEASED</p>
                  <p suppressHydrationWarning className="mt-1 font-serif text-3xl font-bold tracking-tight text-slate-950">
                    ₹{platformMetrics.totalEscrowReleased.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center border border-slate-200 bg-[#eef4ff] text-[#0047bf]">
                  <Landmark className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Demo payments only. No real money moves on GigCraft.
              </p>
            </div>

            {/* Real Verified Review Card */}
            {platformMetrics.featuredReview && (
              <div className="border border-slate-200 bg-white p-5 shadow-sm">
                <div suppressHydrationWarning className="flex items-center gap-1 text-[#047857] text-sm">
                  {"★".repeat(platformMetrics.featuredReview.rating || 5)}
                </div>
                <p suppressHydrationWarning className="mt-2 text-xs italic leading-relaxed text-slate-800">
                  “{platformMetrics.featuredReview.comment}”
                </p>
                <p suppressHydrationWarning className="mt-3 border-t border-slate-100 pt-2 text-[11px] text-slate-600">
                  <span className="font-semibold text-slate-900">{platformMetrics.featuredReview.clientName}</span> on “{platformMetrics.featuredReview.gigTitle}”
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
