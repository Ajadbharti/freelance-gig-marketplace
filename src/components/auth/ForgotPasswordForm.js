"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { ArrowLeft, ArrowRight, CheckCircle2, Lock, Mail, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import AuthHeader from "./AuthHeader";
import ForgotPasswordVisualSection from "./ForgotPasswordVisualSection";

export default function ForgotPasswordForm() {
  const { showToast } = useToast();
  const [submittedEmail, setSubmittedEmail] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data) {
    const cleanEmail = data.email.trim().toLowerCase();

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const result = await res.json();

      if (!res.ok) {
        showToast(result.error || "Failed to submit request. Please try again.", "error");
        return;
      }

      setSubmittedEmail(cleanEmail);
      showToast(result.message || "Password reset instructions sent to your email.", "success");
    } catch (err) {
      showToast(err.message || "Network error. Please try again later.", "error");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* LEFT COLUMN: Forgot Password Form Area */}
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
                Forgot Your Password?
              </h1>
              <p className="font-sans text-sm text-slate-500 leading-relaxed">
                No worries! Enter your registered email address and we&apos;ll help you reset your password.
              </p>
            </div>

            {/* Success Notification State (When reset email has been dispatched) */}
            {submittedEmail ? (
              <div className="space-y-4 rounded-2xl bg-emerald-50/80 p-5 border border-emerald-200/80 text-slate-800 animate-fade-in">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-sans text-sm font-bold text-slate-900">
                      Reset Instructions Dispatched
                    </p>
                    <p className="font-sans text-xs text-slate-600 leading-relaxed">
                      If an account exists for <strong className="text-slate-900 font-semibold">{submittedEmail}</strong>, you will receive an encrypted reset link shortly. Please check your inbox and spam folder.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSubmittedEmail(null)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Try another email</span>
                  </button>

                  <Link
                    href="/login"
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition shadow-sm cursor-pointer"
                  >
                    <span>Return to Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              /* Forgot Password Form */
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-1">
                
                {/* Email Address Input Field */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="forgot-email"
                    className="block font-sans text-xs sm:text-sm font-semibold text-slate-800"
                  >
                    Email Address <span className="text-violet-600">*</span>
                  </label>
                  <div className="relative flex items-center rounded-xl border border-slate-200 bg-slate-50/40 focus-within:bg-white focus-within:border-violet-600 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all">
                    <span className="pl-3.5 pr-1 text-slate-400 shrink-0">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      id="forgot-email"
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

                {/* Primary Button: "Send Reset Link" */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-sans text-sm font-semibold shadow-lg shadow-violet-500/25 hover:from-violet-700 hover:to-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Sending reset link...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Bottom text: "Remember your password? Sign In" */}
            <div className="pt-4 text-center border-t border-slate-100">
              <p className="font-sans text-xs sm:text-sm text-slate-500">
                Remember your password?{" "}
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

        {/* RIGHT COLUMN: Visual Security Area */}
        <div className="lg:col-span-6 xl:col-span-7 flex">
          <ForgotPasswordVisualSection />
        </div>

      </div>
    </div>
  );
}
