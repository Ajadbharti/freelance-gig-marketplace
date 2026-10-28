import DashboardShell from "@/components/dashboard/DashboardShell";
import GigForm from "@/components/dashboard/GigForm";

export const metadata = {
  title: "Create gig | GigNest",
};

export default function NewGigPage() {
  return (
    <DashboardShell
      role="freelancer"
      path="/dashboard/freelancer/gigs/new"
      title="Create a gig"
      subtitle="Describe your service so clients know exactly what they get."
    >
      <div className="max-w-3xl">
        <GigForm />
      </div>
    </DashboardShell>
  );
}