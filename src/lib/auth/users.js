import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

function ensureDirectory() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) {
      fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), "utf-8");
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
      return JSON.parse(content || "[]");
    }
  } catch (err) {
    console.error("Error reading users file:", err.message);
  }
  return [];
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
  return users.find((u) => u.email?.toLowerCase() === clean) || null;
}

export function findUserByGoogleId(googleId) {
  if (!googleId) return null;
  const users = getAllUsers();
  return users.find((u) => u.googleId === googleId) || null;
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

  if (existingIndex >= 0) {
    // Existing user: Update profile & last login
    const existing = users[existingIndex];
    const updated = {
      ...existing,
      googleId: googleId || existing.googleId,
      name: existing.name || cleanName,
      avatar: picture || existing.avatar,
      initials: existing.initials || initials,
      lastLoginAt: new Date().toISOString(),
      authProvider: "google",
    };
    users[existingIndex] = updated;
    saveUsers(users);
    return { user: updated, isNew: false };
  }

  // New user: Automatically create account
  const newUser = {
    id: "usr-g-" + (googleId ? googleId.slice(-8) : Date.now().toString(36)),
    googleId: googleId || null,
    name: cleanName,
    email: cleanEmail,
    role: role || "client",
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
