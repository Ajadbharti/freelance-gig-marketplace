"use client";

import { CheckCircle2, Search, ShieldCheck, UserCheck } from "lucide-react";

const STEPS = [
  {
    step: "01",
    title: "Find a Service",
    description: "Search by skill, budget, or project scope. Explore transparent packages with clear deliverables.",
    icon: Search,
  },
  {
    step: "02",
    title: "Choose a Freelancer",
    description: "Compare verified freelancer portfolios, client reviews, and milestones before hiring.",
    icon: UserCheck,
  },
  {
    step: "03",
    title: "Get Your Work Done",
    description: "Collaborate in real-time under deterministic milestone escrow with 100% payment release on approval.",
    icon: ShieldCheck,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 sm:py-20 lg:py-24 bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="font-sans text-xs font-bold text-violet-600 tracking-wider uppercase bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
            Simple &amp; Transparent
          </span>
          <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            How GigMarket Works
          </h2>
          <p className="font-sans text-sm sm:text-base text-slate-500">
            From search to final delivery, we protect your contracts with deterministic escrow and clear milestone approvals.
          </p>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="relative rounded-3xl bg-white p-8 border border-slate-200/90 shadow-sm hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1 transition-all duration-200 flex flex-col items-start"
              >
                {/* Step Number & Icon */}
                <div className="flex items-center justify-between w-full mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/20">
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="font-headline text-3xl font-extrabold text-slate-200">
                    {s.step}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="font-headline text-xl font-bold text-slate-900 mb-2.5">
                  {s.title}
                </h3>
                <p className="font-sans text-sm text-slate-500 leading-relaxed">
                  {s.description}
                </p>

                {/* Subtle bottom checkmark */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Guaranteed Quality</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
