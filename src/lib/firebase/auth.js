import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider, isFirebaseConfigured } from "./config";

/**
 * Trigger Firebase Google OAuth Popup Sign-In
 * @param {string} role - "client" | "freelancer"
 * @returns {Promise<{ ok: boolean, user?: object, idToken?: string, error?: string }>}
 */
export async function signInWithGooglePopup(role = "client") {
  if (!isFirebaseConfigured()) {
    return {
      ok: false,
      error: "Firebase is not configured yet. Please add your Firebase credentials in .env.local",
      isMissingConfig: true,
    };
  }

  if (!auth) {
    return {
      ok: false,
      error: "Firebase Auth is only available in the browser client.",
    };
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;
    const idToken = await fbUser.getIdToken();

    const cleanName = fbUser.displayName || fbUser.email?.split("@")[0] || "Google User";
    const initials = cleanName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "GU";

    // Synchronize with backend session cookie & persistent DB
    const res = await fetch("/api/auth/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firebaseUser: {
          uid: fbUser.uid,
          name: cleanName,
          email: fbUser.email,
          picture: fbUser.photoURL || "",
        },
        idToken,
        role,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.ok) {
      return {
        ok: false,
        error: data.error || "Failed to create session on backend.",
      };
    }

    return {
      ok: true,
      user: data.user,
      idToken,
      isNew: data.isNew,
    };
  } catch (err) {
    if (err.code === "auth/popup-closed-by-user") {
      return { ok: false, error: "Google sign-in popup was closed before completing." };
    }
    if (err.code === "auth/cancelled-popup-request") {
      return { ok: false, error: "Only one popup request allowed at a time." };
    }
    if (err.code === "auth/unauthorized-domain") {
      return {
        ok: false,
        error: "This domain is not authorized in Firebase Console (Authentication > Settings > Authorized Domains).",
      };
    }
    return {
      ok: false,
      error: err.message || "Google authentication failed.",
      code: err.code,
    };
  }
}

/**
 * Sign out from Firebase Auth
 */
export async function signOutFromFirebase() {
  if (auth) {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Firebase signOut error:", e);
    }
  }
}
