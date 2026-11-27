"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/ToastProvider";
import AuthHeader from "./AuthHeader";
import RoleSelector from "./RoleSelector";
import SocialLoginButtons from "./SocialLoginButtons";
import LoginVisualSection from "./LoginVisualSection";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const { login } = useAuth();
  const { showToast } = useToast();

  const [role, setRole] = useState(searchParams.get("role") === "freelancer" ? "freelancer" : "client");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

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

  // Load remembered email on mount
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem("gigmarket_remember_email");
      if (savedEmail) {
        setValue("email", savedEmail);
      }
    } catch {}
  }, [setValue]);

  // Handle role switch (conveniently pre-populates demo email if desired)
  function handleRoleChange(selectedRole) {
    setRole(selectedRole);
  }

  // Handle Form Submission
  async function onSubmit(data) {
    try {
      const result = await login(data.email, data.password);

      if (!result.ok) {
        showToast(result.error || "Authentication failed. Please verify your credentials.", "error");
        return;
      }

      // Handle Remember Me persistence
      try {
        if (rememberMe) {
          localStorage.setItem("gigmarket_remember_email", data.email);
        } else {
          localStorage.removeItem("gigmarket_remember_email");
        }
      } catch {}

      showToast(`Welcome back, ${result.user?.name || "User"}! Redirecting...`, "success");

      // Redirect user according to role
      const userRole = result.user?.role;
      let destination = nextParam;

      if (!destination) {
        if (userRole === "admin") {
          destination = "/admin/dashboard";
        } else if (userRole === "freelancer") {
          destination = "/freelancer/dashboard";
        } else {
          destination = "/client/dashboard";
        }
      }

      window.location.href = destination;
    } catch (err) {
      showToast(err.message || "An unexpected error occurred during login.", "error");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT COLUMN: Login Form Area */}
        <main className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between rounded-3xl bg-white p-6 sm:p-10 xl:p-12 border border-slate-200/80 shadow-xl shadow-slate-200/50">
          
          {/* Top Brand & Signup Header */}
          <AuthHeader actionText="Create an account" actionHref="/register" />

          {/* Form Content Container */}
          <div className="my-8 w-full max-w-md mx-auto space-y-6">
            
            {/* Heading & Subtitle */}
            <div className="space-y-1.5 text-left">
              <h1 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                Welcome Back!
              </h1>
              <p className="font-sans text-sm text-slate-500 leading-relaxed">
                Sign in to continue your freelance journey.
              </p>
            </div>

            {/* Role Switcher (Client / Freelancer) */}
            <RoleSelector role={role} onRoleChange={handleRoleChange} />

            {/* Quick Demo Pre-fill Pills */}
            <div className="flex items-center justify-between text-xs font-medium text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
              <span className="text-slate-400">Quick Test Fill:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setValue("email", "client@gigcraft.io");
                    setValue("password", "ClientPass2026!");
                    setRole("client");
                  }}
                  className="px-2 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-violet-300 hover:text-violet-600 transition shadow-2xs font-semibold cursor-pointer"
                >
                  👤 Client
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setValue("email", "freelancer@gigcraft.io");
                    setValue("password", "FreelancerPass2026!");
                    setRole("freelancer");
                  }}
                  className="px-2 py-1 rounded-md bg-white border border-slate-200 text-slate-700 hover:border-violet-300 hover:text-violet-600 transition shadow-2xs font-semibold cursor-pointer"
                >
                  💻 Freelancer
                </button>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-1">
              
              {/* Email Address Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="login-email"
                  className="block font-sans text-xs sm:text-sm font-semibold text-slate-800"
                >
                  Email address
                </label>
                <div className="relative flex items-center rounded-xl border border-slate-200 bg-slate-50/40 focus-within:bg-white focus-within:border-violet-600 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all">
                  <span className="pl-3.5 pr-1 text-slate-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
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

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="login-password"
                    className="font-sans text-xs sm:text-sm font-semibold text-slate-800"
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="font-sans text-xs font-semibold text-violet-600 hover:text-violet-700 hover:underline transition"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative flex items-center rounded-xl border border-slate-200 bg-slate-50/40 focus-within:bg-white focus-within:border-violet-600 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all">
                  <span className="pl-3.5 pr-1 text-slate-400 shrink-0">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="w-full bg-transparent px-2.5 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    {...register("password", {
                      required: "Password is required.",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters.",
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

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded-md border-slate-300 text-violet-600 focus:ring-violet-500/30 accent-violet-600"
                  />
                  <span className="font-sans text-xs sm:text-sm text-slate-600 font-medium">
                    Remember Me
                  </span>
                </label>
              </div>

              {/* Primary Sign In Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-sans text-sm font-semibold shadow-lg shadow-violet-500/25 hover:from-violet-700 hover:to-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to {role === "freelancer" ? "Freelancer" : "Client"} Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider with "OR CONTINUE WITH" */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-white px-3 font-sans text-xs font-semibold uppercase tracking-wider text-slate-400">
                OR CONTINUE WITH
              </span>
            </div>

            {/* Social Google Sign-In */}
            <SocialLoginButtons role={role} />

            {/* Bottom Sign-Up Link */}
            <div className="pt-2 text-center">
              <p className="font-sans text-xs sm:text-sm text-slate-500">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-violet-600 hover:text-violet-700 hover:underline transition"
                >
                  Sign Up
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
          <LoginVisualSection />
        </div>

      </div>
    </div>
  );
}
