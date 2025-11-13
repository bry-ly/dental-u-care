import { NextRequest, NextResponse } from "next/server";
import { betterFetch } from "@better-fetch/fetch";

/**
 * Middleware for protecting authenticated routes
 *
 * Best practices from Better Auth:
 * - Use betterFetch to validate sessions
 * - Check for multiple cookie name variations (production vs development)
 * - Handle redirects properly with intent preservation
 * - Exclude public routes and API routes
 * - Don't perform RBAC here (do it at page level with database access)
 *
 * Protected routes:
 * - /admin/* - Admin panel (role check in page)
 * - /dentist/* - Dentist portal (role check in page)
 * - /patient/* - Patient portal (role check in page)
 * - /profile/* - User profile (any authenticated user)
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for API routes and public paths
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static")
  ) {
    return NextResponse.next();
  }

  // Validate session using Better Auth's approach
  try {
    const session = await betterFetch<{
      user: { id: string; role?: string };
    } | null>("/api/auth/get-session", {
      baseURL: request.nextUrl.origin,
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });

    // No session - redirect to sign-in
    if (!session.data || !session.data.user) {
      if (process.env.NODE_ENV === "development") {
        console.log("[Middleware] No session found for:", pathname);
      }

      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // Session exists - allow access
    // Note: RBAC is handled at the page level where we have database access
    if (process.env.NODE_ENV === "development") {
      console.log("[Middleware] Session valid for:", pathname);
    }

    const response = NextResponse.next();

    // Prevent caching of authenticated pages
    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  } catch (error) {
    // Session validation failed
    console.error("[Middleware] Session validation error:", error);

    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(signInUrl);
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/admin",
    "/dentist/:path*",
    "/dentist",
    "/patient/:path*",
    "/patient",
    "/profile/:path*",
    "/profile",
  ],
};
