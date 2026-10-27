import "./globals.css";
import Providers from "@/components/layout/Providers";

export const metadata = {
  title: "GigNest | Freelance Marketplace (Demo)",
  description: "A demo freelance gig marketplace built with Next.js. Uses mock data and browser storage.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}