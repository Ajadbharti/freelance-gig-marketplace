"use client";

import { useState } from "react";
import { CheckCheck, Clock, Filter, MessageSquare, Search } from "lucide-react";

export default function ConversationList({
  conversations = [],
  selectedId,
  onSelectConversation,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [tabFilter, setTabFilter] = useState("all"); // 'all' | 'unread' | 'active'

  const filteredConversations = conversations.filter((conv) => {
    // Search match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = conv.freelancer.name.toLowerCase().includes(q);
      const matchTitle = conv.freelancer.title.toLowerCase().includes(q);
      const matchGig = conv.order?.gigTitle.toLowerCase().includes(q);
      const lastMsg = conv.messages[conv.messages.length - 1]?.text.toLowerCase().includes(q);
      if (!matchName && !matchTitle && !matchGig && !lastMsg) return false;
    }

    // Tab filter
    if (tabFilter === "unread") {
      return conv.unreadCount > 0;
    }
    if (tabFilter === "active") {
      return conv.order?.status === "In Progress" || conv.order?.status === "Delivered";
    }

    return true;
  });

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/90 rounded-3xl lg:rounded-r-none overflow-hidden">
      
      {/* Top Search & Filter Bar */}
      <div className="p-4 border-b border-slate-100 space-y-3">
        {/* Search Input */}
        <div className="relative flex items-center rounded-2xl border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-violet-600 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all">
          <Search className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-transparent px-2.5 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mr-3 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setTabFilter("all")}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
              tabFilter === "all"
                ? "bg-violet-600 text-white shadow-2xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            All ({conversations.length})
          </button>

          <button
            type="button"
            onClick={() => setTabFilter("unread")}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
              tabFilter === "unread"
                ? "bg-violet-600 text-white shadow-2xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            <span>Unread</span>
            {conversations.filter((c) => c.unreadCount > 0).length > 0 && (
              <span className="h-4 w-4 rounded-full bg-rose-500 text-white text-[10px] font-mono font-bold flex items-center justify-center">
                {conversations.filter((c) => c.unreadCount > 0).length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setTabFilter("active")}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
              tabFilter === "active"
                ? "bg-violet-600 text-white shadow-2xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            Active Orders
          </button>
        </div>
      </div>

      {/* Conversations Scrollable List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conv) => {
            const isSelected = conv.id === selectedId;
            const lastMsg = conv.messages[conv.messages.length - 1];

            return (
              <div
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`p-4 flex items-start gap-3 cursor-pointer transition-all border-l-4 ${
                  isSelected
                    ? "bg-violet-50/80 border-violet-600"
                    : "border-transparent hover:bg-slate-50/80"
                }`}
              >
                {/* Avatar with Online indicator */}
                <div className="relative shrink-0">
                  <img
                    src={conv.freelancer.avatar}
                    alt={conv.freelancer.name}
                    className="h-11 w-11 rounded-2xl object-cover border border-slate-200"
                  />
                  {conv.freelancer.online ? (
                    <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
                  ) : (
                    <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-slate-300 ring-2 ring-white" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-sans text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {conv.freelancer.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {lastMsg?.time || "Active"}
                    </span>
                  </div>

                  <p className="text-[11px] font-mono text-slate-400 truncate">
                    {conv.freelancer.title}
                  </p>

                  <div className="flex items-center justify-between gap-2 pt-0.5">
                    <p className="text-xs text-slate-500 truncate leading-snug">
                      {lastMsg ? (
                        <>
                          {lastMsg.sender === "client" && (
                            <span className="font-semibold text-slate-700">You: </span>
                          )}
                          {lastMsg.text}
                        </>
                      ) : (
                        "No messages yet"
                      )}
                    </p>

                    {conv.unreadCount > 0 && (
                      <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-violet-600 text-white text-[10px] font-mono font-bold flex items-center justify-center shrink-0 shadow-xs">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-xs text-slate-400 space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
            <p>No conversations found</p>
          </div>
        )}
      </div>

    </div>
  );
}
