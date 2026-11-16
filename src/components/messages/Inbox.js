"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useMarketplace } from "@/context/MarketplaceContext";
import { createClient } from "@/lib/supabase/client";
import LoadingSkeleton from "@/components/ui/LoadingSkeleton";
import SafeImage from "@/components/ui/SafeImage";
import StatusBadge from "@/components/ui/StatusBadge";

const POLL_MS = 10000;

function formatDateTime(iso) {
  return new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

export default function Inbox() {
  const { user, hydrated } = useAuth();
  const { orders, getOrderGig, getProfile, hydrated: dataReady } = useMarketplace();
  const [rows, setRows] = useState(null);
  const userId = user?.id ?? null;

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    async function load() {
      const { data } = await createClient()
        .from("messages")
        .select("order_id, sender_id, body, created_at")
        .order("created_at", { ascending: false })
        .limit(500);
      if (!cancelled) setRows(data ?? []);
    }

    load().catch(() => {
      if (!cancelled) setRows([]);
    });
    const timer = setInterval(() => {
      load().catch(() => {});
    }, POLL_MS);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [userId]);

  if (!hydrated || !dataReady) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-10" role="status" aria-label="Loading messages">
        <LoadingSkeleton className="h-9 w-1/3" />
        <LoadingSkeleton className="h-24 w-full" />
        <LoadingSkeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Please log in</h1>
        <p className="mt-2 text-slate-600">Log in to see your conversations.</p>
        <Link
          href={`/login?next=${encodeURIComponent("/messages")}`}
          className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Go to login
        </Link>
      </div>
    );
  }

  if (user.role === "admin") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-slate-900">No inbox for admins</h1>
        <p className="mt-2 text-slate-600">Conversations are private between a client and a freelancer.</p>
        <Link
          href="/admin"
          className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Back to admin panel
        </Link>
      </div>
    );
  }

  // Har order ka sabse naya message
  const latestByOrder = new Map();
  (rows ?? []).forEach((row) => {
    if (!latestByOrder.has(row.order_id)) latestByOrder.set(row.order_id, row);
  });

  const conversations = orders
    .filter((order) => latestByOrder.has(order.id))
    .map((order) => ({ order, last: latestByOrder.get(order.id) }))
    .sort((a, b) => new Date(b.last.created_at) - new Date(a.last.created_at));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Messages</h1>
      <p className="mt-1 text-slate-600">Your conversations with clients and freelancers, by order.</p>

      {rows === null ? (
        <div className="mt-8 space-y-4" role="status" aria-label="Loading conversations">
          <LoadingSkeleton className="h-24 w-full" />
          <LoadingSkeleton className="h-24 w-full" />
        </div>
      ) : conversations.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <MessageSquare className="h-12 w-12 text-slate-300" />
          <p className="mt-4 font-semibold text-slate-900">No conversations yet</p>
          <p className="mt-1 max-w-sm text-sm text-slate-600">
            Open any order and use the Messages section to start a conversation. It will show up here.
          </p>
          <Link
            href={user.role === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client"}
            className="mt-5 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Go to my orders
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {conversations.map(({ order, last }) => {
            const otherId = user.id === order.clientId ? order.freelancerId : order.clientId;
            const other = getProfile(otherId);
            const gig = getOrderGig(order);
            const mine = last.sender_id === user.id;
            return (
              <li key={order.id}>
                <Link
                  href={`/orders/${order.id}`}
                  className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
                >
                  <SafeImage src={other?.avatar} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="truncate font-semibold text-slate-900">{other?.name ?? "Unknown user"}</p>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="truncate text-xs text-slate-500">{gig?.title ?? "This gig is no longer available"}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-700">
                      {mine && <span className="font-medium text-slate-500">You: </span>}
                      {last.body}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">{formatDateTime(last.created_at)}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}