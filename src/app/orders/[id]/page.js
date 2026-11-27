"use client";

import { use, Suspense } from "react";
import ClientOrderDetailsView from "@/components/client-order-details/ClientOrderDetailsView";

function OrderContent({ params }) {
  const resolved = use(params);
  return <ClientOrderDetailsView initialOrderId={resolved?.id || "ORD-8812"} />;
}

export default function OrderPage({ params }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center font-mono text-xs text-slate-500">
          Loading order details...
        </div>
      }
    >
      <OrderContent params={params} />
    </Suspense>
  );
}
