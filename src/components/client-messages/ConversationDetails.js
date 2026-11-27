"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileCode,
  FileText,
  FolderArchive,
  MapPin,
  Package,
  ShieldCheck,
  Star,
  User,
  X,
} from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

export default function ConversationDetails({
  conversation,
  onClose,
}) {
  const { showToast } = useToast();

  const freelancer = conversation.freelancer;
  const order = conversation.order;
  const sharedFiles = conversation.sharedFiles || [];

  function handleDownloadFile(fileName) {
    showToast(`Downloading ${fileName}...`, "success");
  }

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200/90 rounded-3xl lg:rounded-l-none overflow-hidden">
      
      {/* Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100">
        <h3 className="font-headline text-sm font-bold uppercase tracking-wider text-slate-400 font-sans">
          Conversation Details
        </h3>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Close details"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        
        {/* 1. Freelancer Profile Summary */}
        <div className="text-center space-y-3 pb-5 border-b border-slate-100">
          <div className="relative mx-auto inline-block">
            <img
              src={freelancer.avatar}
              alt={freelancer.name}
              className="h-20 w-20 rounded-3xl object-cover border-2 border-violet-100 shadow-sm"
            />
            {freelancer.online && (
              <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-white" />
            )}
          </div>

          <div>
            <h4 className="font-headline text-base font-bold text-slate-900">
              {freelancer.name}
            </h4>
            <p className="font-sans text-xs text-slate-500 leading-snug">
              {freelancer.title}
            </p>
          </div>

          <div className="flex items-center justify-center gap-1 text-xs">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <strong className="font-bold text-slate-900">{freelancer.rating}</strong>
            <span className="text-slate-400 font-sans">({freelancer.reviewsCount} reviews)</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold uppercase text-slate-400 block font-sans">
                Turnaround
              </span>
              <span className="font-semibold text-slate-800">{freelancer.responseTime}</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold uppercase text-slate-400 block font-sans">
                Delivered
              </span>
              <span className="font-semibold text-slate-800">{freelancer.completedOrders}+ orders</span>
            </div>
          </div>

          <Link
            href={freelancer.profileUrl || "/freelancers/1"}
            className="inline-flex items-center justify-center gap-1.5 w-full px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
          >
            <User className="w-3.5 h-3.5" />
            <span>View Full Profile</span>
          </Link>
        </div>

        {/* 2. Related Order Information */}
        {order && (
          <div className="space-y-3 pb-5 border-b border-slate-100">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans">
              Linked Order
            </h4>

            <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/60 space-y-3">
              <div className="flex items-start gap-3">
                <img
                  src={order.gigCover}
                  alt={order.gigTitle}
                  className="h-12 w-12 rounded-xl object-cover shrink-0 border border-slate-200"
                />
                <div className="min-w-0">
                  <span className="font-mono text-[10px] font-bold text-violet-700 bg-violet-100/70 px-2 py-0.5 rounded-md">
                    #{order.id}
                  </span>
                  <p className="font-sans text-xs font-bold text-slate-900 truncate mt-1">
                    {order.gigTitle}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {order.package} · <strong className="text-slate-900">${order.amount} USD</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/70">
                <span className="text-slate-500">Status:</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 text-[11px]">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{order.status}</span>
                </span>
              </div>

              <Link
                href={order.link || `/orders/${order.id}`}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold shadow-xs transition"
              >
                <span>View Order Details</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* 3. Shared Files Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans">
              Shared Files ({sharedFiles.length})
            </h4>
          </div>

          {sharedFiles.length > 0 ? (
            <div className="space-y-2">
              {sharedFiles.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white hover:border-violet-200 text-xs transition"
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <FileText className="w-4 h-4 text-violet-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-mono text-xs font-medium text-slate-800 truncate">
                        {file.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {file.size} · {file.date}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownloadFile(file.name)}
                    className="p-1 rounded-lg text-slate-400 hover:text-violet-700 hover:bg-violet-50 transition shrink-0"
                    title={`Download ${file.name}`}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No files shared in this chat yet.</p>
          )}
        </div>

      </div>

    </div>
  );
}
