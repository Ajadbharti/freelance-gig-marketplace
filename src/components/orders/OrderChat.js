"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useToast } from "@/components/ui/ToastProvider";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const POLL_MS = 6000;

function formatTime(iso) {
  return new Date(iso).toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" });
}

export default function OrderChat({ orderId, closed = false }) {
  const { user } = useAuth();
  const { getProfile } = useMarketplace();
  const { showToast } = useToast();

  const [messages, setMessages] = useState(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const listRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data } = await createClient()
        .from("messages")
        .select("*")
        .eq("order_id", orderId)
        .order("created_at", { ascending: true })
        .limit(300);
      if (!cancelled) setMessages(data ?? []);
    }

    load().catch(() => {
      if (!cancelled) setMessages([]);
    });
    const timer = setInterval(() => {
      load().catch(() => {});
    }, POLL_MS);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [orderId, reloadKey]);

  const count = messages ? messages.length : 0;
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [count]);

  async function handleSend(event) {
    event.preventDefault();
    const body = text.trim();
    if (!body || sending) return;

    setSending(true);
    const { error } = await createClient().rpc("send_message", { p_order: orderId, p_body: body });
    setSending(false);

    if (error) {
      showToast(error.message || "Could not send the message.", "error");
      return;
    }
    setText("");
    setReloadKey((key) => key + 1);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend(event);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div ref={listRef} className="max-h-80 min-h-40 space-y-3 overflow-y-auto bg-slate-50 p-4" aria-live="polite">
        {messages === null ? (
          <p className="text-sm text-slate-500">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">
            No messages yet. Say hello and share any details about the work.
          </p>
        ) : (
          messages.map((message) => {
            const mine = message.sender_id === user?.id;
            return (
              <div key={message.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2 text-sm",
                    mine ? "bg-indigo-600 text-white" : "border border-slate-200 bg-white text-slate-800"
                  )}
                >
                  <p className={cn("text-xs font-semibold", mine ? "text-indigo-100" : "text-slate-500")}>
                    {mine ? "You" : (getProfile(message.sender_id)?.name ?? "User")}
                  </p>
                  <p className="mt-0.5 whitespace-pre-line break-words">{message.body}</p>
                  <p className={cn("mt-1 text-[11px]", mine ? "text-indigo-200" : "text-slate-400")}>
                    {formatTime(message.created_at)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {closed ? (
        <p className="border-t border-slate-200 p-4 text-center text-sm text-slate-500">
          Chat is closed because this order was cancelled.
        </p>
      ) : (
        <form onSubmit={handleSend} className="flex items-end gap-2 border-t border-slate-200 p-3">
          <label htmlFor="chat-message" className="sr-only">
            Message
          </label>
          <textarea
            id="chat-message"
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={1000}
            placeholder="Write a message (Enter to send, Shift + Enter for a new line)"
            className="min-w-0 flex-1 resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
          <button
            type="submit"
            disabled={sending || text.trim().length === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
          >
            <Send className="h-4 w-4" /> {sending ? "Sending..." : "Send"}
          </button>
        </form>
      )}
    </div>
  );
}
