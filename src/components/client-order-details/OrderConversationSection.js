"use client";

import { useState } from "react";
import { ArrowUpRight, Download, FileText, MessageSquare, Paperclip, Send, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

export default function OrderConversationSection({ order, conversation = [], onSendMessage }) {
  const { showToast } = useToast();
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState(conversation);

  function handleSend(e) {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      id: `m-${Date.now()}`,
      sender: "client",
      senderName: "John Doe (You)",
      avatar: null,
      initials: "JD",
      text: inputText.trim(),
      time: "Just now",
      attachments: [],
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
    showToast("Message sent to freelancer", "success");

    if (onSendMessage) {
      onSendMessage(newMsg);
    }
  }

  function handleAttachFile() {
    showToast("Attachment dialog opened (Mock). Select reference files or screenshots.", "info");
  }

  return (
    <section id="order-conversation" className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600 border border-violet-100">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-headline text-base sm:text-lg font-bold text-slate-900">
              Order Conversation
            </h3>
            <p className="font-sans text-xs text-slate-500">
              Direct milestone communications with {order.freelancer.name}
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 font-semibold">
          Encrypted &amp; Audited
        </span>
      </div>

      {/* Message History Thread */}
      <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2">
        {messages.map((msg) => {
          const isMe = msg.sender === "client";

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isMe ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              {isMe ? (
                <div className="h-8 w-8 shrink-0 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
                  {msg.initials || "JD"}
                </div>
              ) : (
                <img
                  src={msg.avatar || order.freelancer.avatar}
                  alt={msg.senderName}
                  className="h-8 w-8 shrink-0 rounded-xl object-cover border border-slate-200"
                />
              )}

              {/* Message Bubble */}
              <div className={`max-w-[80%] sm:max-w-[70%] space-y-1 ${isMe ? "items-end text-right" : "items-start text-left"}`}>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-sans">
                  <span className="font-semibold text-slate-700">{msg.senderName}</span>
                  <span>·</span>
                  <span>{msg.time}</span>
                </div>

                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isMe
                      ? "bg-violet-600 text-white rounded-tr-xs"
                      : "bg-slate-100/90 text-slate-800 rounded-tl-xs border border-slate-200/60"
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Message Attachments (if any) */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-white/20 space-y-1.5">
                      {msg.attachments.map((att) => (
                        <div
                          key={att.name}
                          className="flex items-center justify-between p-2 rounded-xl bg-white/10 text-xs backdrop-blur-xs"
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <FileText className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{att.name}</span>
                          </div>
                          <span className="text-[10px] opacity-80 shrink-0 pl-2">({att.size})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Message Composer */}
      <form onSubmit={handleSend} className="pt-2 border-t border-slate-100">
        <div className="relative rounded-2xl border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-violet-600 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            placeholder={`Reply to ${order.freelancer.name}... (Press Enter to send)`}
            rows={2}
            className="w-full bg-transparent p-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none resize-none"
          />

          <div className="flex items-center justify-between p-2 border-t border-slate-200/60 bg-white/50 rounded-b-2xl">
            <button
              type="button"
              onClick={handleAttachFile}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-xs font-semibold transition cursor-pointer"
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span>Attach File</span>
            </button>

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-xs transition disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <span>Send</span>
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
      </form>

    </section>
  );
}
