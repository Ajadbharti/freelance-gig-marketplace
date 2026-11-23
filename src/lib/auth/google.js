/**
 * Google OAuth 2.0 Backend Token Verification
 * Verifies ID Tokens directly with Google's official OAuth2 endpoint.
 */

export async function verifyGoogleToken(idToken) {
  if (!idToken || typeof idToken !== "string") {
    return { ok: false, error: "Missing Google ID token." };
  }

  try {
    const res = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return {
        ok: false,
        error: errData.error_description || errData.error || "Google token verification failed.",
      };
    }

    const payload = await res.json();

    // Verify audience if Google Client ID is configured
    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (clientId && payload.aud && payload.aud !== clientId) {
      return { ok: false, error: "Google token audience mismatch." };
    }

    // Verify token is not expired
    if (payload.exp && Math.floor(Date.now() / 1000) > Number(payload.exp)) {
      return { ok: false, error: "Google token has expired." };
    }

    // Require verified email
    if (payload.email_verified === "false" || payload.email_verified === false) {
      return { ok: false, error: "Google email address is not verified." };
    }

    return {
      ok: true,
      user: {
        googleId: payload.sub,
        email: payload.email,
        name: payload.name || payload.email?.split("@")[0] || "Google User",
        picture: payload.picture || "",
        locale: payload.locale || "en",
      },
    };
  } catch (err) {
    return { ok: false, error: err.message || "Failed to contact Google OAuth servers." };
  }
}

/**
 * Exchange Google Authorization Code for Tokens
 */
export async function exchangeGoogleCode(code, redirectUri) {
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return { ok: false, error: "Google Client ID or Secret is not configured on the server." };
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.json().catch(() => ({}));
      return { ok: false, error: err.error_description || "Google code exchange failed." };
    }

    const tokens = await tokenRes.json();
    if (tokens.id_token) {
      return verifyGoogleToken(tokens.id_token);
    }

    // Fetch user info via access token
    const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!userRes.ok) {
      return { ok: false, error: "Failed to fetch Google user profile." };
    }

    const user = await userRes.json();
    return {
      ok: true,
      user: {
        googleId: user.sub,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    };
  } catch (err) {
    return { ok: false, error: err.message || "Google code exchange network failure." };
  }
}
