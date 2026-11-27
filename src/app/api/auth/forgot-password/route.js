import { NextResponse } from "next/server";
import crypto from "crypto";
import { findUserByEmail, getAllUsers, saveUsers } from "@/lib/auth/users";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body || {};

    const cleanEmail = (email || "").trim().toLowerCase();

    // 1. Basic validation
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid registered email address." },
        { status: 400 }
      );
    }

    // 2. Check if user exists (without revealing it in response)
    const users = getAllUsers();
    const userIndex = users.findIndex((u) => u.email?.toLowerCase() === cleanEmail);

    if (userIndex >= 0) {
      // 3. Generate a cryptographically secure random reset token
      const rawToken = crypto.randomBytes(32).toString("hex");

      // 4. Hash the token with SHA256 before storing
      const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
      const tokenExpires = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour validity

      // 5. Store only the hashed token and expiry in database
      users[userIndex] = {
        ...users[userIndex],
        resetPasswordToken: hashedToken,
        resetPasswordExpires: tokenExpires,
        updatedAt: new Date().toISOString(),
      };
      saveUsers(users);

      // In production, an email service (SendGrid, Resend, AWS SES) would send this URL.
      // In development / demo, we log the reset link securely.
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${rawToken}`;
      console.log(`[GigMarket Security] Password Reset Link generated for ${cleanEmail}: ${resetUrl}`);
    }

    // 6. Security requirement: Do NOT reveal whether an email address is registered
    return NextResponse.json({
      ok: true,
      message:
        "If an account is associated with this email address, you will receive password reset instructions shortly.",
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err.message || "Failed to process password reset request." },
      { status: 500 }
    );
  }
}
