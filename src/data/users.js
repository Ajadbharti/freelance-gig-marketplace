import { freelancers } from "./freelancers";

export const DEMO_PASSWORD = "demo123";

const clientUsers = [
  {
    id: "c1",
    name: "Apex Cloud India",
    email: "developer@agency.in",
    role: "client",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    headline: "Enterprise Cloud Infrastructure & Distributed Systems // Bengaluru",
  },
  {
    id: "c2",
    name: "Aakash Verma",
    email: "engineer@enterprise.in",
    role: "client",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    headline: "Lead Systems Architect // Distributed Systems",
  },
  {
    id: "admin",
    name: "GigCraft Bharat Admin",
    email: "admin@gigcraft.in",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80",
    headline: "Protocol Overseer & Escrow Custodian",
  },
];

const freelancerUsers = freelancers.map((f) => ({
  id: f.id,
  name: f.name,
  email: `${f.name.split(" ")[0].toLowerCase()}@gigcraft.in`,
  role: "freelancer",
  avatar: f.avatar,
  headline: f.headline,
}));

export const demoUsers = [...clientUsers, ...freelancerUsers];
