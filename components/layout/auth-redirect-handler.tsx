"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-session/auth-client";
import type { User } from "@/lib/auth-session/auth";

export function AuthRedirectHandler() {
  const router = useRouter();

  useEffect(() => {
    const checkAndRedirect = async () => {
      // Check if we're expecting a redirect after OAuth
      const redirectPending = sessionStorage.getItem("auth-redirect-pending");

      if (!redirectPending) {
        return;
      }

      try {
        // Get the current session
        const session = await authClient.getSession();

        if (session?.data) {
          // Clear the flag
          sessionStorage.removeItem("auth-redirect-pending");

          const role = (session.data.user as User)?.role;

          // Redirect based on role
          if (role === "admin") {
            router.push("/admin");
          } else if (role === "dentist") {
            router.push("/dentist");
          } else if (role === "patient") {
            router.push("/patient");
          } else {
            // If no role is set, redirect to home page
            console.warn("User has no role assigned, redirecting to home");
            router.push("/");
          }
        } else {
          // No session found, clear the flag
          sessionStorage.removeItem("auth-redirect-pending");
        }
      } catch (error) {
        console.error("Failed to check session:", error);
        sessionStorage.removeItem("auth-redirect-pending");
      }
    };

    checkAndRedirect();
  }, [router]);

  return null;
}
