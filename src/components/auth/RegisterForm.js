"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/ToastProvider";
import AuthHeader from "./AuthHeader";
import AccountTypeSelector from "./AccountTypeSelector";
import SocialLoginButtons from "./SocialLoginButtons";
import RegisterVisualSection from "./RegisterVisualSection";

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register: registerUser } = useAuth();
  const { showToast } = useToast();

  const [accountType, setAccountType] = useState(
    searchParams.get("role") === "freelancer" ? "freelancer" : "client"
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password", "");

  async function onSubmit(data) {
    if (!agreeTerms) {
      showToast("Please agree to the Terms of Service and Privacy Policy to proceed.", "error");
      return;
    }

    if (data.password !== data.confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }

    try {
      const result = await registerUser({
        name: data.fullName.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        role: accountType, // Strictly "client" or "freelancer", never "admin"
      });

      if (!result.ok) {
        showToast(result.error || "Registration failed. Please check your information.", "error");
        return;
      }

      showToast(`Welcome to GigMarket, ${result.user?.name || data.fullName}! Account created.`, "success");

      // Redirect user according to their chosen role
      const destination = accountType === "freelancer" ? "/freelancer/dashboard" : "/client/dashboard";
      window.location.href = destination;
    } catch (err) {
      showToast(err.message || "An unexpected error occurred during account creation.", "error");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT COLUMN: Registration Form Area */}
        <main className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between rounded-3xl bg-white p-6 sm:p-10 xl:p-12 border border-slate-200/80 shadow-xl shadow-slate-200/50">
          
          {/* Top Brand & Sign In Header */}
          <AuthHeader actionText="Sign in" actionHref="/login" />

          {/* Form Content Container */}
          <div className="my-8 w-full max-w-md mx-auto space-y-6">
            
            {/* Heading & Subtitle */}
            <div className="space-y-1.5 text-left">
              <h1 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                Create Your Account
              </h1>
              <p className="font-sans text-sm text-slate-500 leading-relaxed">
                Join our community and start your freelance journey.
              </p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
              
              {/* Account Type Selection (Client / Freelancer) */}
              <AccountTypeSelector
                selectedType={accountType}
                onSelectType={setAccountType}
              />

              {/* Full Name Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="reg-fullname"
                  className="block font-sans text-xs sm:text-sm font-semibold text-slate-800"
                >
                  Full Name <span className="text-violet-600">*</span>
                </label>
                <div className="relative flex items-center rounded-xl border border-slate-200 bg-slate-50/40 focus-within:bg-white focus-within:border-violet-600 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all">
                  <span className="pl-3.5 pr-1 text-slate-400 shrink-0">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    id="reg-fullname"
                    type="text"
                    autoComplete="name"
                    placeholder="Alex Morgan"
                    className="w-full bg-transparent px-2.5 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    {...register("fullName", {
                      required: "Full name is required.",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters.",
                      },
                    })}
                  />
                </div>
                {errors.fullName && (
                  <p role="alert" className="font-sans text-xs text-rose-600 font-medium">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email Address Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="reg-email"
                  className="block font-sans text-xs sm:text-sm font-semibold text-slate-800"
                >
                  Email Address <span className="text-violet-600">*</span>
                </label>
                <div className="relative flex items-center rounded-xl border border-slate-200 bg-slate-50/40 focus-within:bg-white focus-within:border-violet-600 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all">
                  <span className="pl-3.5 pr-1 text-slate-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    id="reg-email"
                    type="email"
                    autoComplete="email"
                    placeholder="alex@example.com"
                    className="w-full bg-transparent px-2.5 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    {...register("email", {
                      required: "Email address is required.",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Please enter a valid email address.",
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p role="alert" className="font-sans text-xs text-rose-600 font-medium">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="reg-password"
                  className="block font-sans text-xs sm:text-sm font-semibold text-slate-800"
                >
                  Password <span className="text-violet-600">*</span>
                </label>
                <div className="relative flex items-center rounded-xl border border-slate-200 bg-slate-50/40 focus-within:bg-white focus-within:border-violet-600 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all">
                  <span className="pl-3.5 pr-1 text-slate-400 shrink-0">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    id="reg-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="At least 6 characters"
                    className="w-full bg-transparent px-2.5 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    {...register("password", {
                      required: "Password is required.",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters long.",
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

              {/* Confirm Password Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor="reg-confirm-password"
                  className="block font-sans text-xs sm:text-sm font-semibold text-slate-800"
                >
                  Confirm Password <span className="text-violet-600">*</span>
                </label>
                <div className="relative flex items-center rounded-xl border border-slate-200 bg-slate-50/40 focus-within:bg-white focus-within:border-violet-600 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all">
                  <span className="pl-3.5 pr-1 text-slate-400 shrink-0">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    id="reg-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Repeat your password"
                    className="w-full bg-transparent px-2.5 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    {...register("confirmPassword", {
                      required: "Please confirm your password.",
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

              {/* Terms and Conditions Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded-md border-slate-300 text-violet-600 focus:ring-violet-500/30 accent-violet-600 shrink-0"
                  />
                  <span className="font-sans text-xs text-slate-600 leading-relaxed">
                    I agree to the{" "}
                    <Link href="/terms" className="text-violet-600 font-semibold hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-violet-600 font-semibold hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>
              </div>

              {/* Primary Create Account Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-sans text-sm font-semibold shadow-lg shadow-violet-500/25 hover:from-violet-700 hover:to-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer mt-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create {accountType === "freelancer" ? "Freelancer" : "Client"} Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider with "OR SIGN UP WITH" */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-white px-3 font-sans text-xs font-semibold uppercase tracking-wider text-slate-400">
                OR SIGN UP WITH
              </span>
            </div>

            {/* Social Google Sign-Up */}
            <SocialLoginButtons role={accountType} />

            {/* Bottom Sign-In Link */}
            <div className="pt-2 text-center">
              <p className="font-sans text-xs sm:text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-violet-600 hover:text-violet-700 hover:underline transition"
                >
                  Sign In
                </Link>
              </p>
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

        {/* RIGHT COLUMN: Visual Illustration & Floating UI Elements */}
        <div className="lg:col-span-6 xl:col-span-7 flex">
          <RegisterVisualSection />
        </div>

      </div>
    </div>
  );
}
