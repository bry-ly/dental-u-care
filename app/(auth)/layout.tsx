import { ReactNode } from "react";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Removed session check - let client-side handle redirects after login
  // This prevents server-side redirect conflicts in production
  return children;
}
