import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  // Check if user is authenticated
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role-based routing:
  // - Admin routes: /dashboard (main admin dashboard)
  // - Dentist routes: /dashboard/dentist/*
  // - Patient routes: /dashboard/patient/*
  
  // The actual role check is done in each page using requireAuth/requireAdmin/requireDentist
  // This middleware only ensures the user is logged in

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"], // Protect all dashboard routes
};
