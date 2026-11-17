import OrderDetails from "@/components/orders/OrderDetails";

export const metadata = {
  title: "Order Management & Active Deliveries | GigCraft",
  description: "Real-time cryptographic milestone reconciliation, audit trails, and multi-signature escrow disbursement.",
};

export default function OrdersPage() {
  return <OrderDetails initialOrderId="GC-0821" />;
}
