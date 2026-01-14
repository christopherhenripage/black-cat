import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

function getSessionSecret(): string {
  const secret = process.env.INVENTORY_SESSION_SECRET;
  if (!secret || secret === "your-secret-key-change-in-production") {
    console.warn("Warning: Using default session secret. Set INVENTORY_SESSION_SECRET in production!");
    return "default-dev-secret-do-not-use-in-production";
  }
  return secret;
}

function signToken(token: string): string {
  const secret = getSessionSecret();
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(token);
  return `${token}.${hmac.digest("hex")}`;
}

function verifyToken(signedToken: string): string | null {
  // Token format: randomBytes.expiresAt.signature
  // Find the last dot to split token from signature
  const lastDotIndex = signedToken.lastIndexOf(".");
  if (lastDotIndex === -1) return null;

  const token = signedToken.substring(0, lastDotIndex);
  const signature = signedToken.substring(lastDotIndex + 1);

  const secret = getSessionSecret();
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(token);
  const expectedSignature = hmac.digest("hex");

  if (signature !== expectedSignature) return null;
  return token;
}

export async function createSession(): Promise<string> {
  // Create a token that includes expiration time
  const expiresAt = Date.now() + SESSION_DURATION_MS;
  const token = `${crypto.randomBytes(16).toString("hex")}.${expiresAt}`;
  return signToken(token);
}

export async function validateSession(signedToken: string): Promise<boolean> {
  const token = verifyToken(signedToken);
  if (!token) return false;

  // Token format: randomBytes.expiresAt
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const expiresAt = parseInt(parts[1], 10);
  if (isNaN(expiresAt) || Date.now() > expiresAt) {
    return false;
  }

  return true;
}

export async function destroySession(_signedToken: string): Promise<void> {
  // Session is stateless - just clearing the cookie is enough
  // The token will be invalidated when removed from cookies
}

export async function getSessionFromCookies(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value || null;
}

export async function setSessionCookie(signedToken: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, signedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION_MS / 1000,
    path: "/",
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function requireAuth(): Promise<void> {
  const signedToken = await getSessionFromCookies();
  if (!signedToken || !(await validateSession(signedToken))) {
    redirect("/admin/login");
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const signedToken = await getSessionFromCookies();
  if (!signedToken) return false;
  return validateSession(signedToken);
}

export function verifyPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || adminPassword === "changeme") {
    console.warn("Warning: Using default admin password. Set ADMIN_PASSWORD in production!");
    return password === "admin";
  }
  return password === adminPassword;
}

// Sessions are stateless - no cleanup needed
export async function cleanupExpiredSessions(): Promise<number> {
  return 0;
}
