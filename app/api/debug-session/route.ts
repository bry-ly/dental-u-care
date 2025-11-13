import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-session/auth";

/**
 * Debug endpoint to check session and cookie status
 * Access this at: /api/debug-session
 *
 * REMOVE THIS FILE AFTER DEBUGGING
 */
export async function GET(request: NextRequest) {
  try {
    // Get all cookies
    const allCookies = request.cookies.getAll();
    const sessionToken = request.cookies.get("better-auth.session_token");

    // Try to get session from Better Auth
    let session = null;
    let sessionError = null;
    try {
      session = await auth.api.getSession({
        headers: request.headers,
      });
    } catch (error) {
      sessionError = error instanceof Error ? error.message : String(error);
    }

    // Get request details
    const info = {
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasAuthUrl: !!process.env.BETTER_AUTH_URL,
        authUrl: process.env.BETTER_AUTH_URL,
        hasAppUrl: !!process.env.NEXT_PUBLIC_APP_URL,
        appUrl: process.env.NEXT_PUBLIC_APP_URL,
      },
      request: {
        url: request.url,
        origin: request.headers.get("origin"),
        referer: request.headers.get("referer"),
        host: request.headers.get("host"),
        protocol: request.headers.get("x-forwarded-proto") || "unknown",
      },
      cookies: {
        total: allCookies.length,
        names: allCookies.map((c) => c.name),
        hasSessionToken: !!sessionToken,
        sessionTokenValue: sessionToken?.value
          ? `${sessionToken.value.substring(0, 20)}...`
          : null,
      },
      session: session
        ? {
            userId: session.user?.id,
            userEmail: session.user?.email,
            sessionId: session.session?.id,
            expiresAt: session.session?.expiresAt,
          }
        : null,
      sessionError,
    };

    return NextResponse.json(info, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
