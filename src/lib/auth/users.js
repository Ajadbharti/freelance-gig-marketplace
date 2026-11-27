import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const SUPER_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "azadbharati802223@gmail.com").toLowerCase();

const DEFAULT_USERS = [
  {
    id: "usr-admin-azad",
    name: "Azad Bharti (Platform Owner)",
    email: SUPER_ADMIN_EMAIL,
    role: "admin",
    status: "active",
    avatar: "",
    initials: "AB",
    createdAt: "2026-11-20T00:00:00.000Z",
    lastLoginAt: new Date().toISOString(),
  },
  {
    id: "usr-demo-client",
    name: "Enterprise Client",
    email: "client@gigcraft.io",
    password: "ClientPass2026!",
    role: "client",
    status: "active",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Enterprise+Client&backgroundColor=0047bf,0b1c30",
    initials: "EC",
    createdAt: "2026-11-20T00:00:00.000Z",
    lastLoginAt: new Date().toISOString(),
  },
  {
    id: "usr-demo-freelancer",
    name: "Priya Sharma (Fullstack Specialist)",
    email: "freelancer@gigcraft.io",
    password: "FreelancerPass2026!",
    role: "freelancer",
    status: "active",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Priya+Sharma&backgroundColor=047857,0f172a",
    initials: "PS",
    createdAt: "2026-11-20T00:00:00.000Z",
    lastLoginAt: new Date().toISOString(),
  },
];

function ensureDirectory() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify(DEFAULT_USERS, null, 2), "utf-8");
      return;
    }
  } catch (err) {
    console.warn("Could not initialize .data directory:", err.message);
  }
}

export function getAllUsers() {
  ensureDirectory();
  try {
    if (fs.existsSync(USERS_FILE)) {
      const content = fs.readFileSync(USERS_FILE, "utf-8");
      let users = JSON.parse(content || "[]");
      
      // Ensure default users exist
      let changed = false;
      for (const def of DEFAULT_USERS) {
        const found = users.find((u) => u.email?.toLowerCase() === def.email.toLowerCase());
        if (!found) {
          users.push(def);
          changed = true;
        } else if (def.email.toLowerCase() === SUPER_ADMIN_EMAIL && found.role !== "admin") {
          found.role = "admin";
          changed = true;
        }
      }
      if (changed) {
        saveUsers(users);
      }
      return users;
    }
  } catch (err) {
    console.error("Error reading users file:", err.message);
  }
  return DEFAULT_USERS;
}

export function saveUsers(users) {
  ensureDirectory();
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing users file:", err.message);
  }
}

export function findUserByEmail(email) {
  if (!email) return null;
  const clean = email.trim().toLowerCase();
  const users = getAllUsers();
  const user = users.find((u) => u.email?.toLowerCase() === clean);
  if (user && clean === SUPER_ADMIN_EMAIL) {
    return { ...user, role: "admin" };
  }
  return user || null;
}

export function findUserByGoogleId(googleId) {
  if (!googleId) return null;
  const users = getAllUsers();
  return users.find((u) => u.googleId === googleId) || null;
}

export function createUser({ name, email, password, role }) {
  const cleanEmail = (email || "").trim().toLowerCase();
  const users = getAllUsers();

  const existing = users.find((u) => u.email?.toLowerCase() === cleanEmail);
  if (existing) {
    return { ok: false, error: "An account with this email already exists." };
  }

  const cleanName = (name || cleanEmail.split("@")[0]).trim();
  const initials = cleanName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Strict role check: public registration can only be client or freelancer
  const safeRole = role === "freelancer" ? "freelancer" : "client";

  const newUser = {
    id: "usr-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name: cleanName,
    email: cleanEmail,
    password: password,
    role: safeRole,
    status: "active",
    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=${
      safeRole === "freelancer" ? "047857,0f172a" : "0047bf,0b1c30"
    }`,
    initials: initials || (safeRole === "freelancer" ? "FL" : "CL"),
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  return { ok: true, user: newUser };
}

/**
 * Creates a new user or updates an existing user from verified Google OAuth profile
 */
export function createOrUpdateGoogleUser({ googleId, name, email, picture, role = "client" }) {
  const cleanEmail = (email || "").trim().toLowerCase();
  const users = getAllUsers();

  const existingIndex = users.findIndex(
    (u) => (u.googleId && u.googleId === googleId) || u.email?.toLowerCase() === cleanEmail
  );

  const cleanName = (name || cleanEmail.split("@")[0] || "Google User").trim();
  const initials =
    cleanName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "GU";

  const isSuperAdmin = cleanEmail === SUPER_ADMIN_EMAIL;
  const userRole = isSuperAdmin ? "admin" : (role || "client");

  if (existingIndex >= 0) {
    const existing = users[existingIndex];
    const updated = {
      ...existing,
      googleId: googleId || existing.googleId,
      name: existing.name || cleanName,
      avatar: picture || existing.avatar,
      initials: existing.initials || initials,
      role: isSuperAdmin ? "admin" : (existing.role || userRole),
      lastLoginAt: new Date().toISOString(),
      authProvider: "google",
    };
    users[existingIndex] = updated;
    saveUsers(users);
    return { user: updated, isNew: false };
  }

  const newUser = {
    id: "usr-g-" + (googleId ? googleId.slice(-8) : Date.now().toString(36)),
    googleId: googleId || null,
    name: cleanName,
    email: cleanEmail,
    role: userRole,
    avatar: picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}&backgroundColor=047857,0f172a`,
    initials: initials,
    authProvider: "google",
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);
  return { user: newUser, isNew: true };
}
