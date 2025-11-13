import { ReactNode } from "react";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Removed redundant client-side redirect here.
  // The sign-in form performs role-based redirects after login
  // and middleware protects authenticated routes. Keeping the
  // layout minimal avoids redirect race conditions.
  return <>{children}</>;
}
