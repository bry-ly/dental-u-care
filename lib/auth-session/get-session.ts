import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "./auth";
import { prisma } from "@/lib/types/prisma";

/**
 * Get the current session in a Server Component or Server Action
 *
 * Best practices:
 * - Cached to avoid multiple lookups in the same request
 * - Includes user role from database
 * - Returns null if not authenticated
 * - Use this in Server Components and Server Actions
 *
 * @returns The session object with user role or null if not authenticated
 */
export const getServerSession = cache(async () => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || !session.user) {
      return null;
    }

    // Fetch role from database if not in session
    // Better Auth's session cache may not include custom fields
    if (!session.user.role) {
      const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
      });

      if (dbUser) {
        session.user.role = dbUser.role || "patient";
      }
    }

    return session;
  } catch (error) {
    console.error("[getServerSession] Error:", error);
    return null;
  }
});
