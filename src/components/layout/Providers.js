"use client";

import { ToastProvider } from "@/components/ui/ToastProvider";
import { AuthProvider } from "@/context/AuthContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { MarketplaceProvider } from "@/context/MarketplaceContext";

export default function Providers({ children }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <MarketplaceProvider>
          <FavoritesProvider>{children}</FavoritesProvider>
        </MarketplaceProvider>
      </AuthProvider>
    </ToastProvider>
  );
}