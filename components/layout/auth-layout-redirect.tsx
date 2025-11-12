"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-session/auth-client";
import { useRouter } from "next/navigation";

/**
 * Client-side redirect for authenticated users visiting auth pages
 * This runs after page load to avoid SSR/client hydration conflicts
 */
export function AuthLayoutRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Check session on client side only
    const checkSession = async () => {
      const { data: session, error } = await authClient.getSession();
      
      if (!error && session?.user) {
        const user = session.user as { role?: string };
        const role = user.role;
        
        // Redirect based on role
        if (role === "admin") {
          router.replace("/admin");
        } else if (role === "dentist") {
          router.replace("/dentist");
        } else if (role === "patient") {
          router.replace("/patient");
        }
      }
    };

    checkSession();
  }, [router]);

  return null; // This component doesn't render anything
}
