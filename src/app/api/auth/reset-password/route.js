import { NextResponse } from "next/server";
import crypto from "crypto";
import { getAllUsers, saveUsers } from "@/lib/auth/users";

// GET: Validates whether a reset token is valid and unexpired
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { ok: false, valid: false, error: "Password reset token is missing." },
        { status: 400 }
      );
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const users = getAllUsers();
    const now = new Date().toISOString();

    const user = users.find(
      (u) =>
        u.resetPasswordToken === hashedToken &&
        u.resetPasswordExpires &&
        u.resetPasswordExpires > now
    );

    if (!user) {
      return NextResponse.json(
        {
          ok: false,
          valid: false,
          error: "This password reset link is invalid or has expired. Please request a new one.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      valid: true,
      email: user.email,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, valid: false, error: err.message || "Failed to validate reset token." },
      { status: 500 }
    );
  }
}

// POST: Resets password and invalidates the token
export async function POST(request) {
  try {
    const body = await request.json();
    const { token, password } = body || {};

    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Password reset token is required." },
        { status: 400 }
      );
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { ok: false, error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    // Validate password complexity
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
        },
        { status: 400 }
      );
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const users = getAllUsers();
    const now = new Date().toISOString();

    const userIndex = users.findIndex(
      (u) =>
        u.resetPasswordToken === hashedToken &&
        u.resetPasswordExpires &&
        u.resetPasswordExpires > now
    );

    if (userIndex < 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Password reset link is invalid, expired, or has already been used.",
        },
        { status: 400 }
      );
    }

    // Invalidate the reset token to prevent reuse and update the password
    users[userIndex] = {
      ...users[userIndex],
      password: password,
      resetPasswordToken: null,
      resetPasswordExpires: null,
      updatedAt: new Date().toISOString(),
    };
    saveUsers(users);

    return NextResponse.json({
      ok: true,
      message: "Password reset successful! You can now sign in with your new password.",
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err.message || "Failed to reset password." },
      { status: 500 }
    );
  }
}
