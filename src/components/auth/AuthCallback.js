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
          <h1 className="text-2xl font-bold text-slate-900">Sign-in did not complete</h1>
          <p className="mt-2 text-slate-600">{urlError || "We could not sign you in. Please try again."}</p>
          <Link
            href="/"
            className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Back to sign in
          </Link>
        </>
      ) : (
        <>
          <div
            className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"
            aria-hidden="true"
          />
          <h1 className="mt-6 text-xl font-semibold text-slate-900">Signing you in...</h1>
          <p className="mt-2 text-sm text-slate-600">Please wait a moment.</p>
        </>
      )}
    </div>
  );
}