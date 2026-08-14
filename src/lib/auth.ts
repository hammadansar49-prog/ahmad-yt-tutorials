import { cookies } from "next/headers";
import adminApp from "@/lib/firebase-admin";
import { getAuth } from "firebase-admin/auth";

const SESSION_COOKIE = "admin_session";

function allowedAdminEmails(): string[] {
  return (process.env.ALLOWED_ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Verifies a Firebase Auth ID token server-side and confirms the signed-in
 * user's email is on the admin allow-list, before granting a session.
 */
export async function verifyAdminIdToken(idToken: string): Promise<{
  ok: boolean;
  error?: string;
}> {
  try {
    const decoded = await getAuth(adminApp).verifyIdToken(idToken);
    const email = decoded.email?.toLowerCase();
    if (!email || !allowedAdminEmails().includes(email)) {
      return { ok: false, error: "This account is not authorized for admin access." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not verify sign-in. Please try again." };
  }
}

export async function createSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, process.env.SESSION_TOKEN ?? "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function isAuthed(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return Boolean(token) && token === process.env.SESSION_TOKEN;
}
