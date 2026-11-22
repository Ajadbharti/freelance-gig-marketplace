"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, ShoppingBag } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/ToastProvider";
import { cn } from "@/lib/utils";
import AuthCard from "@/components/auth/AuthCard";

const ROLES = [
  {
    value: "client",
    label: "I want to hire talent",
    text: "Order gigs, collaborate with specialists and manage payments securely in escrow.",
    icon: ShoppingBag,
  },
  {
    value: "freelancer",
    label: "I want to offer services",
    text: "List your specialized services, deliver orders and get paid directly to your balance.",
    icon: Briefcase,
  },
];

export default function WelcomeRole() {
  const router = useRouter();
  const { user, setRole } = useAuth();
  const { showToast } = useToast();
  const [choice, setChoice] = useState("client");
  const [saving, setSaving] = useState(false);

  if (!user) return null;

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
      subtitle="How will you use GigCraft? You can only choose this once."
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
                "border p-4 text-left transition focus:outline-none",
                active ? "border-2 border-[#005d42] bg-[#eff4ff] shadow-[2px_2px_0px_#0b1c30]" : "border-[#6e7a73] hover:bg-[#eff4ff]"
              )}
            >
              <Icon className="h-5 w-5 text-[#005d42]" />
              <p className="mt-2 font-headline text-sm font-bold uppercase text-[#0b1c30]">{role.label}</p>
              <p className="mt-1 text-xs text-[#3e4943]">{role.text}</p>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleContinue}
        disabled={saving}
        className="btn-primary mt-6 w-full py-3"
      >
        {saving ? "Saving..." : "Continue"}
      </button>
    </AuthCard>
  );
}
