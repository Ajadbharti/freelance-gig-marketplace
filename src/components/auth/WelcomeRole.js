"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, ShoppingBag } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/ToastProvider";
import AuthCard from "@/components/auth/AuthCard";
import { cn } from "@/lib/utils";

const ROLES = [
  { value: "client", label: "Client", text: "I want to hire freelancers", icon: ShoppingBag },
  { value: "freelancer", label: "Freelancer", text: "I want to sell my services", icon: Briefcase },
];

export default function WelcomeRole() {
  const router = useRouter();
  const { user, hydrated, setRole } = useAuth();
  const { showToast } = useToast();
  const [choice, setChoice] = useState("client");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) router.replace("/login");
    else if (!user.needsRole && !saving) {
      router.replace(user.role === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client");
    }
  }, [hydrated, user, saving, router]);

  if (!hydrated || !user || !user.needsRole) {
    return <div className="py-24 text-center text-sm text-slate-500">Loading...</div>;
  }

  async function handleContinue() {
    setSaving(true);
    const result = await setRole(choice);
    if (!result.ok) {
      showToast(result.error, "error");
      setSaving(false);
      return;
    }
    showToast("You are all set!");
    router.push(choice === "freelancer" ? "/dashboard/freelancer" : "/dashboard/client");
  }

  return (
    <AuthCard
      title={`Welcome, ${user.name.split(" ")[0]}!`}
      subtitle="How will you use GigNest? You can only choose this once."
    >
      <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Account type">
        {ROLES.map((role) => {
          const Icon = role.icon;
          const active = choice === role.value;
          return (
            <button
              key={role.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setChoice(role.value)}
              className={cn(
                "rounded-xl border p-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                active ? "border-indigo-600 bg-indigo-50" : "border-slate-300 hover:bg-slate-50"
              )}
            >
              <Icon className="h-5 w-5 text-indigo-600" />
              <p className="mt-2 text-sm font-semibold text-slate-900">{role.label}</p>
              <p className="mt-1 text-xs text-slate-600">{role.text}</p>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleContinue}
        disabled={saving}
        className="mt-6 w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
      >
        {saving ? "Saving..." : "Continue"}
      </button>
    </AuthCard>
  );
}