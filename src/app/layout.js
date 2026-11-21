import "./globals.css";
import { Suspense } from "react";
import Providers from "@/components/layout/Providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "GigCraft Bharat | Technical Marketplace & Milestone Escrow Protocol",
  description:
    "Contract India's top-tier software engineers, system architects, and UI/UX designers under deterministic cryptographic escrow milestones.",
};

function NavFallback() {
  return (
    <header className="h-16 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-full max-w-7xl items-center px-4 font-serif text-xl font-bold">
        GIGCRAFT
      </div>
    </header>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&family=Space+Grotesk:wght@300..700&family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-screen flex-col bg-[#f8f9ff] text-[#0b1c30] antialiased selection:bg-[#047857] selection:text-white font-sans">
        <Providers>
          <Suspense fallback={<NavFallback />}>
            <Navbar />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
