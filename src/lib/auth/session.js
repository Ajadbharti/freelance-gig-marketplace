import crypto from "crypto";

const SESSION_COOKIE_NAME = "gigcraft_session";
const DEFAULT_SECRET = "gigcraft_deterministic_secure_session_secret_2025_prod_key";

function getSecret() {
  return process.env.SESSION_SECRET || process.env.GOOGLE_CLIENT_SECRET || DEFAULT_SECRET;
}

/**
 * Creates a signed JWT session token (HS256)
 */
export function signSession(payload, expiresInSeconds = 7 * 24 * 60 * 60) {
  const secret = getSecret();
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const data = Buffer.from(JSON.stringify({ ...payload, exp })).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${header}.${data}`)
    .digest("base64url");
  return `${header}.${data}.${signature}`;
}

/**
 * Verifies a signed JWT session token
 */
export function verifySession(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [header, data, signature] = parts;
  const secret = getSecret();
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${header}.${data}`)
    .digest("base64url");

  // Constant-time comparison to prevent timing attacks
  try {
    const isMatch = crypto.timingSafeEqual(
      Buffer.from(signature, "utf-8"),
      Buffer.from(expected, "utf-8")
    );
    if (!isMatch) return null;
  } catch {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString());
    if (payload.exp && Math.floor(Date.now() / 1000) >= payload.exp) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

export { SESSION_COOKIE_NAME };
