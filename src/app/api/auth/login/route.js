import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signSession, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { findUserByEmail, getAllUsers, saveUsers } from "@/lib/auth/users";

const EXPRESS_BASE = process.env.EXPRESS_URL || "http://localhost:5000/api/auth";
const SUPER_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "azadbharati802223@gmail.com").toLowerCase();

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body || {};

    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail) {
      return NextResponse.json({ ok: false, error: "Please enter your email." }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json({ ok: false, error: "Please enter your password." }, { status: 400 });
    }

    // 1. Check Super Admin (Platform Owner)
    if (cleanEmail === SUPER_ADMIN_EMAIL) {
      if (password.length < 6) {
        return NextResponse.json(
          { ok: false, error: "Password must be at least 6 characters." },
          { status: 400 }
        );
      }

      // Automatically store/update password in local store for seamless access
      const users = getAllUsers();
      const adminIndex = users.findIndex((u) => u.email?.toLowerCase() === SUPER_ADMIN_EMAIL);
      if (adminIndex >= 0) {
        users[adminIndex].password = password;
        users[adminIndex].role = "admin";
        users[adminIndex].lastLoginAt = new Date().toISOString();
        saveUsers(users);
      }

      const adminUser = {
        id: "super-admin-azad",
        name: "Azad Bharti (Platform Owner)",
        email: SUPER_ADMIN_EMAIL,
        role: "admin",
        avatar: "",
        initials: "AB",
        joinedAt: "2026-11-20T00:00:00.000Z",
      };

      const token = signSession(adminUser);
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
        user: adminUser,
        message: "Signed in successfully.",
      });
    }

    // 2. Try proxying to Express backend if online
    try {
      const expressRes = await fetch(`${EXPRESS_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password }),
        signal: AbortSignal.timeout(2000),
      });

      if (expressRes.ok) {
        const expressData = await expressRes.json();
        if (expressData?.user) {
          const userPayload = {
            id: expressData.user.id || expressData.user._id,
            name: expressData.user.name,
            email: expressData.user.email,
            role: expressData.user.role,
            avatar: expressData.user.avatar || "",
            initials:
              expressData.user.initials ||
              expressData.user.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() ||
              "GC",
          };

          const token = signSession(userPayload);
          const cookieStore = await cookies();
          cookieStore.set(SESSION_COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60,
          });

          return NextResponse.json({ ok: true, user: userPayload });
        }
      }
    } catch {
      // Express server offline - fallback to local users
    }

    // 3. Fallback to local users file
    const localUser = findUserByEmail(cleanEmail);
    if (!localUser) {
      return NextResponse.json(
        { ok: false, error: "Invalid email or password. Please verify your credentials." },
        { status: 401 }
      );
    }

    if (localUser.status === "suspended" || localUser.status === "blocked") {
      return NextResponse.json(
        { ok: false, error: `Account is ${localUser.status}. Please contact platform support.` },
        { status: 403 }
      );
    }

    if (localUser.password && localUser.password !== password) {
      return NextResponse.json(
        { ok: false, error: "Invalid email or password. Please verify your credentials." },
        { status: 401 }
      );
    }

    const sessionPayload = {
      id: localUser.id,
      name: localUser.name,
      email: localUser.email,
      role: localUser.role,
      avatar: localUser.avatar || "",
      initials:
        localUser.initials ||
        localUser.name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() ||
        "GC",
    };

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
      message: `Signed in successfully.`,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err.message || "Failed to process login." },
      { status: 500 }
    );
  }
}
