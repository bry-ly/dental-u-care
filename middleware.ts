import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * Middleware for protecting authenticated routes
 *
 * Best practices from Better Auth:
 * - Use getSessionCookie for optimistic cookie-based session check
 * - Handle redirects properly with intent preservation
 * - Exclude public routes and API routes
 * - Don't perform RBAC here (do it at page level with database access)
 *
 * Note: This is an OPTIMISTIC check (cookie existence only)
 * Full session validation happens at the page level using auth.api.getSession()
 *
 * Protected routes:
 * - /dashboard/admin/* - Admin panel (role check in page)
 * - /dashboard/dentist/* - Dentist portal (role check in page)
 * - /dashboard/patient/* - Patient portal (role check in page)
 * - /profile/* - User profile (any authenticated user)
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Optimistic cookie-based session check
  // This only checks for cookie existence, not validity
  // Full validation happens at the page level
  // CRITICAL: Must pass cookiePrefix to match auth.ts configuration
  const sessionCookie = getSessionCookie(request, {
    cookiePrefix: "better-auth", // Must match advanced.cookiePrefix in auth.ts
  });

  // No session cookie - redirect to sign-in
  if (!sessionCookie) {
    if (process.env.NODE_ENV === "development") {
      console.log("[Middleware] No session cookie found for:", pathname);
    }

    // Recommended pattern: preserve original path in query parameter
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Session cookie exists - allow access
  // Note: RBAC is handled at the page level where we have database access
  const response = NextResponse.next();

  // Prevent caching of authenticated pages
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  return response;
}

export const config = {
  matcher: [
    // Match all dashboard routes (admin, dentist, patient)
    // The :path* pattern matches all sub-routes
    "/dashboard/:path*",
    // Match profile routes
    "/profile/:path*",
  ],
};
