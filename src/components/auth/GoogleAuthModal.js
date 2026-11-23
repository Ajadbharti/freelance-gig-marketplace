"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, ChevronRight, UserPlus, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/ToastProvider";

function GoogleMultiColorIcon({ className = "h-8 w-8" }) {
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

const PRESET_ACCOUNTS = [
  {
    name: "Ajad Bharti",
    email: "ajadbharti@gmail.com",
    avatarBg: "bg-[#005d42]",
    initials: "AB",
    defaultRole: "client",
    badge: "Primary Google Account",
  },
  {
    name: "Raj Patel",
    email: "rajpatel123@gmail.com",
    avatarBg: "bg-[#1a73e8]",
    initials: "RP",
    defaultRole: "client",
    badge: "Client Account",
  },
  {
    name: "Elena Rostova",
    email: "developer@agency.io",
    avatarBg: "bg-[#7b1fa2]",
    initials: "ER",
    defaultRole: "freelancer",
    badge: "Freelancer Account",
  },
];

export default function GoogleAuthModal({
  isOpen,
  onClose,
  role = "client",
  mode = "register",
}) {
  const router = useRouter();
  const { loginWithGoogleDemo } = useAuth();
  const { showToast } = useToast();

  const [activeRole, setActiveRole] = useState(role);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customEmail, setCustomEmail] = useState("");

  if (!isOpen) return null;

  async function handleAccountSelect(account) {
    setSelectedEmail(account.email);
    setIsAuthenticating(true);

    const targetRole =
      mode === "register"
        ? activeRole
        : account.defaultRole || activeRole;

    setTimeout(async () => {
      try {
        const result = await loginWithGoogleDemo({
          name: account.name,
          email: account.email,
          role: targetRole,
        });

        if (result.ok) {
          showToast(`Welcome, ${account.name}! Signed in with Google.`, "success");
          onClose();
          router.push(targetRole === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client");
        }
      } catch {
        showToast("Google authentication failed. Please try again.", "error");
        setIsAuthenticating(false);
      }
    }, 600);
  }

  async function handleCustomSubmit(e) {
    e.preventDefault();
    if (!customEmail || !customName) return;

    setSelectedEmail(customEmail);
    setIsAuthenticating(true);

    setTimeout(async () => {
      try {
        const result = await loginWithGoogleDemo({
          name: customName.trim(),
          email: customEmail.trim().toLowerCase(),
          role: activeRole,
        });

        if (result.ok) {
          showToast(`Welcome, ${customName}! Signed in with Google.`, "success");
          onClose();
          router.push(activeRole === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client");
        }
      } catch {
        showToast("Google authentication failed.", "error");
        setIsAuthenticating(false);
      }
    }, 600);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-[450px] overflow-hidden rounded-2xl border border-[#dadce0] bg-white shadow-2xl transition-all">
        {/* Animated Progress Bar when authenticating */}
        {isAuthenticating && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#e8f0fe] overflow-hidden z-10">
            <div className="h-full bg-[#1a73e8] animate-[indeterminate_1.5s_infinite_linear] origin-left" />
          </div>
        )}

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isAuthenticating}
          className="absolute right-4 top-4 rounded-full p-1 text-[#5f6368] hover:bg-[#f1f3f4] transition"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-7">
          {/* Google Icon & Header */}
          <div className="flex flex-col items-center text-center">
            <GoogleMultiColorIcon className="h-7 w-7" />
            <h2 className="mt-3 text-2xl font-normal text-[#202124]">
              Choose an account
            </h2>
            <p className="mt-1 text-sm text-[#5f6368]">
              to continue to <span className="font-semibold text-[#202124]">GigCraft</span>
            </p>

            {/* Role indicator / selector */}
            <div className="mt-3.5 inline-flex items-center gap-1 rounded-full border border-[#dadce0] bg-[#f8f9fa] p-1 text-xs">
              <span className="px-2 text-[#5f6368]">Role:</span>
              <button
                type="button"
                onClick={() => setActiveRole("client")}
                className={`rounded-full px-3 py-1 font-medium transition ${
                  activeRole === "client"
                    ? "bg-[#005d42] text-white shadow-sm"
                    : "text-[#3c4043] hover:bg-white"
                }`}
              >
                💼 Client
              </button>
              <button
                type="button"
                onClick={() => setActiveRole("freelancer")}
                className={`rounded-full px-3 py-1 font-medium transition ${
                  activeRole === "freelancer"
                    ? "bg-[#005d42] text-white shadow-sm"
                    : "text-[#3c4043] hover:bg-white"
                }`}
              >
                💻 Freelancer
              </button>
            </div>
          </div>

          {/* Accounts List or Custom Input */}
          <div className="mt-5">
            {!showCustomForm ? (
              <div className="divide-y divide-[#f1f3f4] rounded-lg border border-[#dadce0] overflow-hidden">
                {PRESET_ACCOUNTS.map((acc) => {
                  const isSelected = selectedEmail === acc.email;
                  return (
                    <button
                      key={acc.email}
                      type="button"
                      disabled={isAuthenticating}
                      onClick={() => handleAccountSelect(acc)}
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
                            <span className="rounded bg-[#f1f3f4] px-1.5 py-0.5 text-[10px] text-[#5f6368]">
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

                {/* Use another account option */}
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
                      Sign in with your own Google email
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-[#bdc1c6]" />
                </button>
              </div>
            ) : (
              /* Custom Account Form */
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

          {/* Google Disclaimer */}
          <p className="mt-5 text-[11px] leading-relaxed text-[#5f6368] text-center">
            To continue, Google will share your name, email address, language preference, and profile picture with GigCraft.
          </p>

          {/* Google Footer Links */}
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
    </div>
  );
}
