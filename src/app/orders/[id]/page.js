"use client";

import { use, Suspense } from "react";
import OrderDetails from "@/components/orders/OrderDetails";

function OrderContent({ params }) {
  const resolved = use(params);
  return <OrderDetails initialOrderId={resolved.id} />;
}

export default function OrderPage({ params }) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-12 font-mono text-xs text-slate-500">
          Loading contract ledger...
        </div>
      }
    >
      <OrderContent params={params} />
    </Suspense>
  );
}
