import { demoUsers } from "@/data/users";
import { loadFromStorage } from "@/lib/storage";

export function findUserById(id) {
  const demo = demoUsers.find((u) => u.id === id);
  if (demo) return demo;

  const registered = loadFromStorage("auth:registered", []);
  const found = registered.find((u) => u.id === id);
  if (!found) return null;

  return { id: found.id, name: found.name, email: found.email, role: found.role, avatar: found.avatar };
}