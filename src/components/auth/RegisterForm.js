"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Check,
  CheckCircle2,
  Code,
  Globe,
  Lock,
  Shield,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCheck,
  Zap,
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
  const { register: registerUser, loginWithProvider } = useAuth();
  const { showToast } = useToast();

  const [archetype, setArchetype] = useState(
    searchParams.get("role") === "freelancer" ? "freelancer" : "client"
  );
  const [passwordValue, setPasswordValue] = useState("");
  const [selectedDomain, setSelectedDomain] = useState(DOMAIN_OPTIONS[0]);
  const [selectedTags, setSelectedTags] = useState(["#Next.js & Edge"]);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [agreeDigest, setAgreeDigest] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
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
    const fullName = `${(data.firstName || "").trim()} ${(data.lastName || "").trim()}`.trim();
    const finalPassword = passwordValue || data.password;
    if (!finalPassword || finalPassword.length < 6) {
      showToast("Password must be at least 6 characters long.", "error");
      return;
    }
    const result = await registerUser({
      name: fullName || "Engineer",
      email: data.email,
      password: finalPassword,
      role: archetype,
    });

    if (result.ok) {
      showToast(`Account created as ${archetype.toUpperCase()}. Welcome to GigCraft!`, "success");
      router.push(archetype === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client");
    } else {
      showToast(result.error || "Registration failed.", "error");
    }
  }

  async function handleSocialAuth(provider) {
    await loginWithProvider(provider);
    showToast(`Signed in with ${provider.toUpperCase()}`, "success");
    router.push(archetype === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client");
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Protocol Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 font-mono text-xs text-slate-600">
          <span className="flex h-3.5 w-3.5 items-center justify-center bg-[#047857] text-[9px] text-white">■</span>
          <span className="bg-slate-100 px-2 py-0.5 font-bold uppercase tracking-wider text-slate-800">
            JOIN THE TECHNICAL MARKETPLACE
          </span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-500">PROTOCOL REGISTRATION v2.4</span>
        </div>

        {/* 2-Column Split: Form (Left) + Telemetry (Right) */}
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Left Column: Form */}
          <div className="border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
            <h1 className="font-serif text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Create your GigCraft account
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Join thousands of engineering teams and top-tier technical freelancers contracting under deterministic milestones.
            </p>

            {/* Archetype Selector */}
            <div className="mt-8">
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-slate-800">
                SELECT ACCOUNT ARCHETYPE
              </p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                {/* Client Card */}
                <div
                  onClick={() => setArchetype("client")}
                  className={`cursor-pointer border p-4 transition ${
                    archetype === "client"
                      ? "border-[#047857] bg-[#f7fcf9] ring-1 ring-[#047857]"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">💼</span>
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
                        HIRE TALENT
                      </span>
                    </div>
                    <div
                      className={`flex h-4 w-4 items-center justify-center border text-[10px] ${
                        archetype === "client"
                          ? "border-[#047857] bg-[#047857] text-white"
                          : "border-slate-300"
                      }`}
                    >
                      {archetype === "client" && "✓"}
                    </div>
                  </div>
                  <h3 className="mt-3 font-sans text-sm font-bold text-slate-950">
                    Client / Engineering Lead
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    Post technical gigs, escrow milestone contracts, and hire vetted engineers & architects with automated deliverables verification.
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 font-mono text-[11px] text-slate-600">
                    <span className="uppercase tracking-wider font-semibold text-slate-800">BUYER ESCROW MODE</span>
                    <span className="text-[#047857]">0% Upfront Post</span>
                  </div>
                </div>

                {/* Freelancer Card */}
                <div
                  onClick={() => setArchetype("freelancer")}
                  className={`cursor-pointer border p-4 transition ${
                    archetype === "freelancer"
                      ? "border-[#047857] bg-[#f7fcf9] ring-1 ring-[#047857]"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">💻</span>
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
                        WORK & SELL
                      </span>
                    </div>
                    <div
                      className={`flex h-4 w-4 items-center justify-center border text-[10px] ${
                        archetype === "freelancer"
                          ? "border-[#047857] bg-[#047857] text-white"
                          : "border-slate-300"
                      }`}
                    >
                      {archetype === "freelancer" && "✓"}
                    </div>
                  </div>
                  <h3 className="mt-3 font-sans text-sm font-bold text-slate-950">
                    Freelancer / Specialist
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    Publish pre-scoped technical services, pass verified code audits, and unlock immediate milestone settlement upon PR approvals.
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 font-mono text-[11px] text-slate-600">
                    <span className="uppercase tracking-wider font-semibold text-slate-800">BUILDER WORKSPACE</span>
                    <span className="text-[#047857]">Direct Settlement</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSocialAuth("github")}
                className="flex h-10 items-center justify-center gap-2 border border-slate-300 bg-white font-mono text-xs font-semibold uppercase tracking-wider text-slate-800 transition hover:bg-slate-50"
              >
                <GithubIcon className="h-4 w-4" />
                Sign up with GitHub
              </button>
              <button
                type="button"
                onClick={() => handleSocialAuth("google")}
                className="flex h-10 items-center justify-center gap-2 border border-slate-300 bg-white font-mono text-xs font-semibold uppercase tracking-wider text-slate-800 transition hover:bg-slate-50"
              >
                <span className="font-bold text-blue-600">G</span>
                Sign up with Google
              </button>
            </div>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3 font-mono text-xs uppercase tracking-wider text-slate-400">
              <span className="h-px flex-1 bg-slate-200" />
              OR COMPLETE REGISTRATION
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-slate-800">
                    First Name *
                  </label>
                  <input
                    type="text"
                    {...register("firstName", { required: true })}
                    className="mt-1.5 h-10 w-full border border-slate-300 bg-white px-3 font-sans text-sm text-slate-900 focus:border-slate-800 focus:outline-none"
                    placeholder="Aarav"
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-slate-800">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    {...register("lastName", { required: true })}
                    className="mt-1.5 h-10 w-full border border-slate-300 bg-white px-3 font-sans text-sm text-slate-900 focus:border-slate-800 focus:outline-none"
                    placeholder="Sharma"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-800">
                    Work Email *
                  </label>
                  <span className="font-mono text-[11px] text-slate-500">
                    Used for escrow confirmations
                  </span>
                </div>
                <div className="relative mt-1.5 flex h-10 items-center border border-slate-300 bg-white">
                  <input
                    type="email"
                    {...register("email", { required: true })}
                    className="h-full flex-1 px-3 font-sans text-sm text-slate-900 focus:outline-none"
                    placeholder="name@enterprise.in"
                  />
                  <span className="px-3 font-mono text-xs text-slate-400">@</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-800">
                    Password *
                  </label>
                  <span className="font-mono text-[11px] font-semibold text-slate-600">
                    STRENGTH: {strengthLevel}
                  </span>
                </div>
                <div className="relative mt-1.5 flex h-10 items-center border border-slate-300 bg-white">
                  <input
                    type="password"
                    {...register("password")}
                    value={passwordValue}
                    onChange={(e) => {
                      setPasswordValue(e.target.value);
                      setValue("password", e.target.value);
                    }}
                    className="h-full flex-1 px-3 font-sans text-sm text-slate-900 focus:outline-none"
                    placeholder="Create a strong password (min 6 chars)"
                  />
                  <span className="px-3 font-mono text-xs text-slate-400">👁</span>
                </div>
                {/* 3-segment strength meter matching image */}
                <div className="mt-2 grid grid-cols-3 gap-1 font-mono text-[9px] uppercase tracking-wider text-slate-500">
                  <div
                    className={`h-1.5 ${
                      strengthPercent >= 33 ? "bg-[#047857]" : "bg-slate-200"
                    }`}
                  />
                  <div
                    className={`h-1.5 ${
                      strengthPercent >= 66 ? "bg-[#047857]" : "bg-slate-200"
                    }`}
                  />
                  <div
                    className={`h-1.5 ${
                      strengthPercent >= 100 ? "bg-[#047857]" : "bg-slate-200"
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
                <label className="block font-mono text-xs font-semibold uppercase tracking-wider text-slate-800">
                  Primary Domain Focus
                </label>
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  className="mt-1.5 h-10 w-full border border-slate-300 bg-white px-3 font-sans text-sm text-slate-900 focus:border-slate-800 focus:outline-none"
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
                            ? "border-[#047857] bg-[#eaf6ee] text-[#047857] font-semibold"
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
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
                <label className="flex items-start gap-2.5 cursor-pointer text-xs leading-relaxed text-slate-700">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded-none accent-[#047857]"
                  />
                  <span>
                    I agree to the{" "}
                    <strong className="underline">GigCraft Escrow Terms of Service</strong>,{" "}
                    <strong className="underline">Deterministic Dispute Policy</strong>, and{" "}
                    <strong className="underline">Code Review Standards</strong>.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer text-xs leading-relaxed text-slate-700">
                  <input
                    type="checkbox"
                    checked={agreeDigest}
                    onChange={(e) => setAgreeDigest(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded-none accent-[#047857]"
                  />
                  <span>
                    Send me weekly curated technical gig digests, benchmark contract rate indexes, and core engineering telemetry updates.
                  </span>
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting || !agreeTerms}
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 bg-[#047857] font-mono text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#065f46] disabled:opacity-50"
              >
                CREATE FREE ACCOUNT & START BOOKING →
              </button>

              <div className="pt-2 text-center">
                <Link
                  href="/login"
                  className="font-mono text-xs text-slate-600 transition hover:text-[#047857]"
                >
                  Already verified on the GigCraft node network?{" "}
                  <span className="font-bold underline text-slate-900">Log In →</span>
                </Link>
              </div>
            </form>
          </div>

          {/* Right Column: Telemetry & Protocol Guarantee */}
          <div className="space-y-6">
            {/* Box 1: Protocol Guarantee */}
            <div className="border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
                  PROTOCOL GUARANTEE
                </span>
                <span className="border border-emerald-300 bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-[#047857]">
                  ACTIVE
                </span>
              </div>
              <ul className="mt-4 space-y-4 text-xs text-slate-600">
                <li className="flex items-start gap-2.5">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#047857]" />
                  <div>
                    <strong className="text-slate-900">100% Escrow Milestone Vault</strong>
                    <p className="mt-0.5 text-slate-500">
                      Contract funds locked in neutral cryptographic escrow before any coding commences.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <Zap className="mt-0.5 h-4 w-4 shrink-0 text-[#047857]" />
                  <div>
                    <strong className="text-slate-900">Instant GitHub Portfolio Sync</strong>
                    <p className="mt-0.5 text-slate-500">
                      Auto-benchmark PR merge rates, commit volume, and test coverage to auto-tier your profile.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <Lock className="mt-0.5 h-4 w-4 shrink-0 text-[#047857]" />
                  <div>
                    <strong className="text-slate-900">Zero Upfront Hiring Fee</strong>
                    <p className="mt-0.5 text-slate-500">
                      Browse, interview, and initiate technical tests without retainer requirements or subscription gating.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Box 2: Current Network Telemetry */}
            <div className="border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
                CURRENT NETWORK TELEMETRY
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-3 border-b border-slate-100 pb-4">
                <div className="border border-slate-100 bg-[#FAFBFB] p-3">
                  <p className="font-mono text-[10px] uppercase text-slate-500">AVG FILL TIME</p>
                  <p className="mt-1 font-serif text-xl font-bold text-slate-950">3.8 hrs</p>
                  <p className="font-mono text-[10px] text-emerald-700">▲ 14% FASTER</p>
                </div>
                <div className="border border-slate-100 bg-[#FAFBFB] p-3">
                  <p className="font-mono text-[10px] uppercase text-slate-500">ESCROW VOLUME</p>
                  <p className="mt-1 font-serif text-xl font-bold text-slate-950">₹24.2 Cr</p>
                  <p className="font-mono text-[10px] text-slate-500">Q1 VERIFIED</p>
                </div>
              </div>

              {/* Mini Sparkline Chart */}
              <div className="mt-4">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-slate-600">Milestone Dispute Rate</span>
                  <span className="font-bold text-[#047857]">0.08%</span>
                </div>
                {/* SVG Sparkline */}
                <div className="mt-2 h-10 w-full">
                  <svg viewBox="0 0 200 40" className="h-full w-full">
                    <polyline
                      fill="none"
                      stroke="#047857"
                      strokeWidth="2"
                      points="10,32 50,30 100,28 150,22 190,12"
                    />
                    <circle cx="190" cy="12" r="3" fill="#047857" />
                  </svg>
                </div>
                <div className="flex justify-between font-mono text-[9px] uppercase text-slate-400">
                  <span>OCT</span>
                  <span>NOV</span>
                  <span>DEC</span>
                  <span>JAN</span>
                  <span className="text-[#047857] font-bold">LIVE</span>
                </div>
              </div>
            </div>

            {/* Box 3: Testimonial */}
            <div className="border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center bg-slate-900 font-mono text-xs font-bold text-white">
                  AK
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-900">Aakash K.</p>
                    <span className="border border-emerald-300 bg-emerald-50 px-1.5 font-mono text-[9px] font-bold text-[#047857]">
                      STAFF ARCHITECT
                    </span>
                  </div>
                  <p className="font-mono text-[10px] text-slate-500">Distributed Systems & Rust // Bengaluru</p>
                </div>
              </div>
              <p className="mt-3 text-xs italic leading-relaxed text-slate-700">
                “GigCraft’s escrow code milestone checks removed invoice chasing entirely. First gig landed within 24 hours of GitHub verification.”
              </p>
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 font-mono text-[10px] text-slate-500">
                <span>38 COMPLETED CONTRACTS</span>
                <span className="font-bold text-slate-800">★ 5.0 RATING</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Security Highlights */}
        <div className="mt-8 grid gap-4 border border-slate-200 bg-white p-6 sm:grid-cols-3 shadow-sm">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-[#047857]" />
            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
                DETERMINISTIC ESCROW
              </h4>
              <p className="mt-1 text-xs text-slate-600">
                Zero upfront platform commission until milestone delivery passes static code analysis and buyer verification.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 border-slate-200 sm:border-l sm:pl-4">
            <Lock className="mt-1 h-5 w-5 shrink-0 text-[#047857]" />
            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
                GST & TDS (194J) COMPLIANT
              </h4>
              <p className="mt-1 text-xs text-slate-600">
                Enterprise payroll, GST invoicing, TDS (194J) compliance, and direct bank (IMPS/NEFT/UPI) disbursements across India.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 border-slate-200 sm:border-l sm:pl-4">
            <UserCheck className="mt-1 h-5 w-5 shrink-0 text-[#047857]" />
            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">
                PRE-SCREENED TALENT
              </h4>
              <p className="mt-1 text-xs text-slate-600">
                Only the top 1.4% of technical applicants pass algorithmic repo evaluations and live architecture screens.
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
