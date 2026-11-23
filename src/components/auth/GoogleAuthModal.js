"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, ShieldCheck, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/ToastProvider";

export default function GoogleAuthModal({ isOpen, onClose, role = "client" }) {
  const router = useRouter();
  const { loginWithGoogleDemo } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState("Linus Torvalds");
  const [email, setEmail] = useState("linus.torvalds@gmail.com");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("instant"); // 'instant' | 'setup'

  if (!isOpen) return null;

  async function handleDemoSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await loginWithGoogleDemo({ name, email, role });
      if (result.ok) {
        showToast(`Signed in with Google as ${role.toUpperCase()}!`, "success");
        onClose();
        router.push(role === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client");
      }
    } catch {
      showToast("Google sign-in failed.", "error");
    } finally {
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
          <span className="font-bold text-2xl text-[#4285f4]">G</span>
          <div>
            <h2 className="font-headline text-lg font-bold uppercase tracking-tight text-[#0b1c30]">
              Sign Up with Google
            </h2>
            <p className="font-mono text-[11px] text-[#6e7a73]">
              Account Archetype: <strong className="text-[#005d42]">{role.toUpperCase()}</strong>
            </p>
          </div>
        </div>

        {/* Notice badge */}
        <div className="mt-4 border border-amber-300 bg-amber-50 p-3 font-mono text-xs text-amber-900 leading-relaxed">
          <p className="font-bold">⚠️ Supabase Google Provider is Disabled</p>
          <p className="mt-1 text-[11px]">
            Supabase response: <code className="bg-amber-100 px-1 font-semibold">Unsupported provider: provider is not enabled</code>.
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
          <form onSubmit={handleDemoSubmit} className="mt-5 space-y-4 font-mono text-xs">
            <p className="text-[#3e4943] leading-relaxed">
              Test your project with a verified Google Identity profile right now without waiting for Google Cloud verification.
            </p>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[#0b1c30]">
                Google Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1.5 h-10 w-full border border-[#6e7a73] bg-white px-3 font-sans text-sm text-[#0b1c30] focus:border-2 focus:border-[#0b1c30] focus:outline-none"
                placeholder="Linus Torvalds"
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
                className="mt-1.5 h-10 w-full border border-[#6e7a73] bg-white px-3 font-sans text-sm text-[#0b1c30] focus:border-2 focus:border-[#0b1c30] focus:outline-none"
                placeholder="yourname@gmail.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-11 w-full items-center justify-center gap-2 bg-[#005d42] font-mono text-xs font-bold uppercase tracking-wider text-white shadow-[2px_2px_0px_#0b1c30] hover:bg-[#047857] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all disabled:opacity-50"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>{loading ? "Authenticating..." : `CONTINUE AS ${role.toUpperCase()} →`}</span>
            </button>
          </form>
        ) : (
          <div className="mt-5 space-y-3 font-mono text-xs text-[#0b1c30]">
            <p className="text-[#3e4943] leading-relaxed">
              To enable live Google login with real accounts in this Supabase project (<code className="bg-slate-100 px-1 font-semibold">pwrbkzlpfricutohtldd</code>):
            </p>

            <div className="border border-[#e5e7eb] bg-[#eff4ff] p-3 text-[11px] space-y-2">
              <p className="font-bold text-[#005d42]">1. Copy Supabase Callback URL:</p>
              <code className="block bg-white p-2 border border-[#005d42]/30 select-all font-semibold break-all">
                https://pwrbkzlpfricutohtldd.supabase.co/auth/v1/callback
              </code>
            </div>

            <div className="border border-[#e5e7eb] p-3 text-[11px] space-y-1">
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

            <div className="border border-[#e5e7eb] p-3 text-[11px] space-y-1">
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
          </div>
        )}
      </div>
    </div>
  );
}
