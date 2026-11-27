"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Expand, Layers, Sparkles } from "lucide-react";

const GALLERY_IMAGES = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80",
    title: "Minimalist Modern Geometric Business Logo & Brand Identity",
    caption: "Primary Logo Concept on Premium Brand Stationery",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80",
    title: "Brand Guidelines, Typography & Color Palette System",
    caption: "Full Brand Style Guide with Color Codes & Typography",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    title: "3D Metallic Embossed Logo Presentation Mockup",
    caption: "High-Resolution 3D Matte Mockup Presentation",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    title: "Vector Scalable Artboards in Adobe Illustrator and Figma",
    caption: "Clean Vector Paths, Source Files (AI, SVG, EPS)",
  },
];

export default function GigGallery() {
  const [currentIdx, setCurrentIdx] = useState(0);

  function handlePrev() {
    setCurrentIdx((prev) => (prev === 0 ? GALLERY_IMAGES.length - 1 : prev - 1));
  }

  function handleNext() {
    setCurrentIdx((prev) => (prev === GALLERY_IMAGES.length - 1 ? 0 : prev + 1));
  }

  const activeImage = GALLERY_IMAGES[currentIdx];

  return (
    <div className="space-y-3">
      {/* Main Image Viewport */}
      <div className="group relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-900 border border-slate-200/80 shadow-md">
        <img
          src={activeImage.url}
          alt={activeImage.title}
          className="h-full w-full object-cover object-center transition-all duration-300"
          onError={(e) => {
            // Elegant vector fallback if network is restricted
            e.currentTarget.style.display = "none";
            e.currentTarget.nextElementSibling?.classList.remove("hidden");
          }}
        />

        {/* Vector SVG Fallback Canvas */}
        <div className="hidden h-full w-full p-8 flex flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950 text-white">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase text-violet-400 bg-violet-950/80 border border-violet-500/30 px-2.5 py-1 rounded-md">
              Vector Asset Preview
            </span>
            <span className="text-xs text-slate-400">300 DPI CMYK</span>
          </div>
          <div className="text-center space-y-2">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600/20 border border-violet-500/30 text-violet-300">
              <Sparkles className="w-8 h-8" />
            </div>
            <h4 className="font-headline text-lg font-bold">{activeImage.title}</h4>
            <p className="text-xs text-slate-400">{activeImage.caption}</p>
          </div>
          <div className="flex justify-between text-xs text-slate-400 border-t border-slate-800 pt-3">
            <span>AI · EPS · SVG · PDF · PNG</span>
            <span className="text-emerald-400">Print Ready</span>
          </div>
        </div>

        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous gallery slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg backdrop-blur-md hover:bg-white hover:scale-105 active:scale-95 transition opacity-90 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next gallery slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg backdrop-blur-md hover:bg-white hover:scale-105 active:scale-95 transition opacity-90 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Slide Counter Overlay */}
        <div className="absolute bottom-3 right-3 rounded-lg bg-slate-950/70 px-2.5 py-1 text-xs font-mono font-medium text-white backdrop-blur-md border border-white/10">
          {currentIdx + 1} / {GALLERY_IMAGES.length}
        </div>

        {/* Caption Overlay */}
        <div className="absolute bottom-3 left-3 hidden sm:block rounded-lg bg-slate-950/70 px-3 py-1 text-xs text-slate-200 backdrop-blur-md border border-white/10">
          {activeImage.caption}
        </div>
      </div>

      {/* Thumbnails Row */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
        {GALLERY_IMAGES.map((img, idx) => {
          const isSelected = idx === currentIdx;

          return (
            <button
              key={img.id}
              type="button"
              onClick={() => setCurrentIdx(idx)}
              className={`relative aspect-[16/10] overflow-hidden rounded-xl border-2 transition cursor-pointer ${
                isSelected
                  ? "border-violet-600 ring-2 ring-violet-500/20 shadow-md scale-[1.02]"
                  : "border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-300"
              }`}
            >
              <img
                src={img.url}
                alt={img.title}
                className="h-full w-full object-cover"
              />
              {isSelected && (
                <div className="absolute inset-0 bg-violet-600/10 pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
