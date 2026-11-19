"use client";

import Link from "next/link";
import { MessageSquare, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useMarketplace } from "@/context/MarketplaceContext";
import SafeImage from "@/components/ui/SafeImage";

export default function Inbox() {
  const { user } = useAuth();
  const { orders } = useMarketplace();

  return (
    <div className="min-h-screen bg-[#f8f9ff] py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Protocol Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 font-mono text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="flex h-3.5 w-3.5 items-center justify-center bg-[#047857] text-[9px] text-white">■</span>
            <span className="font-bold text-slate-900 uppercase">
              COMMUNICATIONS HUB // CONTRACT THREADS
            </span>
          </div>
          <span className="text-[#047857] font-bold">SOCKET LIVE</span>
        </div>

        <div className="mt-6">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Contract Audit & Messages
          </h1>
          <p className="mt-1 font-mono text-xs text-slate-600">
            Real-time direct communication with clients and contractors, pinned to active milestone contracts.
          </p>
        </div>

        {/* Conversation Cards List */}
        <div className="mt-8 space-y-4">
          {orders.map((ord) => {
            const lastMsg =
              ord.messages && ord.messages.length > 0
                ? ord.messages[ord.messages.length - 1]
                : { text: "Contract initiated.", time: ord.dueText };

            return (
              <Link
                key={ord.id}
                href={`/orders/${ord.id}`}
                className="block border border-slate-200 bg-white p-5 shadow-sm transition hover:border-[#047857] hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <SafeImage
                      src={ord.freelancerAvatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80"}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="font-bold text-slate-950">{ord.freelancerName}</span>
                        <span className="text-slate-400">({ord.code || `#${ord.id}`})</span>
                        <span className="border border-emerald-300 bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-[#047857]">
                          {ord.statusLabel || "IN PROGRESS"}
                        </span>
                      </div>
                      <p className="font-sans text-xs font-semibold text-slate-800 mt-0.5">
                        {ord.title}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">{lastMsg.time || "Oct 20"}</span>
                </div>

                <div className="mt-3 border-t border-slate-100 pt-2.5 font-sans text-xs text-slate-600">
                  <span className="font-mono font-semibold text-slate-900">Latest Update: </span>
                  {lastMsg.text}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
