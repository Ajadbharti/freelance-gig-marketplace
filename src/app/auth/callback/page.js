import { Suspense } from "react";
import AuthCallback from "@/components/auth/AuthCallback";

export const metadata = {
  title: "Signing in | GigCraft",
};

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <AuthCallback />
    </Suspense>
  );
}
