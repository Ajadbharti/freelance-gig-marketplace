import { freelancers } from "./freelancers";

export const DEMO_PASSWORD = "demo123";

const clientUsers = [
  {
    id: "c1",
    name: "Apex Cloud Labs",
    email: "developer@agency.io",
    role: "client",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    headline: "Enterprise Cloud Infrastructure & Distributed Systems",
  },
  {
    id: "c2",
    name: "Linus Torvalds",
    email: "engineer@enterprise.io",
    role: "client",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    headline: "Lead Systems Architect // Kernel Engineering",
  },
  {
    id: "admin",
    name: "GigCraft Platform Admin",
    email: "admin@gigcraft.io",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80",
    headline: "Protocol Overseer & Escrow Custodian",
  },
];

const freelancerUsers = freelancers.map((f) => ({
  id: f.id,
  name: f.name,
  email: `${f.name.split(" ")[0].toLowerCase()}@demo.com`,
  role: "freelancer",
  avatar: f.avatar,
  headline: f.headline,
}));

export const demoUsers = [...clientUsers, ...freelancerUsers];
