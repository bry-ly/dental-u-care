import { redirect } from "next/navigation";
import { getServerSession } from "./get-session";

/**
 * Server-side Authentication Helpers
 * 
 * Best practices:
 * - All functions use getServerSession (cached)
 * - Redirects are handled gracefully
 * - Role checks include proper fallbacks
 * - Type-safe role checking
 */

/**
 * Get the current session
 * Cached to avoid multiple lookups in the same request
 */
export const getSession = getServerSession;

/**
 * Require authentication in a Server Component or Server Action
 * Redirects to /sign-in if not authenticated
 * @returns The session object
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    redirect("/sign-in");
  }
  return session;
}

/**
 * Get the current user
 * @returns The user object or null if not authenticated
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

/**
 * Check if the user is authenticated
 * @returns true if authenticated, false otherwise
 */
export async function isAuthenticated() {
  const session = await getSession();
  return !!session;
}

/**
 * Get the current user's role
 * @returns The user's role or null
 */
export async function getUserRole() {
  const session = await getSession();
  return session?.user?.role ?? null;
}

/**
 * Check if the current user is an admin
 * @returns true if user is admin, false otherwise
 */
export async function isAdmin() {
  const session = await getSession();
  return session?.user?.role === "admin";
}

/**
 * Check if the current user is a dentist
 * @returns true if user is dentist, false otherwise
 */
export async function isDentist() {
  const session = await getSession();
  return session?.user?.role === "dentist";
}

/**
 * Check if the current user is a patient
 * @returns true if user is patient, false otherwise
 */
export async function isPatient() {
  const session = await getSession();
  return session?.user?.role === "patient";
}

/**
 * Require admin role
 * Redirects to appropriate page if not admin
 * @returns The session object
 */
export async function requireAdmin() {
  const session = await requireAuth();
  if (session.user?.role !== "admin") {
    const role = session.user?.role;
    redirect(role === "dentist" ? "/dentist" : role === "patient" ? "/patient" : "/");
  }
  return session;
}

/**
 * Require dentist role
 * Redirects to appropriate page if not dentist
 * @returns The session object
 */
export async function requireDentist() {
  const session = await requireAuth();
  if (session.user?.role !== "dentist") {
    const role = session.user?.role;
    redirect(role === "admin" ? "/admin" : role === "patient" ? "/patient" : "/");
  }
  return session;
}

/**
 * Require patient role
 * Redirects to appropriate page if not patient
 * @returns The session object
 */
export async function requirePatient() {
  const session = await requireAuth();
  if (session.user?.role !== "patient") {
    const role = session.user?.role;
    redirect(role === "admin" ? "/admin" : role === "dentist" ? "/dentist" : "/");
  }
  return session;
}

/**
 * Require staff role (admin or dentist)
 * Redirects to patient portal if neither
 * @returns The session object
 */
export async function requireStaff() {
  const session = await requireAuth();
  const role = session.user?.role;
  if (role !== "admin" && role !== "dentist") {
    redirect(role === "patient" ? "/patient" : "/");
  }
  return session;
}
