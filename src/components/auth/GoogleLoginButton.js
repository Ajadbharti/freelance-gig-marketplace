"use client";

import { useState } from "react";
import { Loader2, Briefcase, Code2, ArrowRight, ShieldCheck, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/ToastProvider";
import { signInWithGooglePopup } from "@/lib/firebase/auth";
import { isFirebaseConfigured } from "@/lib/firebase/config";

export function GoogleMultiColorIcon({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function GoogleLoginButton({
  role = "client",
  askRole = false,
  text = "Continue with Google",
  className = "",
  onSuccess,
}) {
  const { setSessionUser } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeRoleAttempt, setActiveRoleAttempt] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  async function executeGoogleAuth(chosenRole) {
    if (!isFirebaseConfigured()) {
      showToast(
        "Firebase is not configured yet. Please add NEXT_PUBLIC_FIREBASE_API_KEY in .env.local",
        "error"
      );
      return;
    }

    setLoading(true);
    setActiveRoleAttempt(chosenRole);

    try {
      const res = await signInWithGooglePopup(chosenRole);

      if (res.ok && res.user) {
        setSessionUser(res.user);
        setShowRoleModal(false);
        const resolvedRole = res.user.role || chosenRole;
        showToast(
          `Welcome, ${res.user.name}! Signed in as ${resolvedRole.toUpperCase()}.`,
          "success"
        );

        if (onSuccess) {
          onSuccess(res.user);
        } else {
          const dest = resolvedRole === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client";
          window.location.href = dest;
        }
      } else {
        showToast(res.error || "Google sign-in failed. Please try again.", "error");
      }
    } catch (err) {
      showToast(err.message || "An unexpected error occurred during Google sign-in.", "error");
    } finally {
      setLoading(false);
      setActiveRoleAttempt(null);
    }
  }

  function handleButtonClick() {
    if (askRole) {
      setShowRoleModal(true);
    } else {
      executeGoogleAuth(role);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={loading}
        className={`flex h-11 w-full items-center justify-center gap-2.5 border border-[#0b1c30] bg-white font-mono text-xs font-semibold text-[#0b1c30] hover:bg-[#dce9ff] shadow-[2px_2px_0px_#0b1c30] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-60 cursor-pointer ${className}`}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-[#005d42]" />
            <span>Connecting to Google...</span>
          </>
        ) : (
          <>
            <GoogleMultiColorIcon className="h-4 w-4 shrink-0" />
            <span>{text}</span>
          </>
        )}
      </button>

      {/* Role Selection Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#0b1c30]/60 backdrop-blur-xs"
            onClick={() => !loading && setShowRoleModal(false)}
            aria-hidden="true"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Select Account Type"
            className="relative w-full max-w-md bg-white border border-[#0b1c30] shadow-[5px_5px_0px_#0b1c30] p-6 outline-none"
          >
            {/* Modal Header */}
            <div className="mb-4 flex items-start justify-between gap-4 border-b border-[#e5e7eb] pb-3">
              <div className="flex items-center gap-2.5">
                <GoogleMultiColorIcon className="h-5 w-5 shrink-0" />
                <div>
                  <h3 className="font-headline text-base font-bold uppercase tracking-tight text-[#0b1c30]">
                    Select Account Type
                  </h3>
                  <p className="font-mono text-[11px] text-[#6e7a73]">
                    Choose how you want to sign in with Google
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => !loading && setShowRoleModal(false)}
                disabled={loading}
                className="border border-[#6e7a73] p-1 text-[#3e4943] transition hover:border-[#0b1c30] hover:bg-[#dce9ff] hover:text-[#0b1c30] disabled:opacity-40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Selection Options */}
            <div className="space-y-3 my-4">
              {/* Option 1: Client */}
              <button
                type="button"
                onClick={() => executeGoogleAuth("client")}
                disabled={loading}
                className={`group flex w-full items-start gap-3.5 border-2 p-4 text-left transition-all ${
                  activeRoleAttempt === "client"
                    ? "border-[#005d42] bg-[#eff4ff] shadow-[2px_2px_0px_#0b1c30]"
                    : "border-[#0b1c30] bg-white hover:bg-[#eff4ff] hover:shadow-[3px_3px_0px_#0b1c30] active:translate-x-[1px] active:translate-y-[1px]"
                } disabled:opacity-60`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#0b1c30] bg-[#005d42] text-white">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-headline text-sm font-bold uppercase tracking-wide text-[#0b1c30]">
                      I&apos;m a Client
                    </span>
                    <span className="border border-[#005d42] bg-[#dce9ff] px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#005d42]">
                      HIRING
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-xs text-[#3e4943] leading-relaxed">
                    Post gigs, hire verified specialists, manage escrow and approve milestones.
                  </p>
                  <div className="mt-2.5 flex items-center gap-1 font-mono text-[11px] font-semibold text-[#005d42] group-hover:underline">
                    {loading && activeRoleAttempt === "client" ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Opening Google popup...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue as Client</span>
                        <ArrowRight className="h-3 w-3" />
                      </>
                    )}
                  </div>
                </div>
              </button>

              {/* Option 2: Freelancer */}
              <button
                type="button"
                onClick={() => executeGoogleAuth("freelancer")}
                disabled={loading}
                className={`group flex w-full items-start gap-3.5 border-2 p-4 text-left transition-all ${
                  activeRoleAttempt === "freelancer"
                    ? "border-[#005d42] bg-[#eff4ff] shadow-[2px_2px_0px_#0b1c30]"
                    : "border-[#0b1c30] bg-white hover:bg-[#eff4ff] hover:shadow-[3px_3px_0px_#0b1c30] active:translate-x-[1px] active:translate-y-[1px]"
                } disabled:opacity-60`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[#0b1c30] bg-[#0047bf] text-white">
                  <Code2 className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-headline text-sm font-bold uppercase tracking-wide text-[#0b1c30]">
                      I&apos;m a Freelancer
                    </span>
                    <span className="border border-[#0047bf] bg-[#eef2ff] px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#0047bf]">
                      TALENT
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-xs text-[#3e4943] leading-relaxed">
                    Offer specialized services, deliver orders, build your reputation & earn payouts.
                  </p>
                  <div className="mt-2.5 flex items-center gap-1 font-mono text-[11px] font-semibold text-[#0047bf] group-hover:underline">
                    {loading && activeRoleAttempt === "freelancer" ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Opening Google popup...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue as Freelancer</span>
                        <ArrowRight className="h-3 w-3" />
                      </>
                    )}
                  </div>
                </div>
              </button>
            </div>

            {/* Footer note */}
            <div className="mt-4 flex items-center gap-2 border-t border-[#e5e7eb] pt-3 text-[11px] font-mono text-[#6e7a73]">
              <ShieldCheck className="h-4 w-4 text-[#005d42] shrink-0" />
              <span>You can always switch your active workspace later in your profile.</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
