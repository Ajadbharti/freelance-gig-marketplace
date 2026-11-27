"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCheck,
  Download,
  ExternalLink,
  FileCode,
  FileText,
  FolderArchive,
  Info,
  Maximize2,
  Paperclip,
  Send,
  Smile,
  Sparkles,
  Video,
} from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

export default function ChatWindow({
  conversation,
  onSendMessage,
  onBackToList,
  onToggleDetails,
  detailsOpen,
}) {
  const { showToast } = useToast();
  const [inputText, setInputText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);

  const quickEmojis = ["👍", "🚀", "🎉", "✨", "🙌", "❤️", "😊", "🔥"];

  const freelancer = conversation.freelancer;
  const order = conversation.order;

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation.messages]);

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
      date: "Today",
      read: true,
      delivered: true,
      attachments: [],
    };

    onSendMessage(conversation.id, newMsg);
    setInputText("");
    setShowEmojiPicker(false);
  }

  function handleAttachFile() {
    showToast("File attachment dialog opened. Select deliverables, screenshots, or briefs.", "info");
  }

  function handleDownloadAttachment(filename) {
    showToast(`Downloading ${filename}...`, "success");
  }

  function getFileIcon(type) {
    switch (type) {
      case "zip":
        return <FolderArchive className="w-5 h-5 text-amber-600" />;
      case "pdf":
        return <FileText className="w-5 h-5 text-rose-600" />;
      case "code":
        return <FileCode className="w-5 h-5 text-violet-600" />;
      case "video":
        return <Video className="w-5 h-5 text-indigo-600" />;
      default:
        return <FileText className="w-5 h-5 text-slate-500" />;
    }
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl lg:rounded-none overflow-hidden relative">
      
      {/* 1. Chat Header */}
      <div className="h-20 px-4 sm:px-6 flex items-center justify-between border-b border-slate-100 bg-white z-10">
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile Back to List Button */}
          <button
            type="button"
            onClick={onBackToList}
            className="lg:hidden p-2 -ml-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Back to conversations"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Freelancer Avatar & Status */}
          <div className="relative shrink-0">
            <img
              src={freelancer.avatar}
              alt={freelancer.name}
              className="h-11 w-11 rounded-2xl object-cover border border-slate-200"
            />
            {freelancer.online ? (
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
            ) : (
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-slate-300 ring-2 ring-white" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-headline text-sm sm:text-base font-bold text-slate-900 truncate">
                {freelancer.name}
              </h3>
              {order && (
                <Link
                  href={order.link || `/orders/${order.id}`}
                  className="hidden sm:inline-flex items-center gap-1 rounded-full bg-violet-50 border border-violet-100 px-2 py-0.5 text-[10px] font-mono font-bold text-violet-700 hover:bg-violet-100 transition"
                >
                  <span>#{order.id}</span>
                  <span>·</span>
                  <span>{order.status}</span>
                </Link>
              )}
            </div>
            <p className="font-sans text-[11px] text-slate-400 truncate">
              {freelancer.online ? "Online · Typically replies in 1h" : freelancer.lastSeen}
            </p>
          </div>
        </div>

        {/* Right Actions: View Profile & Toggle Details */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={freelancer.profileUrl || "/freelancers/1"}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
          >
            <span>View Profile</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <button
            type="button"
            onClick={onToggleDetails}
            className={`p-2 rounded-xl transition cursor-pointer ${
              detailsOpen
                ? "bg-violet-100 text-violet-700"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
            title="Toggle Details Panel"
            aria-label="Toggle Details Panel"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Messages Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-50/40">
        
        {/* Related Order Banner Pill */}
        {order && (
          <div className="mx-auto max-w-md p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-center space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-sans">
              Linked Contract
            </span>
            <p className="font-sans text-xs font-bold text-slate-900 truncate">
              {order.gigTitle}
            </p>
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 font-mono">
              <span className="text-violet-700 font-bold">#{order.id}</span>
              <span>·</span>
              <span>{order.package}</span>
              <span>·</span>
              <span className="text-emerald-700 font-bold">${order.amount} USD</span>
            </div>
          </div>
        )}

        {/* Message Stream */}
        {conversation.messages.map((msg, idx) => {
          const isMe = msg.sender === "client";
          const prevMsg = conversation.messages[idx - 1];
          const showDateSep = !prevMsg || prevMsg.date !== msg.date;

          return (
            <div key={msg.id} className="space-y-4">
              {/* Date Separator */}
              {showDateSep && (
                <div className="flex items-center justify-center my-3">
                  <span className="rounded-full bg-slate-200/70 px-3 py-1 text-[10px] font-mono font-bold uppercase text-slate-600">
                    {msg.date}
                  </span>
                </div>
              )}

              {/* Message Item */}
              <div
                className={`flex items-end gap-2.5 ${isMe ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                {isMe ? (
                  <div className="h-7 w-7 shrink-0 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shadow-2xs">
                    JD
                  </div>
                ) : (
                  <img
                    src={freelancer.avatar}
                    alt={freelancer.name}
                    className="h-7 w-7 shrink-0 rounded-xl object-cover border border-slate-200"
                  />
                )}

                {/* Bubble Container */}
                <div
                  className={`max-w-[85%] sm:max-w-[70%] space-y-1 ${
                    isMe ? "items-end text-right" : "items-start text-left"
                  }`}
                >
                  <div
                    className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isMe
                        ? "bg-violet-600 text-white rounded-br-xs"
                        : "bg-white text-slate-900 rounded-bl-xs border border-slate-200/80"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Shared File Attachments */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-200/40 space-y-2">
                        {msg.attachments.map((att) => (
                          <div
                            key={att.name}
                            className={`flex items-center justify-between p-3 rounded-2xl text-xs ${
                              isMe ? "bg-white/15 text-white" : "bg-slate-50 border border-slate-200 text-slate-900"
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate pr-2">
                              {getFileIcon(att.type)}
                              <div className="min-w-0 text-left">
                                <p className="font-mono font-bold truncate text-xs">{att.name}</p>
                                <p className={`text-[10px] ${isMe ? "opacity-80" : "text-slate-400"}`}>
                                  {att.size} · {att.format}
                                </p>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDownloadAttachment(att.name)}
                              className={`p-1.5 rounded-lg transition shrink-0 ${
                                isMe ? "hover:bg-white/20 text-white" : "hover:bg-slate-200 text-slate-600"
                              }`}
                              title="Download Attachment"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Timestamp & Read Indicator */}
                  <div className={`flex items-center gap-1.5 text-[10px] text-slate-400 font-mono px-1 ${isMe ? "justify-end" : "justify-start"}`}>
                    <span>{msg.time}</span>
                    {isMe && (
                      <CheckCheck className={`w-3.5 h-3.5 ${msg.read ? "text-violet-600" : "text-slate-300"}`} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Message Input Composer */}
      <div className="p-3 sm:p-4 border-t border-slate-100 bg-white relative">
        
        {/* Quick Emoji Picker Popover */}
        {showEmojiPicker && (
          <div className="absolute bottom-20 left-4 z-20 flex items-center gap-1.5 p-2 rounded-2xl bg-white border border-slate-200 shadow-xl animate-in fade-in duration-150">
            {quickEmojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  setInputText((prev) => prev + emoji);
                  setShowEmojiPicker(false);
                }}
                className="h-8 w-8 rounded-xl hover:bg-slate-100 text-base flex items-center justify-center transition cursor-pointer"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSend} className="space-y-2">
          <div className="relative flex items-center rounded-2xl border border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-violet-600 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all">
            
            {/* Attachment Button */}
            <button
              type="button"
              onClick={handleAttachFile}
              className="p-2.5 text-slate-400 hover:text-slate-700 transition cursor-pointer ml-1"
              title="Attach File"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Emoji Button */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker((prev) => !prev)}
              className="p-2.5 text-slate-400 hover:text-slate-700 transition cursor-pointer -ml-1"
              title="Add Emoji"
            >
              <Smile className="w-4 h-4" />
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${freelancer.name}... (Press Enter to send)`}
              className="w-full bg-transparent px-3 py-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="mr-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-xs transition disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <span className="hidden sm:inline">Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>

          </div>
        </form>

      </div>

    </div>
  );
}
