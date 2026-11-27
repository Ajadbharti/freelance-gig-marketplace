"use client";

import { useState } from "react";
import { Check, ChevronDown, Download, FileCode, Layers, ShieldCheck, Sparkles, Terminal } from "lucide-react";

const SKILLS_LIST = [
  "Adobe Illustrator",
  "Adobe Photoshop",
  "Figma",
  "Vector Graphics",
  "Minimalist Logo",
  "Brand Identity",
  "Typography",
  "Color Palette",
  "3D Mockup",
  "Print Ready CMYK",
];

const FAQS_LIST = [
  {
    q: "What files and formats will I receive after delivery?",
    a: "You will receive high-resolution vector and raster files: Adobe Illustrator (.AI), Scalable Vector Graphics (.SVG), Encapsulated PostScript (.EPS), Print-Ready PDF (.PDF), Transparent Background (.PNG), and High-Resolution Web (.JPG) in 300 DPI CMYK and RGB color profiles.",
  },
  {
    q: "Do I get full commercial copyright ownership of the logo?",
    a: "Yes, 100%! Upon approval of the final milestone delivery, full intellectual property and commercial copyright rights are transferred to you with zero royalty fees.",
  },
  {
    q: "How does the revision process work?",
    a: "After you review the initial concepts, you can request adjustments to colors, fonts, geometry, or layout. Revisions are completed quickly within 24 hours.",
  },
  {
    q: "What information is needed to start designing my logo?",
    a: "Simply share your brand name, tagline (if any), a brief summary of what your business does, preferred color directions or inspirations, and your target audience.",
  },
];

export default function GigDescription() {
  const [openFaq, setOpenFaq] = useState(0);

  function toggleFaq(index) {
    setOpenFaq((prev) => (prev === index ? null : index));
  }

  return (
    <section className="space-y-10 py-6">
      {/* About This Gig Main Narrative */}
      <div className="space-y-4">
        <h2 className="font-headline text-2xl font-bold tracking-tight text-slate-900">
          About This Gig
        </h2>

        <div className="prose prose-slate max-w-none text-slate-600 font-sans text-sm sm:text-base leading-relaxed space-y-3.5">
          <p>
            Welcome! Are you looking for a <strong>modern, timeless, and professional logo</strong> that elevates your business above the competition and makes an unforgettable first impression? You are in the right place.
          </p>
          <p>
            With over 8 years of brand identity agency experience, I specialize in crafting clean, minimalist, and geometric logos tailored specifically to resonate with your target market. Every design is built from scratch in vector format, ensuring pixel-perfect clarity whether printed on a tiny business card or an enormous billboard.
          </p>
        </div>
      </div>

      {/* What You Will Get */}
      <div className="rounded-3xl border border-slate-200/90 bg-slate-50/60 p-6 sm:p-8 space-y-4">
        <h3 className="font-headline text-lg font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-violet-600" />
          <span>What You Will Get With This Gig:</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          {[
            "100% Original and bespoke vector design (No generic clip art)",
            "Scalable vector source files: AI, EPS, SVG, and editable PDF",
            "High-resolution 300 DPI transparent PNG and JPEG files",
            "Full commercial rights and intellectual property ownership",
            "Realistic 3D presentation mockups for client pitch decks",
            "Fast 24-hour turnaround on revision requests",
            "CMYK print-ready files + RGB digital screen optimization",
            "24/7 dedicated and friendly creative support",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mt-0.5">
                <Check className="w-3.5 h-3.5" />
              </div>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Skills & Technologies */}
      <div className="space-y-3">
        <h3 className="font-headline text-lg font-bold text-slate-900">
          Skills &amp; Design Expertise
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          {SKILLS_LIST.map((skill) => (
            <span
              key={skill}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:border-violet-300 hover:text-violet-700 transition cursor-default"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Delivery & Escrow Assurance */}
      <div className="rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50/70 via-indigo-50/40 to-white p-6 sm:p-7 space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-violet-600 text-white shrink-0 shadow-md shadow-violet-500/20">
            <Download className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-headline text-base font-bold text-slate-900">
              Instant Delivery &amp; Milestone Protection
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Your finalized files will be delivered in an organized, zip-compressed folder containing separate sub-folders for Web, Print, and Vector Sources. Payments stay safe in escrow until you approve the delivered work.
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-4">
        <h3 className="font-headline text-xl font-bold text-slate-900">
          Frequently Asked Questions
        </h3>

        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {FAQS_LIST.map((faq, idx) => {
            const isOpen = openFaq === idx;

            return (
              <div key={faq.q} className="py-4">
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="flex w-full items-center justify-between text-left font-sans text-sm sm:text-base font-semibold text-slate-900 hover:text-violet-600 transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-violet-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-2.5 font-sans text-xs sm:text-sm text-slate-600 leading-relaxed pr-8">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
