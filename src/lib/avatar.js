const COLORS = ["#4f46e5", "#7c3aed", "#0891b2", "#059669", "#d97706", "#db2777"];

export function initialsAvatar(name = "") {
  const clean = String(name).trim();
  const letters =
    clean
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("")
      .replace(/[^\p{L}\p{N}]/gu, "") || "?";
  const color = COLORS[clean.length % COLORS.length];
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">` +
    `<rect width="100%" height="100%" fill="${color}"/>` +
    `<text x="50%" y="50%" fill="#ffffff" font-family="Arial, sans-serif" font-size="80" ` +
    `font-weight="bold" text-anchor="middle" dominant-baseline="central">${letters}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}