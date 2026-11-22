"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, hydrated } = useAuth();

  const urlError = searchParams.get("error_description") || searchParams.get("error");

  useEffect(() => {
    if (urlError || !hydrated || !user) return;
    if (user.needsRole) router.replace("/welcome");
    else router.replace(user.role === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client");
  }, [urlError, hydrated, user, router]);

  const failed = Boolean(urlError) || (hydrated && !user);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      {failed ? (
        <>
          <h1 className="font-headline text-2xl font-bold uppercase tracking-tight text-[#0b1c30]">Sign-in did not complete</h1>
          <p className="mt-2 text-sm text-[#3e4943]">{urlError || "We could not sign you in. Please try again."}</p>
          <Link
            href="/"
            className="btn-primary mt-6 inline-block"
          >
            Back to sign in
          </Link>
        </>
      ) : (
        <>
          <div
            className="h-10 w-10 animate-spin border-4 border-[#eff4ff] border-t-[#005d42]"
            aria-hidden="true"
          />
          <h1 className="mt-6 font-headline text-xl font-bold uppercase tracking-tight text-[#0b1c30]">Signing you in...</h1>
          <p className="mt-2 font-mono text-xs text-[#3e4943]">Please wait a moment.</p>
        </>
      )}
    </div>
  );
}
