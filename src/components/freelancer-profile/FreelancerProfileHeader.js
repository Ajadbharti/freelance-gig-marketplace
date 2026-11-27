"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock,
  Globe,
  MapPin,
  MessageSquare,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

export default function FreelancerProfileHeader({
  freelancer = {
    name: "Alex Morgan",
    title: "Full Stack Web Developer",
    location: "New York, USA",
    status: "Available for Work",
    memberSince: "March 2021",
    rating: 5.0,
    reviewsCount: 184,
    completedProjects: 142,
    responseTime: "1 Hour",
    level: "Top Rated Pro",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=320&q=80",
    initials: "AM",
    bio: "Passionate Full Stack Web Developer with 7+ years of experience building high-performance web applications, scalable SaaS architectures, and pixel-perfect responsive user interfaces. Specializing in modern JavaScript/TypeScript ecosystems including React, Next.js, Node.js, Express, and MongoDB under deterministic escrow milestone delivery.",
  },
}) {
  const { showToast } = useToast();

  function handleContact() {
    showToast(`Direct message opened with ${freelancer.name}!`, "info");
  }

  function handleShare() {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      showToast("Freelancer profile link copied to clipboard!", "success");
    }
  }

  return (
    <div className="relative rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 lg:p-10 shadow-xl shadow-slate-200/50 overflow-hidden">
      {/* Subtle background ambient banner glow */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-slate-100">
        
        {/* Left: Avatar & Primary Meta */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          
          {/* Large Profile Photo */}
          <div className="relative h-28 w-28 sm:h-32 sm:w-32 shrink-0">
            <img
              src={freelancer.avatar}
              alt={freelancer.name}
              className="h-full w-full rounded-3xl object-cover border-2 border-slate-100 shadow-md"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling?.classList.remove("hidden");
              }}
            />
            {/* Fallback initial gradient avatar */}
            <div className="hidden h-full w-full rounded-3xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-600 text-white font-headline text-3xl font-extrabold flex items-center justify-center shadow-md">
              {freelancer.initials}
            </div>

            {/* Online Status Dot */}
            <span
              className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white ring-4 ring-white shadow-sm"
              title="Online & Ready for New Projects"
            >
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>

          {/* Name, Title & Quick Metas */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
                {freelancer.name}
              </h1>
              <span className="rounded-lg bg-amber-50 px-2.5 py-0.5 font-sans text-xs font-bold text-amber-700 border border-amber-200/80 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>{freelancer.level}</span>
              </span>
            </div>

            <p className="font-sans text-base sm:text-lg font-semibold text-violet-700">
              {freelancer.title}
            </p>

            {/* Location & Status Chips */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 pt-0.5">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{freelancer.location}</span>
              </span>

              <span className="flex items-center gap-1.5 text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/70">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{freelancer.status}</span>
              </span>

              <span className="flex items-center gap-1.5 text-slate-500">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>Member since {freelancer.memberSince}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Action Buttons & Share */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={handleContact}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-sans text-sm font-semibold shadow-lg shadow-violet-500/25 hover:from-violet-700 hover:to-indigo-700 transition active:scale-[0.99] cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Contact Me</span>
          </button>

          <a
            href="#published-gigs"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-sans text-sm font-semibold hover:bg-slate-100 hover:border-slate-300 transition"
          >
            <Briefcase className="w-4 h-4 text-slate-500" />
            <span>View Gigs</span>
          </a>

          <button
            type="button"
            onClick={handleShare}
            aria-label="Share profile"
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-violet-600 hover:border-slate-300 transition cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Quantitative Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-6 border-b border-slate-100">
        {/* Rating */}
        <div className="space-y-0.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans">
            Rating &amp; Reviews
          </span>
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-headline text-lg font-bold text-slate-900">
              {freelancer.rating}
            </span>
            <span className="text-xs text-slate-500">
              ({freelancer.reviewsCount} reviews)
            </span>
          </div>
        </div>

        {/* Completed Projects */}
        <div className="space-y-0.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans">
            Completed Projects
          </span>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="font-headline text-lg font-bold text-slate-900">
              {freelancer.completedProjects}+
            </span>
            <span className="text-xs text-slate-500">delivered</span>
          </div>
        </div>

        {/* Response Time */}
        <div className="space-y-0.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans">
            Avg. Response Time
          </span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-violet-600" />
            <span className="font-headline text-lg font-bold text-slate-900">
              ⚡ {freelancer.responseTime}
            </span>
            <span className="text-xs text-slate-500">typical turnaround</span>
          </div>
        </div>

        {/* Security / Escrow Guarantee */}
        <div className="space-y-0.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans">
            Order Protection
          </span>
          <div className="flex items-center gap-1.5 text-emerald-600">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-headline text-lg font-bold text-slate-900">
              100% Escrow
            </span>
            <span className="text-xs text-slate-500">verified</span>
          </div>
        </div>
      </div>

      {/* Short Professional Bio */}
      <div className="pt-6 space-y-2">
        <h3 className="font-headline text-base font-bold text-slate-900">
          Professional Overview
        </h3>
        <p className="font-sans text-sm sm:text-base text-slate-600 leading-relaxed max-w-5xl">
          {freelancer.bio}
        </p>
      </div>
    </div>
  );
}
