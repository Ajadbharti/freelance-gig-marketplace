import { loadFromStorage } from "@/lib/storage";

export function findUserById(id) {
  if (!id) return null;
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("gigcraft_in:registered_users");
      if (raw) {
        const registered = JSON.parse(raw);
        const found = registered.find((u) => u.id === id);
        if (found) {
          return { id: found.id, name: found.name, email: found.email, role: found.role, avatar: found.avatar };
        }
      }
      const currentUser = localStorage.getItem("gigcraft_in:user");
      if (currentUser) {
        const u = JSON.parse(currentUser);
        if (u.id === id) return u;
      }
    } catch {}
  }

  const registered = loadFromStorage("auth:registered", []);
  const found = registered.find((u) => u.id === id);
  if (!found) return null;

  return { id: found.id, name: found.name, email: found.email, role: found.role, avatar: found.avatar };
}