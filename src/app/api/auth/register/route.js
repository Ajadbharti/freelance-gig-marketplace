import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signSession, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { createUser, findUserByEmail } from "@/lib/auth/users";

const EXPRESS_BASE = process.env.EXPRESS_URL || "http://localhost:5000/api/auth";
const SUPER_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "azadbharati802223@gmail.com").toLowerCase();

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body || {};

    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail) {
      return NextResponse.json({ ok: false, error: "Email is required." }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { ok: false, error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Never allow registering as admin or claiming the Super Admin email
    if (cleanEmail === SUPER_ADMIN_EMAIL) {
      return NextResponse.json(
        { ok: false, error: "This email is reserved for system administration. Please log in directly." },
        { status: 403 }
      );
    }

    // Role is strictly Client or Freelancer for public registrations
    const safeRole = role === "freelancer" ? "freelancer" : "client";

    // 1. Check if user already exists locally
    const existing = findUserByEmail(cleanEmail);
    if (existing) {
      return NextResponse.json(
        { ok: false, error: "An account with this email already exists. Please log in." },
        { status: 400 }
      );
    }

    // 2. Try proxying to Express/MongoDB backend if available
    let expressUser = null;
    try {
      const expressRes = await fetch(`${EXPRESS_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: (name || cleanEmail.split("@")[0]).trim(),
          email: cleanEmail,
          password: password,
          role: safeRole,
        }),
        signal: AbortSignal.timeout(2000),
      });
      if (expressRes.ok) {
        const expressData = await expressRes.json();
        if (expressData?.user) {
          expressUser = expressData.user;
        }
      }
    } catch {
      // Express server offline - proceed with local deterministic storage
    }

    // 3. Create or save in local store
    const result = createUser({
      name: expressUser?.name || name,
      email: cleanEmail,
      password: password,
      role: safeRole,
    });

    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
    }

    const sessionPayload = {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      role: result.user.role,
      avatar: result.user.avatar,
      initials: result.user.initials,
    };

    // 4. Sign session and set HTTP-only cookie
    const token = signSession(sessionPayload);
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
    });

    return NextResponse.json({
      ok: true,
      user: sessionPayload,
      message: `Account registered successfully as ${safeRole}.`,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err.message || "Failed to register account." },
      { status: 500 }
    );
  }
}
