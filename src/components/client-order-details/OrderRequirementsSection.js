"use client";

import { useState } from "react";
import {
  Download,
  Edit3,
  ExternalLink,
  FileText,
  Link as LinkIcon,
  Paperclip,
  X,
} from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

export default function OrderRequirementsSection({ order }) {
  const { showToast } = useToast();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [desc, setDesc] = useState(order.requirements.description);

  const canEdit = order.requirements.canEdit || order.status === "In Progress" || order.status === "Pending";

  function handleSaveRequirements(e) {
    e.preventDefault();
    setEditModalOpen(false);
    showToast("Project requirements updated. The freelancer was notified.", "success");
  }

  function handleDownloadReference(name) {
    showToast(`Downloading reference file: ${name}`, "info");
  }

  return (
    <section className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-headline text-base sm:text-lg font-bold text-slate-900">
            Project Requirements
          </h3>
          <p className="font-sans text-xs text-slate-500 mt-0.5">
            Submitted on {order.requirements.submittedAt}
          </p>
        </div>

        {/* Edit Requirements action (conditional) */}
        {canEdit ? (
          <button
            type="button"
            onClick={() => setEditModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-violet-600" />
            <span>Edit Requirements</span>
          </button>
        ) : (
          <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
            Locked (Delivered)
          </span>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans">
          Brief &amp; Instructions
        </h4>
        <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans whitespace-pre-line">
          {desc}
        </div>
      </div>

      {/* Reference Links & Reference Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        
        {/* Reference Links */}
        <div className="space-y-2">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans">
            Reference Links ({order.requirements.referenceLinks?.length || 0})
          </h4>

          <div className="space-y-2">
            {order.requirements.referenceLinks?.map((ref) => (
              <a
                key={ref.url}
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50/30 transition text-xs group"
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <LinkIcon className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                  <span className="font-semibold text-slate-800 truncate">{ref.title}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-violet-600 shrink-0" />
              </a>
            ))}
          </div>
        </div>

        {/* Uploaded Reference Files */}
        <div className="space-y-2">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-sans">
            Attached Files ({order.requirements.referenceFiles?.length || 0})
          </h4>

          <div className="space-y-2">
            {order.requirements.referenceFiles?.map((file) => (
              <div
                key={file.name}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white text-xs"
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <Paperclip className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                  <span className="font-mono font-medium text-slate-800 truncate">{file.name}</span>
                  <span className="text-[10px] text-slate-400 font-sans shrink-0">({file.size})</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDownloadReference(file.name)}
                  className="text-slate-400 hover:text-violet-700 transition p-1"
                  title="Download File"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Edit Requirements Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-headline text-base font-bold text-slate-900">
                Update Project Requirements
              </h4>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRequirements} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Project Description &amp; Scope
                </label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={5}
                  className="w-full rounded-2xl border border-slate-200 p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-violet-600 focus:ring-4 focus:ring-violet-500/10"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}
