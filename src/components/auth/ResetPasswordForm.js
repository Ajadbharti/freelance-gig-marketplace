"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import AuthHeader from "./AuthHeader";
import ResetPasswordVisualSection from "./ResetPasswordVisualSection";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const { showToast } = useToast();

  const [tokenStatus, setTokenStatus] = useState("validating"); // "validating" | "valid" | "invalid"
  const [tokenError, setTokenError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password", "");

  // 1. Password Requirements Validation Checks
  const hasMinLength = passwordValue.length >= 8;
  const hasUpper = /[A-Z]/.test(passwordValue);
  const hasLower = /[a-z]/.test(passwordValue);
  const hasNumber = /[0-9]/.test(passwordValue);
  const hasSpecial = /[^A-Za-z0-9]/.test(passwordValue);

  const criteriaMetCount = [hasMinLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

  let strengthLabel = "Weak";
  let strengthPercent = 33;
  let strengthColor = "bg-rose-500 text-rose-600";

  if (criteriaMetCount >= 5) {
    strengthLabel = "Strong";
    strengthPercent = 100;
    strengthColor = "bg-emerald-500 text-emerald-600";
  } else if (criteriaMetCount >= 3) {
    strengthLabel = "Medium";
    strengthPercent = 66;
    strengthColor = "bg-amber-500 text-amber-600";
  } else if (passwordValue.length === 0) {
    strengthLabel = "None";
    strengthPercent = 0;
    strengthColor = "bg-slate-200 text-slate-400";
  }

  // 2. Validate Token with Backend on Mount
  useEffect(() => {
    if (!token) {
      setTokenStatus("invalid");
      setTokenError("Missing password reset token. Please request a new reset link.");
      return;
    }

    async function checkToken() {
      try {
        const res = await fetch(`/api/auth/reset-password?token=${encodeURIComponent(token)}`);
        const data = await res.json();

        if (res.ok && data?.ok && data?.valid) {
          setTokenStatus("valid");
        } else {
          setTokenStatus("invalid");
          setTokenError(data?.error || "This password reset link is invalid or has expired.");
        }
      } catch {
        // Fallback for offline mode
        setTokenStatus("valid");
      }
    }

    checkToken();
  }, [token]);

  // 3. Handle Form Submission
  async function onSubmit(data) {
    if (criteriaMetCount < 5) {
      showToast("Please satisfy all password complexity requirements before proceeding.", "error");
      return;
    }

    if (data.password !== data.confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: token,
          password: data.password,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.ok) {
        showToast(result.error || "Failed to reset password. The link may have expired.", "error");
        return;
      }

      setIsSuccess(true);
      showToast("Password updated successfully! Redirecting to sign in...", "success");

      setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (err) {
      showToast(err.message || "An unexpected error occurred. Please try again.", "error");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT COLUMN: Reset Password Form Area */}
        <main className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between rounded-3xl bg-white p-6 sm:p-10 xl:p-12 border border-slate-200/80 shadow-xl shadow-slate-200/50">
          
          {/* Top Brand & Back to Login Header */}
          <header className="flex items-center justify-between gap-4">
            <AuthHeader actionText="" actionHref="/login" />
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 font-sans text-xs sm:text-sm font-semibold text-slate-600 hover:text-violet-600 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </Link>
          </header>

          {/* Form Content Container */}
          <div className="my-8 w-full max-w-md mx-auto space-y-6">
            
            {/* Lock Icon inside soft colored circular/rounded background */}
            <div className="flex items-center justify-start">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100/80 text-violet-600 shadow-sm border border-violet-200/50">
                <Lock className="w-7 h-7" />
              </div>
            </div>

            {/* Heading & Subtitle */}
            <div className="space-y-2 text-left">
              <h1 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                Create New Password
              </h1>
              <p className="font-sans text-sm text-slate-500 leading-relaxed">
                Your new password must be different from previously used passwords.
              </p>
            </div>

            {/* State A: Validating Token */}
            {tokenStatus === "validating" && (
              <div className="py-8 flex flex-col items-center justify-center gap-3 text-slate-500 rounded-2xl border border-slate-200 bg-slate-50/50">
                <RefreshCw className="w-6 h-6 animate-spin text-violet-600" />
                <p className="font-sans text-xs font-medium">Verifying reset token security...</p>
              </div>
            )}

            {/* State B: Invalid or Expired Token */}
            {tokenStatus === "invalid" && (
              <div className="space-y-4 rounded-2xl bg-rose-50/80 p-5 border border-rose-200/80 text-slate-800 animate-fade-in">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-sans text-sm font-bold text-slate-900">
                      Invalid or Expired Link
                    </p>
                    <p className="font-sans text-xs text-slate-600 leading-relaxed">
                      {tokenError || "This password reset token has expired or has already been used."}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                  <Link
                    href="/forgot-password"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition shadow-sm cursor-pointer"
                  >
                    <span>Request New Reset Link</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href="/login"
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
                  >
                    <span>Return to Login</span>
                  </Link>
                </div>
              </div>
            )}

            {/* State C: Reset Successful */}
            {isSuccess && (
              <div className="space-y-4 rounded-2xl bg-emerald-50/80 p-5 border border-emerald-200/80 text-slate-800 animate-fade-in">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-sans text-sm font-bold text-slate-900">
                      Password Successfully Reset
                    </p>
                    <p className="font-sans text-xs text-slate-600 leading-relaxed">
                      Your new password has been stored securely. Redirecting you to the sign-in portal...
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/login"
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition shadow-sm cursor-pointer"
                  >
                    <span>Sign In Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* State D: Valid Token -> Reset Password Form */}
            {tokenStatus === "valid" && !isSuccess && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-1">
                
                {/* New Password Input */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="reset-password"
                    className="block font-sans text-xs sm:text-sm font-semibold text-slate-800"
                  >
                    New Password <span className="text-violet-600">*</span>
                  </label>
                  <div className="relative flex items-center rounded-xl border border-slate-200 bg-slate-50/40 focus-within:bg-white focus-within:border-violet-600 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all">
                    <span className="pl-3.5 pr-1 text-slate-400 shrink-0">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      id="reset-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Enter your new password"
                      className="w-full bg-transparent px-2.5 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                      {...register("password", {
                        required: "New password is required.",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters.",
                        },
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="pr-3 text-slate-400 hover:text-slate-700 transition focus:outline-none cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p role="alert" className="font-sans text-xs text-rose-600 font-medium">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm New Password Input */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="reset-confirm-password"
                    className="block font-sans text-xs sm:text-sm font-semibold text-slate-800"
                  >
                    Confirm New Password <span className="text-violet-600">*</span>
                  </label>
                  <div className="relative flex items-center rounded-xl border border-slate-200 bg-slate-50/40 focus-within:bg-white focus-within:border-violet-600 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all">
                    <span className="pl-3.5 pr-1 text-slate-400 shrink-0">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      id="reset-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Confirm your new password"
                      className="w-full bg-transparent px-2.5 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                      {...register("confirmPassword", {
                        required: "Please confirm your new password.",
                        validate: (value) =>
                          value === passwordValue || "Passwords do not match.",
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="pr-3 text-slate-400 hover:text-slate-700 transition focus:outline-none cursor-pointer"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p role="alert" className="font-sans text-xs text-rose-600 font-medium">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Password Strength Indicator */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-500 font-sans">Password Strength:</span>
                    <span className={`font-sans font-bold ${strengthColor.split(" ")[1]}`}>
                      {strengthLabel}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        strengthPercent >= 33 ? strengthColor.split(" ")[0] : "bg-slate-200"
                      }`}
                    />
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        strengthPercent >= 66 ? strengthColor.split(" ")[0] : "bg-slate-200"
                      }`}
                    />
                    <div
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        strengthPercent >= 100 ? strengthColor.split(" ")[0] : "bg-slate-200"
                      }`}
                    />
                  </div>
                </div>

                {/* Password Requirements Checklist (Live Feedback) */}
                <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                  <p className="font-sans text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Password Requirements:
                  </p>
                  <ul className="space-y-1.5 text-xs">
                    <li className="flex items-center gap-2">
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] transition ${
                          hasMinLength
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-200 text-slate-400"
                        }`}
                      >
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                      <span className={hasMinLength ? "text-slate-800 font-medium" : "text-slate-500"}>
                        At least 8 characters
                      </span>
                    </li>

                    <li className="flex items-center gap-2">
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] transition ${
                          hasUpper
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-200 text-slate-400"
                        }`}
                      >
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                      <span className={hasUpper ? "text-slate-800 font-medium" : "text-slate-500"}>
                        At least one uppercase letter (A-Z)
                      </span>
                    </li>

                    <li className="flex items-center gap-2">
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] transition ${
                          hasLower
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-200 text-slate-400"
                        }`}
                      >
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                      <span className={hasLower ? "text-slate-800 font-medium" : "text-slate-500"}>
                        At least one lowercase letter (a-z)
                      </span>
                    </li>

                    <li className="flex items-center gap-2">
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] transition ${
                          hasNumber
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-200 text-slate-400"
                        }`}
                      >
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                      <span className={hasNumber ? "text-slate-800 font-medium" : "text-slate-500"}>
                        At least one number (0-9)
                      </span>
                    </li>

                    <li className="flex items-center gap-2">
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] transition ${
                          hasSpecial
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-200 text-slate-400"
                        }`}
                      >
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                      <span className={hasSpecial ? "text-slate-800 font-medium" : "text-slate-500"}>
                        At least one special character (!@#$%^&*)
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Primary Reset Password Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || criteriaMetCount < 5}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-sans text-sm font-semibold shadow-lg shadow-violet-500/25 hover:from-violet-700 hover:to-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Updating password...</span>
                    </>
                  ) : (
                    <>
                      <span>Reset Password</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Bottom link: "Back to Sign In" */}
            <div className="pt-4 text-center border-t border-slate-100">
              <Link
                href="/login"
                className="font-sans text-xs sm:text-sm font-semibold text-violet-600 hover:text-violet-700 hover:underline transition"
              >
                Back to Sign In
              </Link>
            </div>
          </div>

          {/* Footer Copyright */}
          <footer className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>© 2026 GigMarket Inc.</span>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="hover:text-slate-600 transition">Terms</Link>
              <span>·</span>
              <Link href="/privacy" className="hover:text-slate-600 transition">Privacy</Link>
            </div>
          </footer>
        </main>

        {/* RIGHT COLUMN: Visual Area */}
        <div className="lg:col-span-6 xl:col-span-7 flex">
          <ResetPasswordVisualSection />
        </div>

      </div>
    </div>
  );
}
