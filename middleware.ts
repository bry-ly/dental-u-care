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
  // Get the session token from cookies
  const sessionToken = request.cookies.get("better-auth.session_token")?.value;

  // Log for debugging (only in development)
  if (process.env.NODE_ENV === "development") {
    console.log("[Middleware] Path:", request.nextUrl.pathname);
    console.log("[Middleware] Session:", sessionToken ? "Present" : "Missing");
  }

  // Check if user is authenticated
  if (!sessionToken) {
    // Build redirect URL preserving the intended destination
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  // User is authenticated, allow access
  // Role-based authorization happens at the page level
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
    "/profile"
  ],
};
