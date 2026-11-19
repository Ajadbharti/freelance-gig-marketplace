"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  CheckCircle2,
  Globe,
  KeyRound,
  Lock,
  Mail,
  Shield,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

function GithubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/ToastProvider";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loginWithProvider } = useAuth();
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
      email: "developer@agency.in",
      password: "••••••••••••",
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
    <div className="min-h-screen bg-[#FBFBFB] py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Protocol Breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="flex h-3.5 w-3.5 items-center justify-center bg-[#0a5c36] text-[9px] text-white">■</span>
            <span className="bg-slate-100 px-2 py-0.5 font-bold uppercase tracking-wider text-slate-800">
              AUTH-GATEWAY // NODE-04: SECURE
            </span>
            <span className="text-slate-400">|</span>
            <span>PROTOCOL: TLS 1.3 / E2EE VERIFIED</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-slate-700">
              <ShieldCheck className="h-3.5 w-3.5 text-[#0a5c36]" /> SOC-2 TYPE II
            </span>
            <span className="flex items-center gap-1 text-slate-700">
              <Lock className="h-3.5 w-3.5 text-[#0a5c36]" /> MULTI-SIG ESCROW ACTIVE
            </span>
          </div>
        </div>

        {/* 2-Column Split: Form (Left) + Telemetry (Right) */}
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Left Column: Login Card */}
          <div className="border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
            <div className="inline-flex items-center gap-1.5 border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-700">
              <Shield className="h-3 w-3 text-[#0a5c36]" />
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
                  <label className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-800">
                    CORPORATE EMAIL
                  </label>
                  <span className="font-mono text-[10px] font-bold text-slate-500">REQUIRED</span>
                </div>
                <div className="relative mt-1.5 flex h-11 items-center border border-slate-300 bg-white">
                  <span className="px-3 font-mono text-sm text-slate-400">@</span>
                  <input
                    type="email"
                    {...register("email", { required: true })}
                    className="h-full flex-1 px-1 font-sans text-sm text-slate-900 focus:outline-none"
                    placeholder="developer@agency.io"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-800">
                    ACCESS KEY / PASSWORD
                  </label>
                  <Link
                    href="/login?reset=1"
                    className="font-mono text-xs text-slate-600 underline hover:text-[#0a5c36]"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative mt-1.5 flex h-11 items-center border border-slate-300 bg-white">
                  <span className="px-3 text-slate-400">
                    <KeyRound className="h-4 w-4" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", { required: true })}
                    className="h-full flex-1 px-1 font-sans text-sm text-slate-900 focus:outline-none"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="px-3 text-slate-400 hover:text-slate-600"
                  >
                    👁
                  </button>
                </div>
              </div>

              {/* Checkbox and 2FA label */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-sans text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={rememberHardware}
                    onChange={(e) => setRememberHardware(e.target.checked)}
                    className="h-4 w-4 rounded-none accent-[#0a5c36]"
                  />
                  <span>Keep me signed in on this hardware</span>
                </label>
                <span className="font-mono text-[11px] text-slate-500">
                  Hardware 2FA Prompted
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-12 w-full items-center justify-center gap-2 bg-[#0a5c36] font-mono text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#084c2c] disabled:opacity-50"
              >
                → Sign In to Workspace
              </button>

              {/* Quick Login Switcher for Demo Ease */}
              <div className="rounded border border-dashed border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-600">
                <p className="font-semibold text-slate-800 uppercase text-[10px]">Quick Demo Logins:</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setValue("email", "developer@agency.in");
                      setValue("password", "demo123");
                    }}
                    className="border border-slate-300 bg-white px-2 py-1 text-[11px] hover:border-[#0a5c36]"
                  >
                    Client: developer@agency.in
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setValue("email", "ananya@gigcraft.in");
                      setValue("password", "demo123");
                    }}
                    className="border border-slate-300 bg-white px-2 py-1 text-[11px] hover:border-[#0a5c36]"
                  >
                    Freelancer: ananya@gigcraft.in
                  </button>
                </div>
              </div>

              {/* Bottom Register Switch */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100 pt-4 font-mono text-xs text-slate-600">
                <span>Don't have an enterprise account?</span>
                <div className="flex items-center gap-2">
                  <Link
                    href="/register?role=client"
                    className="border border-slate-200 px-2 py-1 uppercase text-slate-900 transition hover:bg-slate-100"
                  >
                    SIGN UP AS CLIENT
                  </Link>
                  <Link
                    href="/register?role=freelancer"
                    className="border border-slate-200 px-2 py-1 uppercase text-slate-900 transition hover:bg-slate-100"
                  >
                    APPLY AS FREELANCER
                  </Link>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column: Platform Ledger & Telemetry */}
          <div className="space-y-6">
            {/* Box 1: Platform Ledger */}
            <div className="border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
                  PLATFORM LEDGER & METRICS
                </span>
                <span className="border border-emerald-300 bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-[#0a5c36]">
                  REAL-TIME
                </span>
              </div>

              <div className="mt-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-xs uppercase text-slate-500">ACTIVE ESCROW LIQUIDITY</p>
                    <p className="mt-1 font-serif text-3xl font-bold tracking-tight text-slate-950">
                      ₹18,42,50,000
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center border border-slate-200 bg-slate-50 text-slate-700">
                    🏛
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-3">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-slate-500">Disbursement Allocation</span>
                    <span className="font-bold text-slate-900">94.8% SLA Clearance</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full bg-slate-100">
                    <div className="h-full bg-[#0a5c36] w-[94.8%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Box 2: Candidate Acceptance Rate */}
            <div className="border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
                  CANDIDATE ACCEPTANCE RATE
                </span>
                <span className="border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[10px] text-slate-600">
                  ASSESSED
                </span>
              </div>
              <p className="mt-2 font-serif text-2xl font-bold text-slate-950">
                Top 1.4% Verified
              </p>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Strict algorithmic code assessments, system design interviews, and identity KYC.
              </p>
            </div>

            {/* Box 3: Verified Buyer Testimonial */}
            <div className="border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-1 text-amber-500 text-xs">
                ★★★★★ <span className="ml-2 font-mono text-[10px] font-bold uppercase text-slate-700">VERIFIED BUYER</span>
              </div>
              <p className="mt-3 text-xs italic leading-relaxed text-slate-700">
                “We migrated all 24 external distributed systems contracts to GigCraft. The multi-sig milestone escrow eliminates payment disputes entirely.”
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 font-mono text-[11px]">
                <div>
                  <p className="font-bold text-slate-900">Manoj Varma</p>
                  <p className="text-[10px] text-slate-500">VP Infrastructure @ HyperLayer India (Bengaluru)</p>
                </div>
                <span className="border border-slate-200 bg-slate-50 px-2 py-1 text-slate-700">
                  ₹3.4 Cr+ Transacted
                </span>
              </div>
            </div>

            {/* Box 4: Security Indicators */}
            <div className="border border-slate-200 bg-white p-5 font-mono text-xs space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-600">Zero-Knowledge Token Proof</span>
                <span className="font-bold text-[#0a5c36]">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-600">Hardware Security Module (HSM)</span>
                <span className="font-bold text-slate-900">FIPS 140-2 LEVEL 3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Instant Automated Escrow Release</span>
                <span className="font-bold text-[#0a5c36]">UPON GIT COMMIT VERIFY</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Security Row */}
        <div className="mt-8 grid gap-4 border border-slate-200 bg-white p-6 sm:grid-cols-3 shadow-sm">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-[#0a5c36]" />
            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
                SOC-2 & CERT-IN COMPLIANT
              </h4>
              <p className="mt-1 text-xs text-slate-600">
                Continuous audits ensure complete financial and credential protection across Indian & global entities.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 border-slate-200 sm:border-l sm:pl-4">
            <Lock className="mt-1 h-5 w-5 shrink-0 text-[#0a5c36]" />
            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
                RBI COMPLIANT ESCROW VAULT
              </h4>
              <p className="mt-1 text-xs text-slate-600">
                Funds are held neutral in nodal escrow accounts until acceptance criteria and code deliverable verification meet specs.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 border-slate-200 sm:border-l sm:pl-4">
            <KeyRound className="mt-1 h-5 w-5 shrink-0 text-[#0a5c36]" />
            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
                256-BIT ENCRYPTION & UPI/IMPS
              </h4>
              <p className="mt-1 text-xs text-slate-600">
                Strict hardware token integration with encrypted payload transmission and instantaneous bank settlement.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Mini Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 font-mono text-xs text-slate-500">
          <span>GIGCRAFT BHARAT © 2025 GigCraft Marketplace India Inc.</span>
          <span className="uppercase tracking-wider">SECURE ACCESS PORTAL</span>
        </div>
      </div>
    </div>
  );
}
