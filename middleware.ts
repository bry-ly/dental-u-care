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

  // Check if user is authenticated
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // User is authenticated, allow access
  // Role-based authorization happens at the page level
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dentist/:path*", "/patient/:path*"],
};
