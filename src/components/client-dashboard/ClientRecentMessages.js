"use client";

import Link from "next/link";
import { MessageSquare, Send, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

const MESSAGES_DATA = [
  {
    id: "msg-1",
    freelancer: {
      name: "Elena Rostova",
      title: "Brand Identity Designer",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80",
      initials: "ER",
      online: true,
    },
    lastMessage: "I've uploaded the revised vector SVG files and the 3D presentation deck for your review!",
    timestamp: "12m ago",
    unread: true,
  },
  {
    id: "msg-2",
    freelancer: {
      name: "Alex Morgan",
      title: "Full Stack Web Developer",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
      initials: "AM",
      online: true,
    },
    lastMessage: "The Next.js 15 staging deployment is ready on Vercel. Would you like to review the auth flow?",
    timestamp: "1h ago",
    unread: true,
  },
  {
    id: "msg-3",
    freelancer: {
      name: "Marcus Vance",
      title: "AI Specialist",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
      initials: "MV",
      online: false,
    },
    lastMessage: "Thank you for approving the final milestone payment! Let me know if you need any follow-up tweaks.",
    timestamp: "Yesterday",
    unread: false,
  },
];

export default function ClientRecentMessages() {
  const { showToast } = useToast();

  function handleOpenChat(freelancerName) {
    showToast(`Opening direct conversation with ${freelancerName}...`, "info");
  }

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-headline text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Recent Messages
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Direct communication with active specialists working on your orders.
          </p>
        </div>

        <Link
          href="/messages"
          className="text-xs font-semibold text-violet-600 hover:text-violet-700 hover:underline transition"
        >
          View All Messages →
        </Link>
      </div>

      {/* Messages List Container */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-2 divide-y divide-slate-100 shadow-xs">
        {MESSAGES_DATA.map((msg) => (
          <div
            key={msg.id}
            className="p-4 rounded-2xl hover:bg-slate-50/70 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            {/* Left: Avatar & Message Details */}
            <div className="flex items-start gap-3.5 min-w-0 flex-1">
              <div className="relative h-11 w-11 shrink-0">
                <img
                  src={msg.freelancer.avatar}
                  alt={msg.freelancer.name}
                  className="h-full w-full rounded-full object-cover border border-slate-200"
                />
                {msg.freelancer.online && (
                  <span
                    className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white"
                    title="Online"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">
                    {msg.freelancer.name}
                  </h4>
                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    · {msg.freelancer.title}
                  </span>
                  {msg.unread && (
                    <span className="h-2 w-2 rounded-full bg-violet-600 shrink-0" />
                  )}
                </div>

                <p className="text-xs text-slate-600 line-clamp-1 leading-snug">
                  {msg.lastMessage}
                </p>
              </div>
            </div>

            {/* Right: Timestamp & Action */}
            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <span className="text-[11px] font-mono text-slate-400">
                {msg.timestamp}
              </span>

              <button
                type="button"
                onClick={() => handleOpenChat(msg.freelancer.name)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:text-violet-600 hover:border-violet-200 hover:bg-violet-50 transition cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Open Conversation</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
