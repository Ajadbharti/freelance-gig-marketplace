"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
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
  text = "Continue with Google",
  className = "",
  onSuccess,
}) {
  const { setSessionUser } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleGoogleClick() {
    if (!isFirebaseConfigured()) {
      showToast(
        "Firebase is not configured yet. Please add NEXT_PUBLIC_FIREBASE_API_KEY in .env.local",
        "error"
      );
      return;
    }

    setLoading(true);
    try {
      const res = await signInWithGooglePopup(role);

      if (res.ok && res.user) {
        setSessionUser(res.user);
        showToast(`Welcome, ${res.user.name}! Signed in with Google.`, "success");

        if (onSuccess) {
          onSuccess(res.user);
        } else {
          const dest = role === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client";
          window.location.href = dest;
        }
      } else {
        showToast(res.error || "Google sign-in failed. Please try again.", "error");
      }
    } catch (err) {
      showToast(err.message || "An unexpected error occurred during Google sign-in.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      disabled={loading}
      className={`flex h-11 w-full items-center justify-center gap-2.5 border border-[#0b1c30] bg-white font-mono text-xs font-semibold text-[#0b1c30] hover:bg-[#dce9ff] shadow-[2px_2px_0px_#0b1c30] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-60 ${className}`}
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
  );
}
