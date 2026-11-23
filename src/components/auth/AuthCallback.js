"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSessionUser } = useAuth();
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let active = true;

    async function processCallback() {
      const urlError = searchParams.get("error_description") || searchParams.get("error");
      if (urlError) {
        if (active) setErrorMsg(urlError);
        return;
      }

      try {
        const supabase = createClient();
        const code = searchParams.get("code");

        let authUser = null;

        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error("Exchange code error:", error);
            if (active) setErrorMsg(error.message);
            return;
          }
          authUser = data?.session?.user || data?.user;
        } else {
          const { data } = await supabase.auth.getSession();
          authUser = data?.session?.user;
        }

        if (authUser) {
          // Read selected role from registration if stored
          let selectedRole = "client";
          try {
            const r = localStorage.getItem("gigcraft_in:selected_role");
            if (r) {
              selectedRole = r;
              localStorage.removeItem("gigcraft_in:selected_role");
            }
          } catch {}

          const meta = authUser.user_metadata || {};
          const fullName =
            meta.full_name || meta.name || meta.user_name || authUser.email?.split("@")[0] || "Google User";
          const initials = fullName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "GU";

          const sessionUser = {
            id: authUser.id,
            name: fullName,
            email: authUser.email,
            role: meta.role || selectedRole,
            avatar: meta.avatar_url || meta.picture || "",
            initials: initials,
            joinedAt: authUser.created_at || new Date().toISOString(),
            isGoogleUser: true,
          };

          if (setSessionUser) {
            setSessionUser(sessionUser);
          } else {
            localStorage.setItem("gigcraft_in:user", JSON.stringify(sessionUser));
          }

          router.replace(sessionUser.role === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client");
        } else {
          // Fallback: check if session already in storage
          const saved = localStorage.getItem("gigcraft_in:user");
          if (saved) {
            const parsed = JSON.parse(saved);
            router.replace(parsed.role === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client");
          } else {
            if (active) setErrorMsg("No active session detected. Please sign in again.");
          }
        }
      } catch (err) {
        console.error("OAuth callback error:", err);
        if (active) setErrorMsg(err.message || "Failed to complete sign-in.");
      }
    }

    processCallback();

    return () => {
      active = false;
    };
  }, [router, searchParams, setSessionUser]);

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-md border border-[#e5e7eb] bg-white p-8 shadow-[3px_3px_0px_#0b1c30] text-center font-mono">
        {errorMsg ? (
          <>
            <div className="mx-auto flex h-12 w-12 items-center justify-center border border-[#ba1a1a] bg-red-50 text-xl font-bold text-[#ba1a1a]">
              ✕
            </div>
            <h1 className="mt-4 font-headline text-xl font-bold uppercase tracking-tight text-[#0b1c30]">
              Sign-in did not complete
            </h1>
            <p className="mt-2 text-xs text-[#6e7a73] leading-relaxed">
              {errorMsg}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                href="/login"
                className="border border-[#0b1c30] bg-[#005d42] px-5 py-2.5 font-mono text-xs font-bold uppercase text-white shadow-[2px_2px_0px_#0b1c30] hover:bg-[#047857]"
              >
                Back to Login
              </Link>
              <Link
                href="/register"
                className="border border-[#0b1c30] bg-white px-5 py-2.5 font-mono text-xs font-bold uppercase text-[#0b1c30] shadow-[2px_2px_0px_#0b1c30] hover:bg-[#eff4ff]"
              >
                Sign Up
              </Link>
            </div>
          </>
        ) : (
          <>
            <div
              className="mx-auto h-10 w-10 animate-spin border-4 border-[#eff4ff] border-t-[#005d42]"
              aria-hidden="true"
            />
            <h1 className="mt-6 font-headline text-lg font-bold uppercase tracking-tight text-[#0b1c30]">
              Authenticating with Google...
            </h1>
            <p className="mt-2 text-xs text-[#3e4943]">
              Synchronizing cryptographic escrow credentials.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
