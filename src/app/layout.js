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
    <header className="h-16 border-b border-[#e5e7eb] bg-white">
      <div className="mx-auto flex h-full max-w-7xl items-center px-4 font-headline text-xl font-bold uppercase tracking-tight text-[#005d42]">
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
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Space+Grotesk:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-screen flex-col bg-[#f8f9ff] text-[#0b1c30] font-sans antialiased selection:bg-[#005d42] selection:text-white">
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
