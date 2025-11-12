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
          // Determine target path from role
          const role = (session.data.user as User)?.role;
          const target =
            role === "admin"
              ? "/admin"
              : role === "dentist"
                ? "/dentist"
                : role === "patient"
                  ? "/patient"
                  : "/";

          // If we're already on the target path, just clear the flag and do nothing
          try {
            const currentPath = window.location.pathname;
            if (currentPath === target) {
              sessionStorage.removeItem("auth-redirect-pending");
              return;
            }
          } catch (e) {
            // Accessing window might fail in some environments; ignore and continue
            console.warn("Could not read window.location.pathname:", e);
          }

          // Clear the flag and navigate using replace to avoid polluting history
          sessionStorage.removeItem("auth-redirect-pending");
          try {
            router.replace(target);
          } catch (e) {
            // Fallback to push if replace fails
            router.push(target);
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
