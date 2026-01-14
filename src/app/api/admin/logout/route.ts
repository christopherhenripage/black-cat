import { NextResponse } from "next/server";
import {
  getSessionFromCookies,
  destroySession,
  clearSessionCookie,
} from "@/lib/admin-auth";

export async function POST() {
  try {
    const signedToken = await getSessionFromCookies();
    if (signedToken) {
      await destroySession(signedToken);
    }
    await clearSessionCookie();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "An error occurred during logout" },
      { status: 500 }
    );
  }
}
