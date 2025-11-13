"use server";

import { auth } from "@/lib/auth-session/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Server Actions for Authentication
 * 
 * Best practices:
 * - Use "use server" directive
 * - Return consistent response shapes
 * - Handle errors gracefully
 * - Use Better Auth's API methods
 * 
 * Note: Prefer using authClient on the client side when possible
 * These are mainly for server-side flows or progressive enhancement
 */

/**
 * Sign in with email and password
 * @param email - User's email
 * @param password - User's password
 */
export async function signInWithEmail(email: string, password: string) {
  try {
    await auth.api.signInEmail({
      body: { email, password },
    });

    return { success: true as const };
  } catch (error) {
    console.error("[signInWithEmail] Error:", error);
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Sign in failed",
    };
  }
}

/**
 * Sign up with email and password
 * @param email - User's email
 * @param password - User's password
 * @param name - User's name
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  name: string
) {
  try {
    await auth.api.signUpEmail({
      body: { email, password, name },
    });

    return { success: true as const };
  } catch (error) {
    console.error("[signUpWithEmail] Error:", error);
    return {
      success: false as const,
      error: error instanceof Error ? error.message : "Sign up failed",
    };
  }
}

/**
 * Sign out the current user
 */
export async function signOutAction() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });

    redirect("/sign-in");
  } catch (error) {
    console.error("[signOutAction] Error:", error);
    return {
      success: false as const,
      error: "Sign out failed",
    };
  }
}

/**
 * Get the current session
 * Prefer using getSession() from auth-server.ts in Server Components
 */
export async function getCurrentSessionAction() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    return {
      success: true as const,
      data: session,
    };
  } catch (error) {
    console.error("[getCurrentSessionAction] Error:", error);
    return {
      success: false as const,
      error: "Failed to get session",
      data: null,
    };
  }
}
