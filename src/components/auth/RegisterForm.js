"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  CreditCard,
  Eye,
  EyeOff,
  Landmark,
  Package,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useToast } from "@/components/ui/ToastProvider";
import GoogleLoginButton from "@/components/auth/GoogleLoginButton";

function GithubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

const DOMAIN_OPTIONS = [
  "Fullstack Next.js & TypeScript Ecosystem",
  "Enterprise UI/UX & Figma Design Systems",
  "Distributed Backend & Cloud Infrastructure",
  "Smart Contracts & Web3 Protocols",
  "Autonomous AI Agents & LLM Fine-Tuning",
  "Mobile App Development (React Native / iOS)",
];

const QUICK_TAGS = [
  "#Figma UI/UX",
  "#Next.js & Edge",
  "#Smart Contracts",
  "#LLM Architectures",
];

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register: registerUser, loginWithProvider, loginWithGithubDemo, loginWithFirebaseGoogle } = useAuth();
  const { gigs, freelancers } = useMarketplace();
  const { showToast } = useToast();

  const [archetype, setArchetype] = useState(
    searchParams.get("role") === "freelancer" ? "freelancer" : "client"
  );
  const [passwordValue, setPasswordValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(DOMAIN_OPTIONS[0]);
  const [selectedTags, setSelectedTags] = useState(["#Next.js & Edge"]);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeUpdates, setAgreeUpdates] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  // Calculate password strength
  const passLength = passwordValue.length;
  let strengthLevel = "NONE";
  let strengthPercent = 0;
  if (passLength > 0 && passLength < 6) {
    strengthLevel = "FAIR (>8 CHARS)";
    strengthPercent = 33;
  } else if (passLength >= 6 && passLength < 10) {
    strengthLevel = "STRONG (MIXED CHARS)";
    strengthPercent = 66;
  } else if (passLength >= 10) {
    strengthLevel = "ENTERPRISE GRADE (SYMBOLS)";
    strengthPercent = 100;
  }

  function toggleTag(tag) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  async function onSubmit(data) {
    if (!agreeTerms) {
      showToast("Please agree to the Terms of Service to proceed.", "error");
      return;
    }
    const fullName = `${(data.firstName || "").trim()} ${(data.lastName || "").trim()}`.trim();
    const finalPassword = passwordValue || data.password;
    if (!finalPassword || finalPassword.length < 6) {
      showToast("Password must be at least 6 characters long.", "error");
      return;
    }
    const result = await registerUser({
      name: fullName || (archetype === "freelancer" ? "Freelancer" : "Client"),
      email: data.email,
      password: finalPassword,
      role: archetype,
    });

    if (result.ok) {
      showToast(`Account created as ${archetype.toUpperCase()}. Welcome to GigCraft!`, "success");
      window.location.href = archetype === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client";
    } else {
      showToast(result.error || "Registration failed.", "error");
    }
  }

  async function handleSocialAuth(provider) {
    if (typeof window !== "undefined") {
      localStorage.setItem("gigcraft_in:selected_role", archetype);
    }
    if (provider === "google") {
      const result = await loginWithFirebaseGoogle(archetype);
      if (result.ok && result.user) {
        showToast(`Welcome, ${result.user.name}! Signed up with Google.`, "success");
        window.location.href = archetype === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client";
      } else if (result.error) {
        showToast(result.error, "error");
      }
      return;
    }
    if (provider === "github") {
      const result = await loginWithGithubDemo({
        name: archetype === "freelancer" ? "Elena Rostova" : "Apex Cloud Labs",
        email: archetype === "freelancer" ? "developer@agency.io" : "contact@apexcloud.io",
        role: archetype,
      });
      if (result.ok) {
        showToast(`Signed up with GitHub as ${archetype.toUpperCase()}!`, "success");
        window.location.href = archetype === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client";
      }
      return;
    }
    const result = await loginWithProvider(provider, archetype);
    if (!result.ok) {
      showToast(result.error || `${provider.toUpperCase()} sign-in failed.`, "error");
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      {/* Top Header matching reference */}
      <header className="border-b border-[#e5e7eb] bg-white py-3.5 px-4 sm:px-8">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link href="/" className="font-headline text-xl font-bold tracking-tight text-[#005d42] uppercase">
            GIGCRAFT
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
          {/* Protocol Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 font-mono text-xs text-[#3e4943]">
            <span className="flex items-center gap-1.5 border border-[#e5e7eb] bg-[#eff4ff] px-2 py-0.5 font-bold uppercase tracking-wider text-[#0b1c30]">
              <span className="h-2 w-2 bg-[#005d42]" />
              JOIN THE TECHNICAL MARKETPLACE
            </span>
            <span className="text-[#6e7a73]">/</span>
            <span className="uppercase text-[#3e4943]">PROTOCOL REGISTRATION v2.4</span>
          </div>

          {/* 2-Column Split: Form (Left) + Info & Metrics (Right) */}
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Left Column: Form Card */}
            <div className="bg-white border border-[#e5e7eb] shadow-[3px_3px_0px_#0b1c30] p-6 sm:p-10">
              <h1 className="font-headline text-3xl font-bold tracking-tight text-[#0b1c30] sm:text-4xl">
                Create your GigCraft account
              </h1>
              <p className="mt-2 text-sm text-[#3e4943]">
                Join thousands of engineering teams and top-tier technical freelancers contracting under deterministic milestones.
              </p>

              {/* Archetype Selector */}
              <div className="mt-8">
                <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b1c30]">
                  SELECT ACCOUNT ARCHETYPE
                </p>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  {/* Client Card */}
                  <div
                    onClick={() => setArchetype("client")}
                    className={`cursor-pointer border p-4 transition ${
                      archetype === "client"
                        ? "border-[#005d42] bg-[#eff4ff] ring-1 ring-[#005d42]"
                        : "border-[#e5e7eb] bg-white hover:border-[#6e7a73]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">💼</span>
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b1c30]">
                          HIRE TALENT
                        </span>
                      </div>
                      <div
                        className={`flex h-4 w-4 items-center justify-center border text-[10px] ${
                          archetype === "client"
                            ? "border-[#005d42] bg-[#005d42] text-white"
                            : "border-[#6e7a73] bg-white"
                        }`}
                      >
                        {archetype === "client" && "✓"}
                      </div>
                    </div>
                    <h3 className="mt-3 font-sans text-sm font-bold text-[#0b1c30]">
                      Client
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#3e4943]">
                      Browse gigs, order a package with your requirements, track the work, and approve the delivery before the payment is released.
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-[#e5e7eb] pt-3 font-mono text-[11px] text-[#3e4943]">
                      <span className="uppercase tracking-wider font-semibold text-[#0b1c30]">ESCROW-HELD PAYMENTS</span>
                      <span className="text-[#3e4943]">No platform fee</span>
                    </div>
                  </div>

                  {/* Freelancer Card */}
                  <div
                    onClick={() => setArchetype("freelancer")}
                    className={`cursor-pointer border p-4 transition ${
                      archetype === "freelancer"
                        ? "border-[#005d42] bg-[#eff4ff] ring-1 ring-[#005d42]"
                        : "border-[#e5e7eb] bg-white hover:border-[#6e7a73]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">💻</span>
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b1c30]">
                          WORK & SELL
                        </span>
                      </div>
                      <div
                        className={`flex h-4 w-4 items-center justify-center border text-[10px] ${
                          archetype === "freelancer"
                            ? "border-[#005d42] bg-[#005d42] text-white"
                            : "border-[#6e7a73] bg-white"
                        }`}
                      >
                        {archetype === "freelancer" && "✓"}
                      </div>
                    </div>
                    <h3 className="mt-3 font-sans text-sm font-bold text-[#0b1c30]">
                      Freelancer
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#3e4943]">
                      Publish services with Basic, Standard and Premium packages, deliver your work, and get paid when the client approves.
                    </p>
                    <div className="mt-4 flex items-center justify-between border-t border-[#e5e7eb] pt-3 font-mono text-[11px] text-[#3e4943]">
                      <span className="uppercase tracking-wider font-semibold text-[#0b1c30]">SELLER WORKSPACE</span>
                      <span className="text-[#3e4943]">Paid on approval</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Buttons */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSocialAuth("github")}
                  className="flex h-11 items-center justify-center gap-2 border border-[#0b1c30] bg-white font-mono text-xs font-semibold text-[#0b1c30] hover:bg-[#dce9ff] shadow-[2px_2px_0px_#0b1c30] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                >
                  <GithubIcon className="h-4 w-4" />
                  Sign up with GitHub
                </button>
                <GoogleLoginButton
                  role={archetype}
                  text={`Sign up as ${archetype === "freelancer" ? "Freelancer" : "Client"} with Google`}
                />
              </div>

              {/* Divider */}
              <div className="my-6 flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-[#6e7a73]">
                <span className="h-px flex-1 bg-[#e5e7eb]" />
                OR COMPLETE REGISTRATION
                <span className="h-px flex-1 bg-[#e5e7eb]" />
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-[#0b1c30]">
                      First Name *
                    </label>
                    <input
                      type="text"
                      {...register("firstName", { required: true })}
                      className="mt-1.5 h-10 w-full border border-[#6e7a73] bg-white px-3 font-sans text-sm text-[#0b1c30] focus:border-2 focus:border-[#0b1c30] focus:outline-none"
                      placeholder="Linus"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-[#0b1c30]">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      {...register("lastName", { required: true })}
                      className="mt-1.5 h-10 w-full border border-[#6e7a73] bg-white px-3 font-sans text-sm text-[#0b1c30] focus:border-2 focus:border-[#0b1c30] focus:outline-none"
                      placeholder="Torvalds"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="font-mono text-xs font-semibold uppercase tracking-wider text-[#0b1c30]">
                      Work Email *
                    </label>
                    <span className="font-mono text-[11px] text-[#6e7a73]">
                      Used for escrow confirmations
                    </span>
                  </div>
                  <div className="relative mt-1.5 flex h-10 items-center border border-[#6e7a73] bg-white focus-within:border-2 focus-within:border-[#0b1c30]">
                    <input
                      type="email"
                      {...register("email", { required: true })}
                      className="h-full flex-1 px-3 font-sans text-sm text-[#0b1c30] focus:outline-none"
                      placeholder="engineer@enterprise.io"
                    />
                    <span className="px-3 font-mono text-xs text-[#6e7a73]">@</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="font-mono text-xs font-semibold uppercase tracking-wider text-[#0b1c30]">
                      Password *
                    </label>
                    <span className="font-mono text-[11px] font-semibold text-[#6e7a73]">
                      STRENGTH: {strengthLevel}
                    </span>
                  </div>
                  <div className="relative mt-1.5 flex h-10 items-center border border-[#6e7a73] bg-white focus-within:border-2 focus-within:border-[#0b1c30]">
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      value={passwordValue}
                      onChange={(e) => {
                        setPasswordValue(e.target.value);
                        setValue("password", e.target.value);
                      }}
                      className="h-full flex-1 px-3 font-sans text-sm text-[#0b1c30] focus:outline-none"
                      placeholder="••••••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="mr-2.5 flex h-7 w-7 shrink-0 items-center justify-center text-[#6e7a73] hover:text-[#0b1c30] cursor-pointer focus:outline-none"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {/* 3-segment strength meter matching image */}
                  <div className="mt-2 grid grid-cols-3 gap-1 font-mono text-[9px] uppercase tracking-wider text-[#6e7a73]">
                    <div
                      className={`h-1.5 ${
                        strengthPercent >= 33 ? "bg-[#005d42]" : "bg-slate-200"
                      }`}
                    />
                    <div
                      className={`h-1.5 ${
                        strengthPercent >= 66 ? "bg-[#005d42]" : "bg-slate-200"
                      }`}
                    />
                    <div
                      className={`h-1.5 ${
                        strengthPercent >= 100 ? "bg-[#005d42]" : "bg-slate-200"
                      }`}
                    />
                  </div>
                  <div className="mt-1 flex justify-between font-mono text-[9px] uppercase text-slate-400">
                    <span>FAIR (&gt;8 CHARS)</span>
                    <span>STRONG (MIXED CHARS)</span>
                    <span>ENTERPRISE GRADE (SYMBOLS)</span>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-[#0b1c30]">
                    Primary Domain Focus
                  </label>
                  <select
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className="mt-1.5 h-10 w-full border border-[#6e7a73] bg-white px-3 font-sans text-sm text-[#0b1c30] focus:border-2 focus:border-[#0b1c30] focus:outline-none"
                  >
                    {DOMAIN_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>

                  {/* Quick pills */}
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {QUICK_TAGS.map((tag) => {
                      const active = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={`border px-2.5 py-1 font-mono text-xs transition ${
                            active
                              ? "border-[#005d42] bg-[#eff4ff] text-[#005d42] font-semibold"
                              : "border-[#e5e7eb] bg-white text-[#3e4943] hover:bg-[#eff4ff]"
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-2 pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs leading-relaxed text-[#3e4943]">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded-none accent-[#005d42]"
                    />
                    <span>
                      I agree to the{" "}
                      <Link href="/terms" className="underline text-[#0b1c30] font-medium">Terms of Service</Link>,{" "}
                      <Link href="/privacy" className="underline text-[#0b1c30] font-medium">Privacy Policy</Link>, and{" "}
                      <Link href="/guidelines" className="underline text-[#0b1c30] font-medium">Community Guidelines</Link>.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer text-xs leading-relaxed text-[#3e4943]">
                    <input
                      type="checkbox"
                      checked={agreeUpdates}
                      onChange={(e) => setAgreeUpdates(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded-none accent-[#005d42]"
                    />
                    <span>
                      Allow occasional product update emails (optional).
                    </span>
                  </label>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting || !agreeTerms}
                  className="mt-4 flex h-12 w-full items-center justify-center gap-2 px-5 py-2.5 bg-[#005d42] text-white border border-[#005d42] font-semibold text-sm uppercase tracking-wide hover:bg-[#047857] shadow-[2px_2px_0px_#0b1c30] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-50"
                >
                  {archetype === "freelancer" ? "CREATE FREELANCER ACCOUNT →" : "CREATE CLIENT ACCOUNT →"}
                </button>

                <div className="pt-2 text-center">
                  <Link
                    href="/login"
                    className="font-mono text-xs text-[#3e4943] transition hover:text-[#005d42]"
                  >
                    Already verified on the GigCraft node network?{" "}
                    <span className="font-bold underline text-[#0b1c30]">Log In →</span>
                  </Link>
                </div>
              </form>
            </div>

            {/* Right Column: HOW IT WORKS & PLATFORM METRICS matching reference */}
            <div className="space-y-6">
              {/* Card 1: HOW IT WORKS */}
              <div className="bg-white border border-[#e5e7eb] shadow-[3px_3px_0px_#0b1c30] p-6">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b1c30] border-b border-[#e5e7eb] pb-3">
                  HOW IT WORKS
                </h3>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center border border-[#005d42]/30 bg-[#eff4ff] text-[#005d42]">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0b1c30]">Payments held in escrow</p>
                      <p className="mt-1 text-xs text-[#3e4943] leading-relaxed">
                        When you order, the amount is held in a demo escrow and released only when you approve the delivery.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center border border-blue-600/30 bg-[#eff4ff] text-blue-600">
                      <Package className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0b1c30]">Packages you can compare</p>
                      <p className="mt-1 text-xs text-[#3e4943] leading-relaxed">
                        Every gig has Basic, Standard and Premium packages with clear delivery times and revisions.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center border border-[#005d42]/30 bg-[#eff4ff] text-[#005d42]">
                      <CreditCard className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0b1c30]">No platform fee</p>
                      <p className="mt-1 text-xs text-[#3e4943] leading-relaxed">
                        This demo doesn't charge any fees, and no real money is ever used.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: PLATFORM METRICS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b1c30]">
                    PLATFORM METRICS
                  </span>
                  <span className="bg-[#005d42] px-2 py-0.5 font-mono text-[10px] font-bold text-white uppercase tracking-wider">
                    LIVE DATA
                  </span>
                </div>

                {/* 4-Stat Grid: Published Gigs, Freelancers, Completed Orders, Average Rating */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border border-[#e5e7eb] p-4 shadow-[2px_2px_0px_#0b1c30]">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-[#6e7a73] font-bold">
                      PUBLISHED GIGS
                    </p>
                    <p className="mt-2 font-headline text-3xl font-bold tracking-tight text-[#0b1c30]">
                      {gigs?.length || 7}
                    </p>
                  </div>

                  <div className="bg-white border border-[#e5e7eb] p-4 shadow-[2px_2px_0px_#0b1c30]">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-[#6e7a73] font-bold">
                      FREELANCERS
                    </p>
                    <p className="mt-2 font-headline text-3xl font-bold tracking-tight text-[#0b1c30]">
                      {freelancers?.length || 4}
                    </p>
                  </div>

                  <div className="bg-white border border-[#e5e7eb] p-4 shadow-[2px_2px_0px_#0b1c30]">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-[#6e7a73] font-bold">
                      COMPLETED ORDERS
                    </p>
                    <p className="mt-2 font-headline text-3xl font-bold tracking-tight text-[#0b1c30]">
                      1
                    </p>
                  </div>

                  <div className="bg-white border border-[#e5e7eb] p-4 shadow-[2px_2px_0px_#0b1c30]">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-[#6e7a73] font-bold">
                      AVERAGE RATING
                    </p>
                    <p className="mt-2 font-headline text-3xl font-bold tracking-tight text-[#0b1c30] flex items-center gap-1">
                      5.0 <span className="text-[#005d42] text-xl">★</span>
                    </p>
                  </div>
                </div>

                {/* Simulated Escrow Released Card */}
                <div className="bg-white border border-[#e5e7eb] shadow-[3px_3px_0px_#0b1c30] p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-wider text-[#6e7a73] font-bold">
                        SIMULATED ESCROW RELEASED
                      </p>
                      <p className="mt-2 font-headline text-3xl font-bold tracking-tight text-[#0b1c30] sm:text-4xl">
                        ₹7,999
                      </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center border border-[#e5e7eb] bg-[#eff4ff] text-[#005d42]">
                      <Landmark className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="mt-3 text-xs text-[#3e4943]">
                    Demo payments only, No real money moves on GigCraft.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
