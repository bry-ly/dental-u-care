import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Get the current session in a Server Component or Server Action
 * @returns The session object or null if not authenticated
 */
export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

/**
 * Require authentication in a Server Component or Server Action
 * Redirects to /login if not authenticated
 * @returns The session object
 */
export async function requireAuth() {
  const session = await getSession();
  
  if (!session) {
    redirect("/login");
  }
  
  return session;
}

/**
 * Get the current user in a Server Component or Server Action
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
 * Check if the current user is an admin
 * @returns true if user is admin, false otherwise
 */
export async function isAdmin() {
  const session = await getSession();
  // @ts-expect-error - role field will be available after Prisma generation
  return session?.user?.role === "admin";
}

/**
 * Check if the current user is a dentist
 * @returns true if user is dentist, false otherwise
 */
export async function isDentist() {
  const session = await getSession();
  // @ts-expect-error - role field will be available after Prisma generation
  return session?.user?.role === "dentist";
}

/**
 * Check if the current user is a patient
 * @returns true if user is patient, false otherwise
 */
export async function isPatient() {
  const session = await getSession();
  // @ts-expect-error - role field will be available after Prisma generation
  return session?.user?.role === "patient";
}

/**
 * Get the current user's role
 * @returns "patient" | "dentist" | "admin" | null
 */
export async function getUserRole() {
  const session = await getSession();
  // @ts-expect-error - role field will be available after Prisma generation
  return session?.user?.role ?? null;
}

/**
 * Require admin role in a Server Component or Server Action
 * Redirects to home page (/) if not admin or not authenticated
 * @returns The session object
 */
export async function requireAdmin() {
  const session = await requireAuth();
  
  // @ts-expect-error - role field will be available after Prisma generation
  if (session.user?.role !== "admin") {
    redirect("/");
  }
  
  return session;
}

/**
 * Require dentist role in a Server Component or Server Action
 * Redirects to home page (/) if not dentist or not authenticated
 * @returns The session object
 */
export async function requireDentist() {
  const session = await requireAuth();
  
  // @ts-expect-error - role field will be available after Prisma generation
  if (session.user?.role !== "dentist") {
    redirect("/");
  }
  
  return session;
}

/**
 * Require admin or dentist role in a Server Component or Server Action
 * Redirects to home page (/) if neither admin nor dentist
 * @returns The session object
 */
export async function requireStaff() {
  const session = await requireAuth();
  
  // @ts-expect-error - role field will be available after Prisma generation
  const role = session.user?.role;
  if (role !== "admin" && role !== "dentist") {
    redirect("/");
  }
  
  return session;
}
