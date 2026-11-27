"use client";

import { Briefcase, Check, ShoppingBag } from "lucide-react";

export default function AccountTypeSelector({ selectedType, onSelectType }) {
  return (
    <div className="space-y-2">
      <label className="block font-sans text-xs sm:text-sm font-semibold text-slate-800">
        Choose Account Type <span className="text-violet-600">*</span>
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Account Type">
        {/* Client Card */}
        <div
          role="radio"
          aria-checked={selectedType === "client"}
          tabIndex={0}
          onClick={() => onSelectType("client")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelectType("client");
            }
          }}
          className={`relative cursor-pointer rounded-2xl p-4 border transition-all duration-200 select-none ${
            selectedType === "client"
              ? "bg-violet-50/70 border-violet-600 ring-2 ring-violet-500/20 shadow-md shadow-violet-500/10"
              : "bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50"
          }`}
        >
          <div className="flex items-start justify-between">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                selectedType === "client"
                  ? "bg-violet-600 text-white shadow-sm shadow-violet-600/30"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
            </div>

            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full border text-[11px] transition ${
                selectedType === "client"
                  ? "border-violet-600 bg-violet-600 text-white"
                  : "border-slate-300 bg-white text-transparent"
              }`}
            >
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
          </div>

          <div className="mt-3">
            <h3 className="font-sans text-sm font-bold text-slate-900">
              Hire Freelancers
            </h3>
            <p className="mt-1 font-sans text-xs text-slate-500 leading-relaxed">
              Discover talented professionals and purchase services.
            </p>
          </div>
        </div>

        {/* Freelancer Card */}
        <div
          role="radio"
          aria-checked={selectedType === "freelancer"}
          tabIndex={0}
          onClick={() => onSelectType("freelancer")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelectType("freelancer");
            }
          }}
          className={`relative cursor-pointer rounded-2xl p-4 border transition-all duration-200 select-none ${
            selectedType === "freelancer"
              ? "bg-violet-50/70 border-violet-600 ring-2 ring-violet-500/20 shadow-md shadow-violet-500/10"
              : "bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50"
          }`}
        >
          <div className="flex items-start justify-between">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition ${
                selectedType === "freelancer"
                  ? "bg-violet-600 text-white shadow-sm shadow-violet-600/30"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <Briefcase className="w-5 h-5" />
            </div>

            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full border text-[11px] transition ${
                selectedType === "freelancer"
                  ? "border-violet-600 bg-violet-600 text-white"
                  : "border-slate-300 bg-white text-transparent"
              }`}
            >
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
          </div>

          <div className="mt-3">
            <h3 className="font-sans text-sm font-bold text-slate-900">
              Become a Freelancer
            </h3>
            <p className="mt-1 font-sans text-xs text-slate-500 leading-relaxed">
              Showcase your skills and start selling your services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
