import { ReactNode } from "react";
import { AuthLayoutRedirect } from "@/components/layout/auth-layout-redirect";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Client-side redirect for authenticated users
  // This prevents server-side redirect conflicts in production
  return (
    <>
      <AuthLayoutRedirect />
      {children}
    </>
  );
}
