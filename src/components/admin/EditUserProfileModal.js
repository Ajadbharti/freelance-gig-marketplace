"use client";

import { useState } from "react";
import { CheckCircle2, ShieldAlert, User, X } from "lucide-react";

export default function EditUserProfileModal({ user, onClose, onSave }) {
  const [name, setName] = useState(user?.name || "");
  const [title, setTitle] = useState(user?.title || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [skills, setSkills] = useState(
    Array.isArray(user?.skills) ? user.skills.join(", ") : user?.skills || ""
  );
  const [hourlyRate, setHourlyRate] = useState(user?.hourlyRate || 0);
  const [isVerified, setIsVerified] = useState(Boolean(user?.isVerified));
  const [status, setStatus] = useState(user?.status || "active");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const parsedSkills = skills
        ? skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      await onSave(user._id || user.id, {
        name,
        title,
        bio,
        skills: parsedSkills,
        hourlyRate: Number(hourlyRate),
        isVerified,
        status,
        reason: reason || "Profile updated by Super Administrator",
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl border-2 border-[#0b1c30] bg-white p-6 shadow-[6px_6px_0px_#0b1c30] sm:p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-[#0b1c30] pb-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-[#005d42]">
              <span className="h-2 w-2 bg-[#005d42]" />
              <span>SUPER ADMIN PROFILE MODERATION</span>
            </div>
            <h2 className="mt-1 font-headline text-2xl font-bold uppercase text-[#0b1c30]">
              Edit Profile: {user.name}
            </h2>
            <p className="font-mono text-xs text-[#6e7a73]">{user.email} // Role: {user.role?.toUpperCase()}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center border border-[#0b1c30] text-[#0b1c30] hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 font-mono text-xs">
          <div>
            <label className="block font-bold uppercase tracking-wider text-[#0b1c30] mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-[#0b1c30] px-3 py-2 text-xs text-[#0b1c30] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase tracking-wider text-[#0b1c30] mb-1">
                Professional Title / Headline
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Architecture Engineer"
                className="w-full border border-[#0b1c30] px-3 py-2 text-xs text-[#0b1c30] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[#0b1c30] mb-1">
                Hourly Rate (₹)
              </label>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="w-full border border-[#0b1c30] px-3 py-2 text-xs text-[#0b1c30] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-[#0b1c30] mb-1">
              Professional Biography
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Detailed contract background and credentials..."
              className="w-full border border-[#0b1c30] px-3 py-2 text-xs text-[#0b1c30] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-[#0b1c30] mb-1">
              Skills (comma separated)
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="Next.js, Smart Contracts, Figma UI, REST APIs"
              className="w-full border border-[#0b1c30] px-3 py-2 text-xs text-[#0b1c30] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#e5e7eb] pt-4">
            <div>
              <label className="block font-bold uppercase tracking-wider text-[#0b1c30] mb-1">
                Account Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-[#0b1c30] bg-white px-3 py-2 text-xs font-bold uppercase text-[#0b1c30] focus:outline-none"
              >
                <option value="active">Active (Full Platform Access)</option>
                <option value="suspended">Suspended (Restricted)</option>
                <option value="blocked">Blocked (Terminated)</option>
              </select>
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-[#0b1c30]">
                <input
                  type="checkbox"
                  checked={isVerified}
                  onChange={(e) => setIsVerified(e.target.checked)}
                  className="h-4 w-4 rounded-none accent-[#005d42]"
                />
                <span>Verified Badging Authorized</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-[#0b1c30] mb-1">
              Audit Modification Reason (Mandatory for Ledger)
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Identity documents reviewed; verified specialist status approved."
              required
              className="w-full border border-[#0b1c30] px-3 py-2 text-xs text-[#0b1c30] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-[#0b1c30] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="border border-[#0b1c30] px-4 py-2 font-bold uppercase text-[#0b1c30] hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="border border-[#005d42] bg-[#005d42] px-5 py-2 font-bold uppercase text-white hover:bg-[#047857] shadow-[2px_2px_0px_#0b1c30] active:translate-x-[1px] active:translate-y-[1px] disabled:opacity-50"
            >
              {saving ? "Recording..." : "Save Profile Updates"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
