import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Column 1 */}
          <div>
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">CATEGORIES</h3>
            <ul className="mt-4 space-y-2.5 font-mono text-xs text-slate-600">
              <li>
                <Link href="/gigs?category=design-creative" className="transition hover:text-[#047857]">
                  Graphics & Design
                </Link>
              </li>
              <li>
                <Link href="/gigs?category=development-tech" className="transition hover:text-[#047857]">
                  Digital Engineering
                </Link>
              </li>
              <li>
                <Link href="/gigs?category=writing-translation" className="transition hover:text-[#047857]">
                  Writing & Copy
                </Link>
              </li>
              <li>
                <Link href="/gigs?category=ai-services" className="transition hover:text-[#047857]">
                  AI Tooling & Models
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">ABOUT</h3>
            <ul className="mt-4 space-y-2.5 font-mono text-xs text-slate-600">
              <li>
                <Link href="/#about" className="transition hover:text-[#047857]">
                  Platform Overview
                </Link>
              </li>
              <li>
                <Link href="/#careers" className="transition hover:text-[#047857]">
                  Engineering Careers
                </Link>
              </li>
              <li>
                <Link href="/#press" className="transition hover:text-[#047857]">
                  Press & Media
                </Link>
              </li>
              <li>
                <Link href="/#partners" className="transition hover:text-[#047857]">
                  Partnership Network
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">SUPPORT</h3>
            <ul className="mt-4 space-y-2.5 font-mono text-xs text-slate-600">
              <li>
                <Link href="/#help" className="transition hover:text-[#047857]">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/#dispute" className="transition hover:text-[#047857]">
                  Escrow Dispute Desk
                </Link>
              </li>
              <li>
                <Link href="/#standards" className="transition hover:text-[#047857]">
                  Contract Standards
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="transition hover:text-[#047857]">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">TRUST & SAFETY</h3>
            <ul className="mt-4 space-y-2.5 font-mono text-xs text-slate-600">
              <li>
                <Link href="/#badging" className="transition hover:text-[#047857]">
                  Verified Badging
                </Link>
              </li>
              <li>
                <Link href="/#protection" className="transition hover:text-[#047857]">
                  Milestone Protection
                </Link>
              </li>
              <li>
                <Link href="/#auditing" className="transition hover:text-[#047857]">
                  Code Auditing
                </Link>
              </li>
              <li>
                <Link href="/#guidelines" className="transition hover:text-[#047857]">
                  Community Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5 */}
          <div>
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-900">TERMS & LAW</h3>
            <ul className="mt-4 space-y-2.5 font-mono text-xs text-slate-600">
              <li>
                <Link href="/#terms" className="transition hover:text-[#047857]">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/#privacy" className="transition hover:text-[#047857]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/#agreement" className="transition hover:text-[#047857]">
                  Escrow Agreement
                </Link>
              </li>
              <li>
                <Link href="/#cookies" className="transition hover:text-[#047857]">
                  Cookie Preferences
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-slate-950">GIGCRAFT BHARAT</span>
            <span className="font-mono text-xs text-slate-500">
              © 2025 GigCraft Technologies India Pvt. Ltd. All rights reserved.
            </span>
          </div>
          <div className="font-mono text-xs uppercase tracking-wider text-slate-500">
            ENGINEERED FOR HIGH-OUTPUT TECHNICAL CONTRACTS // BENGALURU • MUMBAI • HYDERABAD • NCR
          </div>
        </div>
      </div>
    </footer>
  );
}
