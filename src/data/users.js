import { freelancers } from "./freelancers";

export const DEMO_PASSWORD = "demo123";

const clientUsers = [
  {
    id: "c1",
    name: "Rohan Verma",
    email: "rohan@demo.com",
    role: "client",
    avatar: "https://i.pravatar.cc/200?img=14",
  },
  {
    id: "c2",
    name: "Lisa Bennett",
    email: "lisa@demo.com",
    role: "client",
    avatar: "https://i.pravatar.cc/200?img=9",
  },
];

const freelancerUsers = freelancers.map((f) => ({
  id: f.id,
  name: f.name,
  email: `${f.name.split(" ")[0].toLowerCase()}@demo.com`,
  role: "freelancer",
  avatar: f.avatar,
}));

export const demoUsers = [...clientUsers, ...freelancerUsers];