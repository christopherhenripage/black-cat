import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";
import prisma from "./db";

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
  const parts = signedToken.split(".");
  if (parts.length !== 2) return null;

  const [token, signature] = parts;
  const secret = getSessionSecret();
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(token);
  const expectedSignature = hmac.digest("hex");

  if (signature !== expectedSignature) return null;
  return token;
}

export async function createSession(): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await prisma.adminSession.create({
    data: {
      token,
      expiresAt,
    },
  });

  return signToken(token);
}

export async function validateSession(signedToken: string): Promise<boolean> {
  const token = verifyToken(signedToken);
  if (!token) return false;

  const session = await prisma.adminSession.findUnique({
    where: { token },
  });

  if (!session) return false;
  if (session.expiresAt < new Date()) {
    await prisma.adminSession.delete({ where: { token } });
    return false;
  }

  return true;
}

export async function destroySession(signedToken: string): Promise<void> {
  const token = verifyToken(signedToken);
  if (token) {
    await prisma.adminSession.deleteMany({ where: { token } });
  }
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

// Clean up expired sessions (can be called periodically)
export async function cleanupExpiredSessions(): Promise<number> {
  const result = await prisma.adminSession.deleteMany({
    where: {
      expiresAt: { lt: new Date() },
    },
  });
  return result.count;
}
