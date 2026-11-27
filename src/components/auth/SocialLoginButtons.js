"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/ToastProvider";

function GoogleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

export default function SocialLoginButtons({ role = "client", onAuthSuccess }) {
  const { loginWithFirebaseGoogle } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleGoogleSignIn() {
    try {
      setLoading(true);
      const res = await loginWithFirebaseGoogle(role);
      if (res?.ok && res?.user) {
        showToast(`Welcome back, ${res.user.name}!`, "success");
        if (onAuthSuccess) {
          onAuthSuccess(res.user);
        } else {
          const target = res.user.role === "freelancer" ? "/freelancer/dashboard" : "/client/dashboard";
          window.location.href = target;
        }
      } else if (res?.error) {
        showToast(res.error, "error");
      }
    } catch (err) {
      showToast(err.message || "Google authentication failed", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white text-slate-800 border border-slate-200/90 font-sans text-sm font-semibold hover:bg-slate-50/80 hover:border-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 transition-all shadow-sm active:scale-[0.99] disabled:opacity-60 cursor-pointer"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-slate-300 border-t-violet-600 rounded-full animate-spin" />
        ) : (
          <GoogleIcon />
        )}
        <span>{loading ? "Connecting to Google..." : "Continue with Google"}</span>
      </button>
    </div>
  );
}
