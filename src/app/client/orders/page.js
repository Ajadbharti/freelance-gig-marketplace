import ClientOrdersView from "@/components/client-orders/ClientOrdersView";

export const metadata = {
  title: "My Orders | GigMarket — Freelance Marketplace",
  description: "Track and manage all your freelance orders, review active deliverables, and disburse milestone payments securely.",
};

export default function ClientOrdersPage() {
  return <ClientOrdersView />;
}
