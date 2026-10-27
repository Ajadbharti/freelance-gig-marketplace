"use client";

import { ToastProvider } from "@/components/ui/ToastProvider";
import { AuthProvider } from "@/context/AuthContext";
import { MarketplaceProvider } from "@/context/MarketplaceContext";

export default function Providers({ children }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <MarketplaceProvider>{children}</MarketplaceProvider>
      </AuthProvider>
    </ToastProvider>
  );
}