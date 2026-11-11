export const ROLE_LABELS = {
  client: "Client",
  freelancer: "Freelancer",
  admin: "Admin",
};

export function dashboardPath(user) {
  if (user?.role === "admin") return "/admin";
  if (user?.role === "freelancer") return "/dashboard/freelancer";
  return "/dashboard/client";
}