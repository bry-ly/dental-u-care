import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "No session found" }, { status: 401 });
    }

    // Ensure user has a role, default to "patient" if not set
    if (session.user && !session.user.role) {
      session.user.role = "patient";
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error("Session fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}