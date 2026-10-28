import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

export const metadata = {
  title: "Log in | GigNest",
};

function FormFallback() {
  return (
    <div className="mx-auto max-w-md space-y-4 px-4 py-12" role="status" aria-label="Loading">
      <LoadingSkeleton className="h-8 w-1/2" />
      <LoadingSkeleton className="h-40 w-full" />
      <LoadingSkeleton className="h-10 w-full" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<FormFallback />}>
      <LoginForm />
    </Suspense>
  );
}