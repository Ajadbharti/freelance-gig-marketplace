import { Suspense } from "react";
import RegisterForm from "@/components/auth/RegisterForm";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";

export const metadata = {
  title: "Sign up | GigNest",
};

function FormFallback() {
  return (
    <div className="mx-auto max-w-md space-y-4 px-4 py-12" role="status" aria-label="Loading">
      <LoadingSkeleton className="h-8 w-1/2" />
      <LoadingSkeleton className="h-24 w-full" />
      <LoadingSkeleton className="h-10 w-full" />
      <LoadingSkeleton className="h-10 w-full" />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<FormFallback />}>
      <RegisterForm />
    </Suspense>
  );
}