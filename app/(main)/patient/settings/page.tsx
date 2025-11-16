import { requireAuth } from "@/lib/auth-session/auth-server";
import { redirect } from "next/navigation";
import { UserSettingsContent } from "@/components/user/settings-content";
import { prisma } from "@/lib/types/prisma";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default async function UserSettingsPage() {
  const session = await requireAuth();

  if (session.user.role !== "patient") {
    redirect("/");
  }

  // Fetch full user data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      dateOfBirth: true,
      address: true,
      role: true,
    },
  });

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <DashboardLayout
      user={{ ...user, role: user.role || "patient" }}
      role="patient"
    >
      <UserSettingsContent user={{ ...user, role: user.role || "patient" }} />
    </DashboardLayout>
  );
}
