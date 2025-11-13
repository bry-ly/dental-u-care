import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-session/auth";

/**
 * POST /api/auth/resend-verification
 * Resends the email verification link to the user
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Use Better Auth's sendVerificationEmail method
    await auth.api.sendVerificationEmail({
      body: { email },
    });

    return NextResponse.json(
      { message: "Verification email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to resend verification email:", error);
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 }
    );
  }
}
