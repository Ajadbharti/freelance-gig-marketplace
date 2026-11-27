"use client";

import { useState } from "react";
import { ArrowUpRight, ExternalLink, Eye, Layers, Sparkles, X } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

const PORTFOLIO_PROJECTS = [
  {
    id: "proj-1",
    title: "CloudScale SaaS Analytics Dashboard",
    description: "Enterprise multi-tenant telemetry platform featuring real-time stream graphs, RBAC permission roles, team workspaces, and sub-second query performance.",
    cover: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    tags: ["Next.js", "Node.js", "Tailwind CSS", "PostgreSQL", "WebSockets"],
    liveUrl: "https://cloudscale-demo.example.com",
    metrics: "120k Monthly Events · 99.99% Uptime",
  },
  {
    id: "proj-2",
    title: "Nexus E-Commerce Storefront & Payment Engine",
    description: "High-conversion headless storefront built with Next.js App Router, optimistic UI cart synchronization, instant product filtering, and Stripe webhook escrow.",
    cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    tags: ["React.js", "Express.js", "MongoDB", "Tailwind CSS", "Stripe"],
    liveUrl: "https://nexus-store.example.com",
    metrics: "42% Conversion Boost · 0.8s LCP",
  },
  {
    id: "proj-3",
    title: "Fintech Cross-Border Wallet Platform",
    description: "Multi-currency digital wallet application supporting automated bank settlements, KYC identity verification flows, and encrypted transaction audit logs.",
    cover: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    tags: ["Next.js", "TypeScript", "Node.js", "Docker", "Redis"],
    liveUrl: "https://fintech-wallet.example.com",
    metrics: "$4.5M Processed Volume · SOC2 Ready",
  },
  {
    id: "proj-4",
    title: "AI Knowledge Assistant & Semantic Search Engine",
    description: "RAG-powered conversational engine that indexes 10,000+ support document vectors, providing streaming generative citations and contextual answers.",
    cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    tags: ["React.js", "Python/Node", "OpenAI API", "MongoDB", "Tailwind"],
    liveUrl: "https://ai-knowledge.example.com",
    metrics: "Sub-200ms Vector Lookup · 94% Answer Accuracy",
  },
];

export default function FreelancerPortfolio() {
  const { showToast } = useToast();
  const [activeProject, setActiveProject] = useState(null);

  function handleViewProject(project) {
    setActiveProject(project);
  }

  function handleExternalDemo(url) {
    showToast(`Launching demo environment for ${activeProject?.title}...`, "info");
  }

  return (
    <section className="space-y-6">
      {/* Section Headline */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
            Proven Deliverables
          </span>
          <h2 className="font-headline text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Portfolio Showcase
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Recent enterprise web applications, SaaS dashboards, and full-stack solutions built and shipped by Alex Morgan.
          </p>
        </div>
      </div>

      {/* 4 Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PORTFOLIO_PROJECTS.map((project) => (
          <div
            key={project.id}
            className="group rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:border-violet-300 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              {/* Project Cover Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                <img
                  src={project.cover}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

                {/* In-Card Metrics Badge */}
                <span className="absolute bottom-3 left-3 rounded-xl bg-slate-900/90 border border-slate-700/60 px-3 py-1 text-[11px] font-mono text-emerald-400 backdrop-blur-md">
                  {project.metrics}
                </span>

                {/* Hover Quick Action */}
                <button
                  type="button"
                  onClick={() => handleViewProject(project)}
                  className="absolute top-3 right-3 flex items-center gap-1.5 rounded-xl bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-900 shadow-lg backdrop-blur-md opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition cursor-pointer hover:bg-violet-600 hover:text-white"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-3">
                <h3 className="font-headline text-lg font-bold text-slate-900 group-hover:text-violet-600 transition">
                  {project.title}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                  {project.description}
                </p>

                {/* Technology Badges */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 group-hover:bg-violet-50 group-hover:text-violet-700 transition"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Card Footer: View Project Button */}
            <div className="p-6 pt-0">
              <button
                type="button"
                onClick={() => handleViewProject(project)}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 hover:bg-violet-600 hover:text-white hover:border-violet-600 transition cursor-pointer"
              >
                <span>View Project Case Study</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Case Study Modal Preview */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-2.5 py-1 rounded-md">
                  Project Case Study
                </span>
                <h3 className="font-headline text-xl sm:text-2xl font-bold text-slate-900 mt-2">
                  {activeProject.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveProject(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Project Image */}
            <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
              <img
                src={activeProject.cover}
                alt={activeProject.title}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Detailed Description */}
            <div className="space-y-3 font-sans text-sm text-slate-600 leading-relaxed">
              <p>{activeProject.description}</p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <p className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-1">
                  Deliverable Impact
                </p>
                <p className="text-emerald-700 font-semibold">{activeProject.metrics}</p>
              </div>
            </div>

            {/* Technologies */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Tech Stack Architecture:
              </p>
              <div className="flex flex-wrap gap-2">
                {activeProject.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-lg bg-violet-50 border border-violet-100 px-3 py-1 text-xs font-semibold text-violet-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveProject(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleExternalDemo(activeProject.liveUrl)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-semibold shadow-md shadow-violet-500/20 hover:bg-violet-700 transition"
              >
                <span>Launch Live Preview</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
