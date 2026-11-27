"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isAuthPage =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname.startsWith("/gigs") ||
    pathname.startsWith("/freelancers") ||
    pathname.startsWith("/client") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/saved-gigs") ||
    pathname.startsWith("/messages");

  if (isAuthPage) {
    return null;
  }

  return (
    <footer className="border-t border-[#e5e7eb] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Column 1 */}
          <div>
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b1c30]">CATEGORIES</h3>
            <ul className="mt-4 space-y-2.5 font-mono text-xs text-[#3e4943]">
              <li>
                <Link href="/gigs?category=graphics-design" className="transition hover:text-[#005d42]">
                  Graphics & Design
                </Link>
              </li>
              <li>
                <Link href="/gigs?category=web-development" className="transition hover:text-[#005d42]">
                  Web Development
                </Link>
              </li>
              <li>
                <Link href="/gigs?category=writing-translation" className="transition hover:text-[#005d42]">
                  Writing & Translation
                </Link>
              </li>
              <li>
                <Link href="/gigs?category=programming-technology" className="transition hover:text-[#005d42]">
                  Programming & Technology
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b1c30]">ABOUT</h3>
            <ul className="mt-4 space-y-2.5 font-mono text-xs text-[#3e4943]">
              <li>
                <Link href="/#about" className="transition hover:text-[#005d42]">
                  Platform Overview
                </Link>
              </li>
              <li>
                <Link href="/#careers" className="transition hover:text-[#005d42]">
                  Engineering Careers
                </Link>
              </li>
              <li>
                <Link href="/#press" className="transition hover:text-[#005d42]">
                  Press & Media
                </Link>
              </li>
              <li>
                <Link href="/#partners" className="transition hover:text-[#005d42]">
                  Partnership Network
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b1c30]">SUPPORT</h3>
            <ul className="mt-4 space-y-2.5 font-mono text-xs text-[#3e4943]">
              <li>
                <Link href="/#help" className="transition hover:text-[#005d42]">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/#dispute" className="transition hover:text-[#005d42]">
                  Escrow Dispute Desk
                </Link>
              </li>
              <li>
                <Link href="/#standards" className="transition hover:text-[#005d42]">
                  Contract Standards
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="transition hover:text-[#005d42]">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b1c30]">TRUST & SAFETY</h3>
            <ul className="mt-4 space-y-2.5 font-mono text-xs text-[#3e4943]">
              <li>
                <Link href="/#badging" className="transition hover:text-[#005d42]">
                  Verified Badging
                </Link>
              </li>
              <li>
                <Link href="/#protection" className="transition hover:text-[#005d42]">
                  Milestone Protection
                </Link>
              </li>
              <li>
                <Link href="/#auditing" className="transition hover:text-[#005d42]">
                  Code Auditing
                </Link>
              </li>
              <li>
                <Link href="/#guidelines" className="transition hover:text-[#005d42]">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link href="/#standards" className="transition hover:text-[#005d42]">
                  Platform Standards
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5 */}
          <div>
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b1c30]">TERMS & LAW</h3>
            <ul className="mt-4 space-y-2.5 font-mono text-xs text-[#3e4943]">
              <li>
                <Link href="/#terms" className="transition hover:text-[#005d42]">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/#privacy" className="transition hover:text-[#005d42]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/#agreement" className="transition hover:text-[#005d42]">
                  Escrow Agreement
                </Link>
              </li>
              <li>
                <Link href="/#cookies" className="transition hover:text-[#005d42]">
                  Cookie Preferences
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#e5e7eb] pt-8 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-headline font-bold uppercase text-[#005d42]">GIGCRAFT BHARAT</span>
            <span className="font-mono text-xs text-[#6e7a73]">
              © 2026 GigCraft Technologies India Pvt. Ltd. All rights reserved.
            </span>
          </div>
          <div className="font-mono text-xs uppercase tracking-wider text-[#6e7a73]">
            ENGINEERED FOR HIGH-OUTPUT TECHNICAL CONTRACTS // BENGALURU • MUMBAI • HYDERABAD • NCR
          </div>
        </div>
      </div>
    </footer>
  );
}
