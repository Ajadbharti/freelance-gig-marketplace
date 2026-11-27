import ClientDashboardView from "@/components/client-dashboard/ClientDashboardView";

export const metadata = {
  title: "Client Dashboard — Overview | GigMarket",
  description:
    "Manage your active projects, milestone escrow payments, orders, and messages on GigMarket.",
};

export default function DashboardClientRoutePage() {
  return <ClientDashboardView />;
}
