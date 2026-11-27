import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { findUserByEmail } from "@/lib/auth/users";

const SUPER_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "azadbharati802223@gmail.com").toLowerCase();

export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get(SESSION_COOKIE_NAME)?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ ok: false, user: null }, { status: 401 });
    }

    const session = verifySession(token);
    if (!session || !session.email) {
      return NextResponse.json({ ok: false, user: null }, { status: 401 });
    }

    // Look up fresh user record from database
    const dbUser = findUserByEmail(session.email);
    let resolvedUser = dbUser || session;

    if (session.email.toLowerCase() === SUPER_ADMIN_EMAIL) {
      resolvedUser = {
        ...resolvedUser,
        role: "admin",
      };
    }

    return NextResponse.json({
      ok: true,
      user: resolvedUser,
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
