"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, ShieldAlert, X } from "lucide-react";

export default function UserDetailsModal({ user, open, onClose, onUpdateStatus, onDeleteUser }) {
  const [statusReason, setStatusReason] = useState("");
  const [targetStatus, setTargetStatus] = useState("suspended");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open || !user) return null;

  async function handleStatusChange() {
    setIsSubmitting(true);
    await onUpdateStatus(user._id || user.id, targetStatus, statusReason);
    setIsSubmitting(false);
    setStatusReason("");
  }

  async function handleDelete() {
    if (!window.confirm(`Are you certain you want to permanently delete user ${user.email}? This action cannot be reversed.`)) {
      return;
    }
    setIsSubmitting(true);
    await onDeleteUser(user._id || user.id, statusReason || "Administrative account deletion");
    setIsSubmitting(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-2xl border-2 border-[#0b1c30] bg-white p-6 shadow-[6px_6px_0px_#0b1c30] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#0b1c30] pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-[#005d42]" />
            <h2 className="font-headline text-lg font-bold uppercase text-[#0b1c30]">
              USER RECORD // {user.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="border border-[#0b1c30] p-1 text-[#0b1c30] hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* User Snapshot */}
        <div className="mt-4 grid grid-cols-2 gap-4 border border-[#e5e7eb] bg-[#eff4ff] p-4 font-mono text-xs">
          <div>
            <span className="text-[#6e7a73] uppercase">EMAIL</span>
            <p className="font-bold text-[#0b1c30] truncate">{user.email}</p>
          </div>
          <div>
            <span className="text-[#6e7a73] uppercase">SYSTEM ROLE</span>
            <p className="font-bold uppercase text-[#005d42]">{user.role}</p>
          </div>
          <div>
            <span className="text-[#6e7a73] uppercase">ACCOUNT STATUS</span>
            <p className={`font-bold uppercase ${user.status === "active" ? "text-emerald-700" : "text-red-700"}`}>
              {user.status || "active"}
            </p>
          </div>
          <div>
            <span className="text-[#6e7a73] uppercase">JOINED DATE</span>
            <p className="font-bold text-[#0b1c30]">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Recent"}
            </p>
          </div>
        </div>

        {user.suspensionReason && (
          <div className="mt-3 border-l-4 border-amber-500 bg-amber-50 p-3 font-mono text-xs text-amber-900">
            <span className="font-bold uppercase">FLAG / SUSPENSION REASON:</span> {user.suspensionReason}
          </div>
        )}

        {/* Moderation Controls */}
        <div className="mt-6 border-t border-[#0b1c30] pt-4">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#0b1c30]">
            MODERATION & ACCESS CONTROL
          </h3>

          <div className="mt-3 space-y-3 font-mono text-xs">
            <div>
              <label className="block text-[#6e7a73] uppercase">TARGET STATUS</label>
              <select
                value={targetStatus}
                onChange={(e) => setTargetStatus(e.target.value)}
                className="mt-1 w-full border border-[#0b1c30] bg-white p-2 text-xs font-bold uppercase focus:outline-none"
              >
                <option value="active">ACTIVE // RESTORE ACCESS</option>
                <option value="suspended">SUSPENDED // RESTRICT ACTIONS</option>
                <option value="blocked">BLOCKED // PERMANENT ACCESS PROHIBITION</option>
              </select>
            </div>

            <div>
              <label className="block text-[#6e7a73] uppercase">MODERATION REASON</label>
              <input
                type="text"
                placeholder="Specify violation or justification..."
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                className="mt-1 w-full border border-[#0b1c30] bg-white p-2 text-xs focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="button"
                onClick={handleStatusChange}
                disabled={isSubmitting}
                className="border border-[#0b1c30] bg-[#005d42] px-4 py-2 font-bold uppercase tracking-wider text-white hover:bg-[#065f46] shadow-[2px_2px_0px_#0b1c30] disabled:opacity-50"
              >
                APPLY STATUS TRANSITION
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="border border-[#ba1a1a] bg-white px-4 py-2 font-bold uppercase tracking-wider text-[#ba1a1a] hover:bg-red-50 shadow-[2px_2px_0px_#ba1a1a] disabled:opacity-50"
              >
                PERMANENTLY PURGE USER
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
