"use client";

import Link from "next/link";
import { Clock, ExternalLink, Globe, MapPin, MessageSquare, ShieldCheck, Star, User } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

export default function OrderFreelancerCard({ freelancer, onContactClick }) {
  const { showToast } = useToast();

  return (
    <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-5">
      {/* Card Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="font-headline text-sm font-bold uppercase tracking-wider text-slate-400 font-sans">
          Assigned Specialist
        </h3>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Online</span>
        </span>
      </div>

      {/* Freelancer Header */}
      <div className="flex items-start gap-3.5">
        <div className="relative">
          <img
            src={freelancer.avatar}
            alt={freelancer.name}
            className="h-14 w-14 rounded-2xl object-cover border-2 border-violet-100 shadow-2xs"
          />
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white" />
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-1.5">
            <h4 className="font-headline text-base font-bold text-slate-900 truncate">
              {freelancer.name}
            </h4>
          </div>

          <p className="font-sans text-xs text-slate-500 leading-snug line-clamp-1">
            {freelancer.title}
          </p>

          <div className="flex items-center gap-1 text-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <strong className="font-bold text-slate-900">{freelancer.rating}</strong>
            <span className="text-slate-400 font-sans">({freelancer.reviewsCount} reviews)</span>
          </div>
        </div>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Response Time
          </span>
          <span className="font-semibold text-slate-800">{freelancer.responseTime}</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Orders Done
          </span>
          <span className="font-semibold text-slate-800">{freelancer.completedOrders}+ delivered</span>
        </div>
      </div>

      {/* Location & Member Info */}
      <div className="space-y-1.5 text-xs text-slate-500 border-t border-slate-100 pt-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{freelancer.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Member since {freelancer.memberSince}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <Link
          href={freelancer.profileUrl || "/freelancers/1"}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition cursor-pointer"
        >
          <User className="w-3.5 h-3.5" />
          <span>View Profile</span>
        </Link>

        <button
          type="button"
          onClick={onContactClick}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Contact</span>
        </button>
      </div>
    </div>
  );
}
