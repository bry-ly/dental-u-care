import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "./auth";

/**
 * Get the current session in a Server Component
 * Cached to avoid multiple lookups in the same request
 * @returns The session object or null if not authenticated
 */
export const getServerSession = cache(async () => {
  return await auth.api.getSession({ headers: await headers() });
});
