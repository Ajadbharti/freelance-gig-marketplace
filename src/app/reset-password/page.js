import { Suspense } from "react";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

export const metadata = {
  title: "Reset Password | GigMarket — Freelance Gig Marketplace",
  description: "Create a new secure password for your GigMarket account under deterministic escrow and identity protection.",
};

function FormFallback() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6" role="status" aria-label="Loading">
      <div className="w-full max-w-md space-y-4 rounded-3xl bg-white p-8 border border-slate-200">
        <LoadingSkeleton className="h-8 w-1/3 rounded-lg" />
        <LoadingSkeleton className="h-6 w-2/3 rounded-md" />
        <LoadingSkeleton className="h-44 w-full rounded-2xl" />
        <LoadingSkeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<FormFallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
