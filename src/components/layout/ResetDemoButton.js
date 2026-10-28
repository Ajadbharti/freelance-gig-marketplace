"use client";

import { useState } from "react";
import { useMarketplace } from "@/context/MarketplaceContext";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function ResetDemoButton() {
  const { resetDemoData } = useMarketplace();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        Reset demo data
      </button>
      <ConfirmModal
        open={open}
        title="Reset all demo data?"
        message="This deletes every account, gig, order and review you created in this browser, restores the original sample data and logs you out."
        confirmLabel="Reset everything"
        danger
        onConfirm={resetDemoData}
        onClose={() => setOpen(false)}
      />
    </>
  );
}