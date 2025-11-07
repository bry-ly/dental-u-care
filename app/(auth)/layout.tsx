import { getServerSession } from "@/lib/auth-session/get-session";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession();
  const user = session?.user;

  // Redirect authenticated users to their role-specific dashboard
  if (user) {
    const role = user.role;
    if (role === "admin") {
      redirect("/admin");
    } else if (role === "dentist") {
      redirect("/dentist");
    } else if (role === "patient") {
      redirect("/patient");
    } else {
      // Fallback for users without a role
      redirect("/");
    }
  }

  return children;
}
