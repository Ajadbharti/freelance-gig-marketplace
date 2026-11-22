export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(amount) {
  return `$${Number(amount ?? 0).toLocaleString("en-US")}`;
}

export function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function generateId(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

export function averageRating(reviews) {
  if (!reviews || reviews.length === 0) return 0;
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return Math.round((total / reviews.length) * 10) / 10;
}

export const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="100%" height="100%" fill="#eff4ff"/><text x="50%" y="50%" fill="#0047bf" font-family="Space Grotesk, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" dominant-baseline="middle">SPEC PREVIEW UNAVAILABLE</text></svg>`
  );
