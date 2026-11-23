"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, ShieldCheck, UserCheck, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/ToastProvider";

export default function GoogleAuthModal({
  isOpen,
  onClose,
  role = "client",
  mode = "register",
}) {
  const router = useRouter();
  const { loginWithGoogleDemo, loginWithProvider } = useAuth();
  const { showToast } = useToast();

  const [activeRole, setActiveRole] = useState(role);
  const [name, setName] = useState(role === "freelancer" ? "Linus Torvalds" : "Raj Patel");
  const [email, setEmail] = useState(role === "freelancer" ? "linus.torvalds@gmail.com" : "rajpatel123@gmail.com");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("instant"); // 'instant' | 'setup'

  if (!isOpen) return null;

  function selectPreset(presetName, presetEmail, presetRole) {
    setName(presetName);
    setEmail(presetEmail);
    setActiveRole(presetRole);
  }

  async function handleDemoSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await loginWithGoogleDemo({
        name,
        email,
        role: activeRole,
      });
      if (result.ok) {
        showToast(
          `Signed ${mode === "login" ? "in" : "up"} with Google as ${activeRole.toUpperCase()}!`,
          "success"
        );
        onClose();
        router.push(activeRole === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client");
      }
    } catch {
      showToast("Google authentication failed.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleLiveOAuth() {
    setLoading(true);
    showToast("Launching Supabase live Google OAuth...", "info");
    const res = await loginWithProvider("google", activeRole, true);
    if (!res.ok) {
      showToast(
        res.error || "Live Google provider is not enabled in Supabase Dashboard.",
        "error"
      );
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-lg border border-[#0b1c30] bg-white p-6 shadow-[4px_4px_0px_#0b1c30]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-[#6e7a73] hover:text-[#0b1c30]"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center border border-[#0b1c30] bg-white font-bold text-xl text-[#4285f4] shadow-[1px_1px_0px_#0b1c30]">
            G
          </span>
          <div>
            <h2 className="font-headline text-lg font-bold uppercase tracking-tight text-[#0b1c30]">
              {mode === "login" ? "Sign In with Google" : "Sign Up with Google"}
            </h2>
            <p className="font-mono text-[11px] text-[#6e7a73]">
              Deterministic Google Identity Simulation &amp; Live Setup
            </p>
          </div>
        </div>

        {/* Notice badge */}
        <div className="mt-4 border border-amber-300 bg-amber-50 p-3 font-mono text-xs text-amber-900 leading-relaxed">
          <p className="font-bold">⚠️ Supabase Google Provider is Disabled</p>
          <p className="mt-1 text-[11px]">
            Supabase returned: <code className="bg-amber-100 px-1 font-semibold">Unsupported provider: provider is not enabled</code>. Use Instant Google Sign-In below to proceed immediately.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="mt-4 grid grid-cols-2 border border-[#0b1c30] font-mono text-xs font-bold text-center">
          <button
            type="button"
            onClick={() => setActiveTab("instant")}
            className={`py-2 transition ${
              activeTab === "instant"
                ? "bg-[#005d42] text-white"
                : "bg-white text-[#0b1c30] hover:bg-[#eff4ff]"
            }`}
          >
            Instant Google Sign-In
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("setup")}
            className={`py-2 border-l border-[#0b1c30] transition ${
              activeTab === "setup"
                ? "bg-[#005d42] text-white"
                : "bg-white text-[#0b1c30] hover:bg-[#eff4ff]"
            }`}
          >
            Enable Real Google Cloud
          </button>
        </div>

        {activeTab === "instant" ? (
          <form onSubmit={handleDemoSubmit} className="mt-4 space-y-3 font-mono text-xs">
            {/* Role Selector */}
            <div>
              <label className="block font-bold uppercase tracking-wider text-[#0b1c30]">
                Select Archetype Role
              </label>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveRole("client");
                    setName("Raj Patel");
                    setEmail("rajpatel123@gmail.com");
                  }}
                  className={`border py-2 text-center font-bold uppercase tracking-wider transition ${
                    activeRole === "client"
                      ? "border-[#005d42] bg-[#eff4ff] text-[#005d42] ring-1 ring-[#005d42]"
                      : "border-[#e5e7eb] bg-white text-[#6e7a73] hover:border-[#6e7a73]"
                  }`}
                >
                  💼 Client
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveRole("freelancer");
                    setName("Elena Rostova");
                    setEmail("developer@agency.io");
                  }}
                  className={`border py-2 text-center font-bold uppercase tracking-wider transition ${
                    activeRole === "freelancer"
                      ? "border-[#005d42] bg-[#eff4ff] text-[#005d42] ring-1 ring-[#005d42]"
                      : "border-[#e5e7eb] bg-white text-[#6e7a73] hover:border-[#6e7a73]"
                  }`}
                >
                  💻 Freelancer
                </button>
              </div>
            </div>

            {/* Quick Presets */}
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#6e7a73]">
                Quick Profiles:
              </span>
              <div className="mt-1 flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => selectPreset("Raj Patel", "rajpatel123@gmail.com", "client")}
                  className="border border-[#e5e7eb] bg-[#f8f9ff] px-2 py-1 text-[11px] text-[#0b1c30] hover:border-[#005d42] hover:text-[#005d42]"
                >
                  Raj Patel (Client)
                </button>
                <button
                  type="button"
                  onClick={() => selectPreset("Elena Rostova", "developer@agency.io", "freelancer")}
                  className="border border-[#e5e7eb] bg-[#f8f9ff] px-2 py-1 text-[11px] text-[#0b1c30] hover:border-[#005d42] hover:text-[#005d42]"
                >
                  Elena Rostova (Freelancer)
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[#0b1c30]">
                Google Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 h-9 w-full border border-[#6e7a73] bg-white px-3 font-sans text-sm text-[#0b1c30] focus:border-2 focus:border-[#0b1c30] focus:outline-none"
                placeholder="Raj Patel"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[#0b1c30]">
                Gmail Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 h-9 w-full border border-[#6e7a73] bg-white px-3 font-sans text-sm text-[#0b1c30] focus:border-2 focus:border-[#0b1c30] focus:outline-none"
                placeholder="rajpatel123@gmail.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-11 w-full items-center justify-center gap-2 bg-[#005d42] font-mono text-xs font-bold uppercase tracking-wider text-white shadow-[2px_2px_0px_#0b1c30] hover:bg-[#047857] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-50"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>
                {loading
                  ? "Authenticating..."
                  : `${mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"} AS ${activeRole.toUpperCase()} →`}
              </span>
            </button>
          </form>
        ) : (
          <div className="mt-4 space-y-3 font-mono text-xs text-[#0b1c30]">
            <p className="text-[#3e4943] leading-relaxed">
              To enable live Google login with real Google accounts in your Supabase project (<code className="bg-slate-100 px-1 font-semibold">pwrbkzlpfricutohtldd</code>):
            </p>

            <div className="border border-[#e5e7eb] bg-[#eff4ff] p-2.5 text-[11px] space-y-1.5">
              <p className="font-bold text-[#005d42]">1. Copy Supabase Callback URL:</p>
              <code className="block bg-white p-2 border border-[#005d42]/30 select-all font-semibold break-all text-[11px]">
                https://pwrbkzlpfricutohtldd.supabase.co/auth/v1/callback
              </code>
            </div>

            <div className="border border-[#e5e7eb] p-2.5 text-[11px] space-y-1">
              <p className="font-bold">2. Google Cloud Console:</p>
              <p className="text-[#3e4943]">
                Create an OAuth 2.0 Client ID (Web Application) and paste the URL above under <strong>Authorized redirect URIs</strong>.
              </p>
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-[#005d42] font-bold underline"
              >
                Open Google Cloud Console <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="border border-[#e5e7eb] p-2.5 text-[11px] space-y-1">
              <p className="font-bold">3. Supabase Dashboard:</p>
              <p className="text-[#3e4943]">
                Go to Authentication &gt; Providers &gt; Google, toggle it ON, and paste Client ID &amp; Client Secret.
              </p>
              <a
                href="https://supabase.com/dashboard/project/pwrbkzlpfricutohtldd/auth/providers"
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-[#005d42] font-bold underline"
              >
                Open Supabase Providers <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <button
              type="button"
              onClick={handleLiveOAuth}
              disabled={loading}
              className="mt-2 flex h-10 w-full items-center justify-center gap-2 border border-[#0b1c30] bg-[#f8f9ff] font-mono text-xs font-bold uppercase tracking-wider text-[#0b1c30] shadow-[2px_2px_0px_#0b1c30] hover:bg-[#dce9ff] transition-all disabled:opacity-50"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Test Live Supabase OAuth (If Configured)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
