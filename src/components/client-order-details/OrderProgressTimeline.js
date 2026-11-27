"use client";

import { Check, CheckCircle2, Clock, Sparkles } from "lucide-react";

export default function OrderProgressTimeline({ timeline = [] }) {
  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-6">
      
      {/* Timeline Section Title */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-headline text-base sm:text-lg font-bold text-slate-900">
            Order Progress Tracker
          </h3>
          <p className="font-sans text-xs text-slate-500 mt-0.5">
            Transparent milestone checkpoints from contract confirmation to escrow release.
          </p>
        </div>

        <span className="text-[11px] font-mono font-bold text-violet-700 bg-violet-50 px-2.5 py-1 rounded-full border border-violet-100">
          5 Milestones
        </span>
      </div>

      {/* Stepped Progress Bar */}
      <div className="relative">
        
        {/* Desktop / Tablet Horizontal Grid */}
        <div className="hidden md:grid md:grid-cols-5 gap-4 relative">
          
          {/* Background Connecting Line */}
          <div
            className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0"
            aria-hidden="true"
          />

          {timeline.map((step, idx) => {
            const isCompleted = step.completed;
            const isCurrent = step.current;

            return (
              <div key={step.step} className="relative z-10 flex flex-col items-center text-center space-y-2">
                {/* Step Circle Indicator */}
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all shadow-2xs ${
                    isCurrent
                      ? "bg-violet-600 text-white ring-4 ring-violet-200 animate-pulse"
                      : isCompleted
                      ? "bg-emerald-600 text-white"
                      : "bg-white border-2 border-slate-300 text-slate-400"
                  }`}
                >
                  {isCompleted && !isCurrent ? (
                    <Check className="w-4 h-4" />
                  ) : isCurrent ? (
                    <Clock className="w-4 h-4" />
                  ) : (
                    step.step
                  )}
                </div>

                {/* Step Title & Timestamp */}
                <div className="space-y-0.5 max-w-[130px]">
                  <p
                    className={`font-sans text-xs font-bold leading-tight ${
                      isCurrent
                        ? "text-violet-700"
                        : isCompleted
                        ? "text-slate-900"
                        : "text-slate-400"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono leading-tight">
                    {step.timestamp}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Vertical Stepper */}
        <div className="md:hidden space-y-4">
          {timeline.map((step, idx) => {
            const isCompleted = step.completed;
            const isCurrent = step.current;
            const isLast = idx === timeline.length - 1;

            return (
              <div key={step.step} className="flex items-start gap-3.5 relative">
                {!isLast && (
                  <div
                    className={`absolute left-4 top-8 bottom-0 w-0.5 ${
                      isCompleted ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                    aria-hidden="true"
                  />
                )}

                <div
                  className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center font-mono text-xs font-bold z-10 shadow-2xs ${
                    isCurrent
                      ? "bg-violet-600 text-white ring-4 ring-violet-200 animate-pulse"
                      : isCompleted
                      ? "bg-emerald-600 text-white"
                      : "bg-white border-2 border-slate-300 text-slate-400"
                  }`}
                >
                  {isCompleted && !isCurrent ? (
                    <Check className="w-4 h-4" />
                  ) : isCurrent ? (
                    <Clock className="w-4 h-4" />
                  ) : (
                    step.step
                  )}
                </div>

                <div className="pt-0.5 space-y-0.5 flex-1 pb-3">
                  <div className="flex items-center justify-between">
                    <p
                      className={`font-sans text-xs font-bold ${
                        isCurrent
                          ? "text-violet-700"
                          : isCompleted
                          ? "text-slate-900"
                          : "text-slate-400"
                      }`}
                    >
                      {step.title}
                    </p>
                    <span className="text-[10px] font-mono text-slate-400">
                      {step.timestamp}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
