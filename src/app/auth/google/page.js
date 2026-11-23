"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Check, ChevronRight, UserPlus } from "lucide-react";

function GoogleMultiColorIcon({ className = "h-7 w-7" }) {
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

const GOOGLE_ACCOUNTS = [
  {
    name: "Ajad Bharti",
    email: "ajadbharti@gmail.com",
    avatarBg: "bg-[#005d42]",
    initials: "AB",
    badge: "Active",
  },
  {
    name: "Raj Patel",
    email: "rajpatel123@gmail.com",
    avatarBg: "bg-[#1a73e8]",
    initials: "RP",
  },
  {
    name: "Elena Rostova",
    email: "developer@agency.io",
    avatarBg: "bg-[#7b1fa2]",
    initials: "ER",
  },
];

function GooglePopupContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "client";
  const nextUrl = searchParams.get("next") || (role === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client");

  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customEmail, setCustomEmail] = useState("");

  async function completeAuth(name, email) {
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanName = (name || cleanEmail.split("@")[0] || "Google User").trim();
    const initials =
      cleanName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() || "GU";

    let sessionUser = {
      id: "usr-google-" + Date.now().toString(36),
      name: cleanName,
      email: cleanEmail,
      role: role,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=047857,0f172a`,
      initials: initials,
      joinedAt: new Date().toISOString(),
      isGoogleUser: true,
    };

    // 1. Backend database & secure session cookie integration
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          googleUser: {
            googleId: "g-" + Math.abs(cleanEmail.split("").reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)),
            name: cleanName,
            email: cleanEmail,
            picture: sessionUser.avatar,
          },
          role: role,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.user) {
          sessionUser = data.user;
        }
      }
    } catch (err) {
      console.warn("Backend auth call warning:", err);
    }

    try {
      localStorage.setItem("gigcraft_in:user", JSON.stringify(sessionUser));
      const raw = localStorage.getItem("gigcraft_in:registered_users");
      const list = raw ? JSON.parse(raw) : [];
      if (!list.some((u) => u.email === cleanEmail)) {
        list.push(sessionUser);
        localStorage.setItem("gigcraft_in:registered_users", JSON.stringify(list));
      }
    } catch {}

    // 2. Notify opener if opened as popup
    if (typeof window !== "undefined" && window.opener && !window.opener.closed) {
      try {
        window.opener.postMessage(
          { type: "GIGCRAFT_GOOGLE_AUTH_SUCCESS", user: sessionUser },
          "*"
        );
      } catch {}
      setTimeout(() => {
        window.close();
      }, 500);
      return;
    }

    // 3. Direct navigation if opened in full tab
    setTimeout(() => {
      window.location.href = nextUrl;
    }, 400);
  }

  function handleAccountClick(acc) {
    setSelectedEmail(acc.email);
    setIsAuthenticating(true);
    setTimeout(() => {
      completeAuth(acc.name, acc.email);
    }, 400);
  }

  function handleCustomSubmit(e) {
    e.preventDefault();
    if (!customName || !customEmail) return;
    setSelectedEmail(customEmail);
    setIsAuthenticating(true);
    setTimeout(() => {
      completeAuth(customName, customEmail);
    }, 400);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa] p-4 font-sans antialiased">
      <div className="relative w-full max-w-[450px] overflow-hidden rounded-2xl border border-[#dadce0] bg-white p-8 shadow-lg">
        {/* Animated Loading Bar */}
        {isAuthenticating && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#e8f0fe] overflow-hidden">
            <div className="h-full bg-[#1a73e8] animate-pulse" />
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <GoogleMultiColorIcon className="h-8 w-8" />
          <h1 className="mt-3 text-2xl font-normal text-[#202124]">
            Sign in with Google
          </h1>
          <p className="mt-1 text-sm text-[#5f6368]">
            Choose an account to continue to <span className="font-semibold text-[#202124]">GigCraft</span>
          </p>
        </div>

        {/* Account List or Custom Input */}
        <div className="mt-6">
          {!showCustomForm ? (
            <div className="divide-y divide-[#f1f3f4] rounded-lg border border-[#dadce0] overflow-hidden">
              {GOOGLE_ACCOUNTS.map((acc) => {
                const isSelected = selectedEmail === acc.email;
                return (
                  <button
                    key={acc.email}
                    type="button"
                    disabled={isAuthenticating}
                    onClick={() => handleAccountClick(acc)}
                    className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition hover:bg-[#f8f9fa] active:bg-[#e8f0fe] disabled:opacity-60"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white font-medium text-sm shadow-sm ${acc.avatarBg}`}
                    >
                      {acc.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-sm font-medium text-[#202124]">
                          {acc.name}
                        </p>
                        {acc.badge && (
                          <span className="rounded bg-[#e6f4ea] px-1.5 py-0.5 text-[10px] font-semibold text-[#137333]">
                            {acc.badge}
                          </span>
                        )}
                      </div>
                      <p className="truncate text-xs text-[#5f6368]">
                        {acc.email}
                      </p>
                    </div>
                    {isSelected ? (
                      <div className="h-4 w-4 shrink-0 rounded-full bg-[#1a73e8] text-white flex items-center justify-center">
                        <Check className="h-3 w-3" />
                      </div>
                    ) : (
                      <ChevronRight className="h-4 w-4 shrink-0 text-[#bdc1c6]" />
                    )}
                  </button>
                );
              })}

              {/* Use another account button */}
              <button
                type="button"
                disabled={isAuthenticating}
                onClick={() => setShowCustomForm(true)}
                className="flex w-full items-center gap-3.5 px-4 py-3.5 text-left transition hover:bg-[#f8f9fa] active:bg-[#e8f0fe]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-dashed border-[#9aa0a6] text-[#5f6368]">
                  <UserPlus className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#202124]">
                    Use another account
                  </p>
                  <p className="text-xs text-[#5f6368]">
                    Sign in with any Gmail address
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-[#bdc1c6]" />
              </button>
            </div>
          ) : (
            /* Custom account form */
            <form onSubmit={handleCustomSubmit} className="space-y-3">
              <button
                type="button"
                onClick={() => setShowCustomForm(false)}
                className="inline-flex items-center gap-1 text-xs text-[#1a73e8] hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to accounts
              </button>

              <div>
                <label className="block text-xs font-medium text-[#3c4043]">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Ajad Bharti"
                  className="mt-1 h-10 w-full rounded-md border border-[#dadce0] px-3 text-sm text-[#202124] focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#3c4043]">
                  Your Gmail Address
                </label>
                <input
                  type="email"
                  required
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="e.g. yourname@gmail.com"
                  className="mt-1 h-10 w-full rounded-md border border-[#dadce0] px-3 text-sm text-[#202124] focus:border-[#1a73e8] focus:outline-none focus:ring-1 focus:ring-[#1a73e8]"
                />
              </div>

              <button
                type="submit"
                disabled={isAuthenticating || !customName || !customEmail}
                className="flex h-10 w-full items-center justify-center rounded-md bg-[#1a73e8] text-sm font-medium text-white shadow hover:bg-[#1557b0] transition disabled:opacity-50"
              >
                {isAuthenticating ? "Signing in..." : "Continue to GigCraft"}
              </button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <p className="mt-5 text-[11px] leading-relaxed text-[#5f6368] text-center">
          To continue, Google will share your name, email address, language preference, and profile picture with GigCraft.
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-[#f1f3f4] pt-3 text-[11px] text-[#5f6368]">
          <span>English (United States)</span>
          <div className="flex gap-3">
            <span className="hover:underline cursor-pointer">Help</span>
            <span className="hover:underline cursor-pointer">Privacy</span>
            <span className="hover:underline cursor-pointer">Terms</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GoogleAuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#f8f9fa] text-xs font-mono text-slate-500">
          Loading Google Identity...
        </div>
      }
    >
      <GooglePopupContent />
    </Suspense>
  );
}
