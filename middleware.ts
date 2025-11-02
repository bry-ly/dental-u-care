import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // const pathname = request.nextUrl.pathname;

  // Get the session token from cookies
  const sessionToken = request.cookies.get("better-auth.session_token")?.value;

  // Check if user is authenticated
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // For role-based routing, we'll rely on server-side checks in the pages
  // since we can't access the database in Edge Runtime middleware
  // The middleware only ensures the user is authenticated

  // Role-based routing is enforced at the page level using:
  // - requireAuth() for authenticated routes
  // - requireAdmin() for admin-only routes
  // - requireDentist() for dentist-only routes
  // - requireStaff() for admin and dentist routes

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dentist/:path*",
    "/patient/:path*"
  ],
};
