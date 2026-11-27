"use client";

import Link from "next/link";
import { CheckCircle2, Clock, Globe, MapPin, MessageSquare, ShieldCheck, Star, User, Users } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

export default function GigFreelancerProfile({
  freelancer = {
    name: "Elena Rostova",
    title: "Senior Brand Identity Designer & Art Director",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=240&q=80",
    initials: "ER",
    location: "London, United Kingdom",
    memberSince: "May 2021",
    avgResponseTime: "1 Hour",
    rating: 4.9,
    reviewsCount: 284,
    completedOrders: "340+",
    onTimeDelivery: "99%",
    bio: "Hello! I'm Elena, an award-winning brand identity designer with 8+ years of agency experience helping over 300 international brands, startups, and tech founders stand out with clean, modern, and memorable logos. I believe great design isn't just aesthetic—it solves business problems and builds immediate trust.",
  },
}) {
  const { showToast } = useToast();

  function handleContact() {
    showToast(`Opening direct conversation with ${freelancer.name}...`, "info");
  }

  return (
    <section className="space-y-6 py-6 border-t border-slate-200">
      <h2 className="font-headline text-2xl font-bold tracking-tight text-slate-900">
        About the Freelancer
      </h2>

      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        {/* Top Freelancer Bio Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative h-20 w-20 shrink-0">
              <img
                src={freelancer.avatar}
                alt={freelancer.name}
                className="h-full w-full rounded-2xl object-cover border border-slate-200 shadow-xs"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove("hidden");
                }}
              />
              <div className="hidden h-full w-full rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-bold text-xl flex items-center justify-center">
                {freelancer.initials}
              </div>
              <span
                className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white"
                title="Online Now"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Name, Title & Rating */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-headline text-xl font-bold text-slate-900">
                  {freelancer.name}
                </h3>
                <span className="rounded-md bg-amber-50 px-2 py-0.5 font-sans text-xs font-bold text-amber-700 border border-amber-200/70">
                  Top Rated Pro
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500">
                {freelancer.title}
              </p>
              <div className="flex items-center gap-1.5 pt-0.5 text-xs">
                <div className="flex text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <span className="font-bold text-slate-900">{freelancer.rating}</span>
                <span className="text-slate-500">({freelancer.reviewsCount} reviews)</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleContact}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white font-sans text-xs sm:text-sm font-semibold shadow-md shadow-violet-500/20 hover:bg-violet-700 transition cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contact Me</span>
            </button>

            <Link
              href="/explore"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-sans text-xs sm:text-sm font-semibold hover:bg-slate-100 hover:border-slate-300 transition"
            >
              <User className="w-4 h-4 text-slate-500" />
              <span>View Profile</span>
            </Link>
          </div>
        </div>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/60 text-xs sm:text-sm">
          <div>
            <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
              Location
            </span>
            <p className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{freelancer.location}</span>
            </p>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
              Member Since
            </span>
            <p className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>{freelancer.memberSince}</span>
            </p>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
              Avg. Response Time
            </span>
            <p className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-violet-600" />
              <span>{freelancer.avgResponseTime}</span>
            </p>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px] uppercase tracking-wider font-semibold">
              Orders Completed
            </span>
            <p className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{freelancer.completedOrders} orders</span>
            </p>
          </div>
        </div>

        {/* Bio Text */}
        <div className="space-y-2">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
            {freelancer.bio}
          </p>
        </div>
      </div>
    </section>
  );
}
