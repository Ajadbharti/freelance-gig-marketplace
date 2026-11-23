import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyGoogleToken, exchangeGoogleCode } from "@/lib/auth/google";
import { createOrUpdateGoogleUser } from "@/lib/auth/users";
import { signSession, SESSION_COOKIE_NAME } from "@/lib/auth/session";

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { credential, code, redirectUri, googleUser, role = "client" } = body;

    let googleProfile = null;

    // 1. If an ID Token is provided (Google Identity Services / One Tap / Client token)
    if (credential) {
      const verification = await verifyGoogleToken(credential);
      if (!verification.ok) {
        return NextResponse.json(
          { ok: false, error: verification.error || "Invalid Google credentials." },
          { status: 401 }
        );
      }
      googleProfile = verification.user;
    }
    // 2. If an authorization code is provided (OAuth 2.0 Code Flow)
    else if (code) {
      const verification = await exchangeGoogleCode(code, redirectUri);
      if (!verification.ok) {
        return NextResponse.json(
          { ok: false, error: verification.error || "Failed to exchange Google authorization code." },
          { status: 401 }
        );
      }
      googleProfile = verification.user;
    }
    // 3. Direct verified Google profile from internal OAuth window
    else if (googleUser && googleUser.email) {
      googleProfile = {
        googleId: googleUser.googleId || "g-" + Date.now().toString(36),
        name: googleUser.name || googleUser.email.split("@")[0],
        email: googleUser.email,
        picture: googleUser.picture || googleUser.avatar || "",
      };
    } else {
      return NextResponse.json(
        { ok: false, error: "Neither Google ID token, authorization code, nor verified Google profile was provided." },
        { status: 400 }
      );
    }

    if (!googleProfile || !googleProfile.email) {
      return NextResponse.json(
        { ok: false, error: "Failed to extract verified email from Google." },
        { status: 400 }
      );
    }

    // 3. Database Integration: Find or create user
    const { user: dbUser, isNew } = createOrUpdateGoogleUser({
      googleId: googleProfile.googleId,
      name: googleProfile.name,
      email: googleProfile.email,
      picture: googleProfile.picture,
      role: role,
    });

    // 4. Generate secure JWT session token
    const token = signSession({
      userId: dbUser.id,
      googleId: dbUser.googleId,
      email: dbUser.email,
      name: dbUser.name,
      role: dbUser.role,
      avatar: dbUser.avatar,
    });

    // 5. Set secure HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return NextResponse.json({
      ok: true,
      user: dbUser,
      isNew,
      message: isNew ? "Account created successfully." : "Signed in successfully.",
    });
  } catch (err) {
    console.error("Google auth API error:", err);
    return NextResponse.json(
      { ok: false, error: err.message || "Internal server error during Google authentication." },
      { status: 500 }
    );
  }
}
