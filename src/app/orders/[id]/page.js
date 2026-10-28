import { Suspense } from "react";
import OrderDetails, { OrderDetailsSkeleton } from "@/components/orders/OrderDetails";

export const metadata = {
  title: "Order details | GigNest",
};

export default function OrderPage({ params }) {
  return (
    <Suspense fallback={<OrderDetailsSkeleton />}>
      <OrderDetails params={params} />
    </Suspense>
  );
}