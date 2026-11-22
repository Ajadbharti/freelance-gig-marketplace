"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const POLL_MS = 30000;

function formatDateTime(iso) {
  return new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

export default function NotificationBell() {
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const [listRes, countRes] = await Promise.all([
        supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(15),
        supabase.from("notifications").select("id", { count: "exact", head: true }).eq("is_read", false),
      ]);
      if (cancelled) return;
      setItems(listRes.data ?? []);
      setUnread(countRes.count ?? 0);
    }

    load().catch(() => {});
    const timer = setInterval(() => {
      load().catch(() => {});
    }, POLL_MS);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [userId, reloadKey]);

  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    function handleKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  async function markRead(ids) {
    await createClient().rpc("mark_notifications_read", { p_ids: ids });
    setReloadKey((key) => key + 1);
  }

  function openItem(item) {
    if (!item.is_read) markRead([item.id]);
    setOpen(false);
    router.push(item.link);
  }

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}
        className="relative p-2 text-[#0b1c30] transition hover:bg-[#eff4ff]"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center bg-[#ba1a1a] px-1 font-mono text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-80 max-w-[90vw] overflow-hidden border border-[#0b1c30] bg-white shadow-[4px_4px_0px_#0b1c30]"
        >
          <div className="flex items-center justify-between border-b border-[#e5e7eb] px-4 py-3 bg-[#eff4ff]">
            <p className="font-headline text-sm font-bold uppercase tracking-wide text-[#0b1c30]">Notifications</p>
            {unread > 0 && (
              <button
                type="button"
                onClick={() => markRead(null)}
                className="font-mono text-xs font-bold uppercase text-[#005d42] hover:text-[#047857]"
              >
                Mark all read
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <p className="px-4 py-10 text-center font-mono text-xs text-[#3e4943]">You have no notifications yet.</p>
          ) : (
            <ul className="max-h-96 overflow-y-auto divide-y divide-[#e5e7eb]">
              {items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => openItem(item)}
                    className={cn(
                      "block w-full px-4 py-3 text-left transition hover:bg-[#eff4ff]",
                      !item.is_read && "bg-[#eff4ff]/60"
                    )}
                  >
                    <p className="flex items-center gap-2 text-xs font-bold text-[#0b1c30]">
                      {!item.is_read && <span className="h-2 w-2 shrink-0 bg-[#005d42]" aria-hidden="true" />}
                      <span className="line-clamp-1">{item.title}</span>
                    </p>
                    {item.body && <p className="mt-0.5 line-clamp-2 text-xs text-[#3e4943]">{item.body}</p>}
                    <p className="mt-1 font-mono text-[10px] text-slate-500">{formatDateTime(item.created_at)}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}