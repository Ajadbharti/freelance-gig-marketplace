"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { useMarketplace } from "@/context/MarketplaceContext";
import { useToast } from "@/components/ui/ToastProvider";
import SafeImage from "@/components/ui/SafeImage";

function SettingsForm({ user }) {
  const { showToast } = useToast();
  const [avatarUrl, setAvatarUrl] = useState(user.avatar || "");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({ defaultValues: { name: user.name, email: user.email } });

  async function onSubmit(values) {
    showToast("Node profile settings saved.");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 font-mono">
      <div className="flex items-center gap-2 text-xs text-[#047857] font-bold uppercase tracking-wider">
        <span>■</span>
        <span>SECURITY & PROTOCOL IDENTIFICATION</span>
      </div>
      <h1 className="mt-2 font-serif text-3xl font-bold text-slate-950">
        Account & Cryptographic Identity
      </h1>
      <p className="mt-1 text-xs text-slate-600">
        Manage your public key, hardware 2FA tokens, and workspace preferences.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-6 border border-slate-200 bg-white p-6 sm:p-8 shadow-sm font-sans"
      >
        <div className="flex items-center gap-4">
          <SafeImage
            src={avatarUrl || user.avatar}
            alt=""
            className="h-16 w-16 rounded-full object-cover border border-slate-200"
          />
          <div>
            <label className="block font-mono text-xs font-bold uppercase text-slate-900">
              Profile Photo URL
            </label>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="mt-1.5 h-9 w-72 border border-slate-300 px-3 font-mono text-xs text-slate-900 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-xs font-bold uppercase text-slate-900">
            Display Name
          </label>
          <input
            type="text"
            {...register("name")}
            className="mt-1.5 h-10 w-full border border-slate-300 px-3 font-mono text-xs text-slate-900 focus:outline-none"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 font-mono text-xs">
          <div className="border border-slate-100 bg-[#FAFBFB] p-3">
            <span className="text-[10px] text-slate-400 uppercase">AUTHENTICATED EMAIL</span>
            <p className="mt-1 font-bold text-slate-900">{user.email || "developer@agency.io"}</p>
          </div>
          <div className="border border-slate-100 bg-[#FAFBFB] p-3">
            <span className="text-[10px] text-slate-400 uppercase">NODE ARCHETYPE</span>
            <p className="mt-1 font-bold text-[#047857] uppercase">{user.role || "CLIENT"}</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#047857] py-3 font-mono text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#065f46]"
        >
          SAVE CONFIGURATION
        </button>
      </form>
    </div>
  );
}

export default function AccountSettings() {
  const { user } = useAuth();
  return <SettingsForm user={user || { name: "Linus Torvalds", email: "engineer@enterprise.io", role: "client" }} />;
}
