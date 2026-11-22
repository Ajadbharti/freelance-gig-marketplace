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
  const { showToast } = useToast();

  const [rememberHardware, setRememberHardware] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const nextPath = searchParams.get("next") || "/dashboard/client";

  const {
    register,
    handleSubmit,
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
    const result = await loginWithProvider(provider);
    if (!result.ok) {
      showToast(
        result.error ||
          `${provider.toUpperCase()} OAuth is not configured in Supabase. Please sign in with your work email.`,
        "error"
      );
      return;
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      {/* Top Protocol Header */}
      <header className="border-b border-[#e5e7eb] bg-white py-3.5 px-4 sm:px-8">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="h-3 w-3 bg-[#005d42]" />
            <span className="font-headline text-lg font-bold tracking-tight text-[#0b1c30] uppercase">
              GIGCRAFT
            </span>
          </Link>
          <Link
            href="/gigs"
            className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b1c30] hover:text-[#005d42] transition"
          >
            BACK TO MARKETPLACE
          </Link>
        </div>
      </header>

      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Subheader Protocol Indicator */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-[#e5e7eb] pb-3 font-mono text-xs text-[#3e4943]">
            <div className="flex items-center gap-2">
              <span className="border border-[#e5e7eb] bg-white px-2 py-0.5 font-bold uppercase tracking-wider text-[#005d42]">
                ■ AUTH-GATEWAY // NODE-04: SECURE
              </span>
              <span className="text-[#3e4943]">PROTOCOL: TLS 1.3 / E2EE VERIFIED</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-[#3e4943]">
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-[#005d42]" /> SOC-2 TYPE II
              </span>
              <span className="text-[#e5e7eb]">|</span>
              <span className="flex items-center gap-1">
                <Lock className="h-3.5 w-3.5 text-[#005d42]" /> MULTI-SIG ESCROW ACTIVE
              </span>
            </div>
          </div>

          {/* 2-Column Split: Form (Left) + Platform Metrics (Right) */}
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Left Column: Login Card */}
            <div className="bg-white border border-[#e5e7eb] shadow-[3px_3px_0px_#0b1c30] p-6 sm:p-10">
              <div className="inline-flex items-center gap-1.5 border border-[#e5e7eb] bg-[#eff4ff] px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#0b1c30]">
                <Shield className="h-3 w-3 text-[#005d42]" />
                SECURE ESCROW AUTHENTICATION
              </div>

              <h1 className="mt-4 font-headline text-3xl font-bold uppercase tracking-tight text-[#0b1c30] sm:text-4xl">
                Sign in to GigCraft
              </h1>
              <p className="mt-2 text-sm text-[#3e4943]">
                Access your digital contracts, active sprints, and milestone disbursements.
              </p>

              {/* Social Auth Buttons */}
              <div className="mt-8 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSocial("github")}
                  className="flex h-11 items-center justify-center gap-2 border border-[#0b1c30] bg-white font-mono text-xs font-semibold uppercase tracking-wider text-[#0b1c30] hover:bg-[#dce9ff] shadow-[2px_2px_0px_#0b1c30] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                >
                  <GithubIcon className="h-4 w-4" />
                  GitHub Workspace
                </button>
                <button
                  type="button"
                  onClick={() => handleSocial("google")}
                  className="flex h-11 items-center justify-center gap-2 border border-[#0b1c30] bg-white font-mono text-xs font-semibold uppercase tracking-wider text-[#0b1c30] hover:bg-[#dce9ff] shadow-[2px_2px_0px_#0b1c30] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                >
                  <span className="font-bold text-blue-600">G</span>
                  Google Cloud Identity
                </button>
              </div>

              {/* Divider */}
              <div className="my-6 flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-[#6e7a73]">
                <span className="h-px flex-1 bg-[#e5e7eb]" />
                OR WITH WORK EMAIL
                <span className="h-px flex-1 bg-[#e5e7eb]" />
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="login-email" className="font-mono text-xs font-semibold uppercase tracking-wider text-[#0b1c30]">
                      CORPORATE EMAIL
                    </label>
                    <span className="font-mono text-[10px] font-bold text-[#6e7a73]">REQUIRED</span>
                  </div>
                  <div className="relative mt-1.5 flex h-11 items-center border border-[#6e7a73] bg-white focus-within:border-2 focus-within:border-[#0b1c30]">
                    <span className="px-3 font-mono text-sm text-[#6e7a73]">@</span>
                    <input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      placeholder="developer@agency.io"
                      className="h-full w-full bg-transparent pr-3 font-mono text-xs text-[#0b1c30] placeholder:text-[#6e7a73] focus:outline-none"
                      {...register("email", { required: "Email is required" })}
                    />
                  </div>
                  {errors.email && (
                    <p role="alert" className="mt-1 font-mono text-xs text-[#ba1a1a]">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="login-pass" className="font-mono text-xs font-semibold uppercase tracking-wider text-[#0b1c30]">
                      ACCESS KEY / PASSWORD
                    </label>
                    <Link href="/register" className="font-mono text-xs font-semibold text-[#005d42] hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative mt-1.5 flex h-11 items-center border border-[#6e7a73] bg-white focus-within:border-2 focus-within:border-[#0b1c30]">
                    <span className="px-3 text-[#6e7a73] shrink-0">
                      <KeyRound className="h-4 w-4" />
                    </span>
                    <input
                      id="login-pass"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••••"
                      className="h-full flex-1 bg-transparent px-1 font-mono text-xs text-[#0b1c30] placeholder:text-[#6e7a73] focus:outline-none"
                      {...register("password", { required: "Password is required" })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="mr-3 flex h-7 w-7 shrink-0 items-center justify-center text-[#6e7a73] hover:text-[#0b1c30] cursor-pointer focus:outline-none"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p role="alert" className="mt-1 font-mono text-xs text-[#ba1a1a]">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-[#0b1c30]">
                    <input
                      type="checkbox"
                      checked={rememberHardware}
                      onChange={(e) => setRememberHardware(e.target.checked)}
                      className="h-4 w-4 rounded-none accent-[#005d42]"
                    />
                    <span>Keep me signed in on this hardware</span>
                  </label>
                  <span className="flex items-center gap-1 border border-[#e5e7eb] bg-[#eff4ff] px-2 py-0.5 font-mono text-[10px] text-[#0b1c30]">
                    <ShieldCheck className="h-3 w-3 text-[#005d42]" /> Hardware 2FA Prompted
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-12 w-full items-center justify-center gap-2 px-5 py-2.5 bg-[#005d42] text-white border border-[#005d42] font-semibold text-sm uppercase tracking-wide hover:bg-[#047857] shadow-[2px_2px_0px_#0b1c30] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-70"
                >
                  <LogIn className="h-4 w-4" />
                  <span>{isSubmitting ? "Authenticating..." : "→ Sign In to Workspace"}</span>
                </button>

                {/* Bottom Register Switch */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#e5e7eb] pt-4 font-mono text-xs text-[#3e4943]">
                  <span>Don&apos;t have an enterprise account?</span>
                  <div className="flex items-center gap-2">
                    <Link
                      href="/register?role=client"
                      className="border border-[#0b1c30] px-2.5 py-1 uppercase text-[#0b1c30] hover:bg-[#dce9ff] shadow-[1px_1px_0px_#0b1c30] font-semibold transition"
                    >
                      SIGN UP AS CLIENT
                    </Link>
                    <Link
                      href="/register?role=freelancer"
                      className="border border-[#0b1c30] px-2.5 py-1 uppercase text-[#0b1c30] hover:bg-[#dce9ff] shadow-[1px_1px_0px_#0b1c30] font-semibold transition"
                    >
                      APPLY AS FREELANCER
                    </Link>
                  </div>
                </div>
              </form>
            </div>

            {/* Right Column: Platform Ledger & Metrics */}
            <div className="space-y-5">
              {/* Header Bar */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b1c30]">
                  PLATFORM LEDGER & METRICS
                </span>
                <span className="bg-[#005d42] px-2 py-0.5 font-mono text-[10px] font-bold text-white uppercase tracking-wider">
                  REAL-TIME
                </span>
              </div>

              {/* Card 1: Active Escrow Liquidity */}
              <div className="bg-white border border-[#e5e7eb] shadow-[3px_3px_0px_#0b1c30] p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-wider text-[#6e7a73]">
                      ACTIVE ESCROW LIQUIDITY
                    </p>
                    <p className="mt-2 font-headline text-3xl font-bold tracking-tight text-[#0b1c30] sm:text-4xl">
                      $1,842,500.00
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center border border-[#e5e7eb] bg-[#eff4ff] text-[#005d42]">
                    <Landmark className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-5 border-t border-[#e5e7eb] pt-3">
                  <div className="flex justify-between font-mono text-xs text-[#3e4943]">
                    <span>Disbursement Allocation</span>
                    <span className="font-bold text-[#005d42]">94.8% SLA Clearance</span>
                  </div>
                  <div className="mt-2 h-2 w-full bg-[#eff4ff] border border-[#e5e7eb]">
                    <div className="h-full bg-[#005d42] w-[94.8%]" />
                  </div>
                </div>
              </div>

              {/* Card 2: Candidate Acceptance Rate */}
              <div className="bg-white border border-[#e5e7eb] shadow-[3px_3px_0px_#0b1c30] p-6">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-xs uppercase tracking-wider text-[#6e7a73]">
                    CANDIDATE ACCEPTANCE RATE
                  </p>
                  <span className="border border-[#005d42] bg-[#eff4ff] px-2 py-0.5 font-mono text-[10px] font-bold text-[#005d42] uppercase">
                    ASSESSED
                  </span>
                </div>
                <p className="mt-2 font-headline text-2xl font-bold tracking-tight text-[#0b1c30]">
                  Top 1.4% Verified
                </p>
                <p className="mt-2 text-xs leading-relaxed text-[#3e4943]">
                  Strict algorithmic code assessments, system design interviews, and identity KYC.
                </p>
              </div>

              {/* Card 3: Verified Buyer Testimonial */}
              <div className="bg-white border border-[#e5e7eb] shadow-[3px_3px_0px_#0b1c30] p-6">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#005d42]">
                  <span>★★★★★</span>
                  <span className="border border-[#005d42] bg-[#eff4ff] px-1.5 py-0.2 text-[10px]">
                    VERIFIED BUYER
                  </span>
                </div>
                <p className="mt-3 text-xs italic leading-relaxed text-[#0b1c30]">
                  &ldquo;We migrated all 24 external distributed systems contracts to GigCraft. The multi-sig milestone escrow eliminates payment disputes entirely.&rdquo;
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-[#e5e7eb] pt-3">
                  <div>
                    <p className="font-bold text-xs text-[#0b1c30]">Marcus Vance</p>
                    <p className="font-mono text-[10px] text-[#6e7a73]">VP Infrastructure @ HyperLayer Corp</p>
                  </div>
                  <span className="border border-[#e5e7eb] bg-[#eff4ff] px-2 py-0.5 font-mono text-[10px] font-bold text-[#005d42]">
                    $340k+ Transacted
                  </span>
                </div>
              </div>

              {/* Card 4: Protocol Ledger Specs */}
              <div className="bg-[#eff4ff] border border-[#e5e7eb] p-4 font-mono text-xs space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-[#3e4943]">Zero-Knowledge Token Proof</span>
                  <span className="font-bold text-[#005d42]">ACTIVE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#3e4943]">Hardware Security Module (HSM)</span>
                  <span className="font-bold text-[#0b1c30]">FIPS 140-2 LEVEL 3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#3e4943]">Instant Automated Escrow Release</span>
                  <span className="font-bold text-[#005d42]">UPON GIT COMMIT VERIFY</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Security Cards */}
          <div className="mt-8 grid gap-4 border border-[#e5e7eb] bg-white p-6 sm:grid-cols-3 shadow-[3px_3px_0px_#0b1c30]">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-[#005d42]" />
              <div>
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b1c30]">
                  SOC-2 Type II Certified
                </h4>
                <p className="mt-1 text-xs text-[#3e4943]">
                  Continuous third-party audits ensure complete financial and credential protection.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 border-[#e5e7eb] sm:border-l sm:pl-4">
              <Lock className="mt-1 h-5 w-5 shrink-0 text-[#005d42]" />
              <div>
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b1c30]">
                  Multi-Sig Escrow Vault
                </h4>
                <p className="mt-1 text-xs text-[#3e4943]">
                  Funds are held neutral until acceptance criteria and code deliverable verification meet specs.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 border-[#e5e7eb] sm:border-l sm:pl-4">
              <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#005d42]" />
              <div>
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b1c30]">
                  256-Bit Hardware Encryption
                </h4>
                <p className="mt-1 text-xs text-[#3e4943]">
                  Strict hardware token integration with encrypted payload transmission and session pinning.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Mini Footer */}
          <div className="mt-6 flex items-center justify-between border-t border-[#e5e7eb] pt-4 font-mono text-xs text-[#3e4943]">
            <span>GIGCRAFT © 2025 GigCraft Marketplace Inc.</span>
            <span className="uppercase tracking-wider">SECURE ACCESS PORTAL</span>
          </div>
        </div>
      </main>
    </div>
  );
}
