"use client";

import Link from "next/link";
import { Zap } from "lucide-react";

function GithubIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function TwitterIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.763z" />
    </svg>
  );
}

export default function HomeFooter() {
  return (
    <footer className="border-t border-slate-200/90 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16 lg:px-8">
        
        {/* Top 5-Column Grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          
          {/* Column 1: Brand Info */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25">
                <Zap className="w-4 h-4 fill-current" />
              </span>
              <span className="font-headline text-2xl font-bold tracking-tight text-slate-900">
                Gig<span className="text-violet-600">Market</span>
              </span>
            </Link>

            <p className="font-sans text-sm text-slate-500 max-w-sm leading-relaxed">
              The premier freelance marketplace for engineering, design, and digital innovation. Contracting under deterministic milestone escrow.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-violet-600 hover:border-violet-300 transition"
                aria-label="Twitter"
              >
                <TwitterIcon />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-violet-600 hover:border-violet-300 transition"
                aria-label="GitHub"
              >
                <GithubIcon />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-violet-600 hover:border-violet-300 transition"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
            </div>
          </div>

          {/* Column 2: Marketplace */}
          <div className="space-y-3">
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-900">
              Marketplace
            </h3>
            <ul className="space-y-2.5 font-sans text-sm text-slate-500">
              <li>
                <Link href="/explore" className="hover:text-violet-600 transition">
                  Explore Gigs
                </Link>
              </li>
              <li>
                <Link href="#categories" className="hover:text-violet-600 transition">
                  Browse Categories
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-violet-600 transition">
                  Top Freelancers
                </Link>
              </li>
              <li>
                <Link href="/register?role=freelancer" className="hover:text-violet-600 transition">
                  Become a Seller
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div className="space-y-3">
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-900">
              Categories
            </h3>
            <ul className="space-y-2.5 font-sans text-sm text-slate-500">
              <li>
                <Link href="/explore?category=web-development" className="hover:text-violet-600 transition">
                  Web Development
                </Link>
              </li>
              <li>
                <Link href="/explore?category=graphics-design" className="hover:text-violet-600 transition">
                  Graphics &amp; Design
                </Link>
              </li>
              <li>
                <Link href="/explore?category=data-ai" className="hover:text-violet-600 transition">
                  Data &amp; AI
                </Link>
              </li>
              <li>
                <Link href="/explore?category=programming-technology" className="hover:text-violet-600 transition">
                  Programming &amp; Tech
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div className="space-y-3">
            <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-900">
              Support
            </h3>
            <ul className="space-y-2.5 font-sans text-sm text-slate-500">
              <li>
                <Link href="/#help" className="hover:text-violet-600 transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/#escrow" className="hover:text-violet-600 transition">
                  Escrow Protection
                </Link>
              </li>
              <li>
                <Link href="/#standards" className="hover:text-violet-600 transition">
                  Trust &amp; Safety
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="hover:text-violet-600 transition">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-sans">
          <span>© 2026 GigMarket Inc. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="hover:text-slate-700 transition">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-slate-700 transition">
              Privacy Policy
            </Link>
            <Link href="/terms#cookies" className="hover:text-slate-700 transition">
              Cookie Preferences
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
