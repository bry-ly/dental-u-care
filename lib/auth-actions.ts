"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Example server action for email/password sign in
 */
export async function signInWithEmail(email: string, password: string) {
  try {
    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Sign in error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Sign in failed",
    };
  }
}

/**
 * Example server action for email/password sign up
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  name: string
) {
  try {
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Sign up error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Sign up failed",
    };
  }
}

/**
 * Example server action for sign out
 */
export async function signOut() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });

    redirect("/login");
  } catch (error) {
    console.error("Sign out error:", error);
    return {
      success: false,
      error: "Sign out failed",
    };
  }
}

/**
 * Example server action to get current session
 */
export async function getCurrentSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    return {
      success: true,
      data: session,
    };
  } catch (error) {
    console.error("Get session error:", error);
    return {
      success: false,
      error: "Failed to get session",
      data: null,
    };
  }
}
