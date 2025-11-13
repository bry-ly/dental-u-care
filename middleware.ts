import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware for protecting authenticated routes
 *
 * This middleware runs on Edge Runtime and checks if users have a valid session token.
 * If not authenticated, it redirects them to the sign-in page.
 *
 * Role-based authorization is handled at the page level (not here) because:
 * 1. Edge Runtime can't access the database to check user roles
 * 2. Page-level checks provide more flexibility and better error handling
 *
 * Protected routes:
 * - /admin/* - Admin panel (role check in page)
 * - /dentist/* - Dentist portal (role check in page)
 * - /patient/* - Patient portal (role check in page)
 *
 * After successful login, users are redirected to their role-specific route:
 * - Admins → /admin
 * - Dentists → /dentist
 * - Patients → /patient
 */
export async function middleware(request: NextRequest) {
  // Try multiple cookie names to catch any variation
  // In production with HTTPS, cookies are prefixed with "_Secure-"
  const sessionToken =
    request.cookies.get("_Secure-better-auth.session_token")?.value ||
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("better-auth.session")?.value ||
    request.cookies.get("session_token")?.value; // Log for debugging
  console.log("[Middleware] Path:", request.nextUrl.pathname);
  console.log(
    "[Middleware] All cookies:",
    request.cookies.getAll().map((c) => c.name)
  );
  console.log(
    "[Middleware] Session token:",
    sessionToken ? "Found" : "Missing"
  );
  console.log("[Middleware] Host:", request.headers.get("host"));
  console.log("[Middleware] Origin:", request.headers.get("origin"));
  console.log("[Middleware] Referer:", request.headers.get("referer"));

  // Check if user is authenticated
  if (!sessionToken) {
    console.log("[Middleware] No session token - redirecting to sign-in");
    // Build redirect URL preserving the intended destination
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  // User is authenticated, allow access
  console.log("[Middleware] Session token found - allowing access");
  const response = NextResponse.next();

  // Add cache control headers for authenticated pages
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
