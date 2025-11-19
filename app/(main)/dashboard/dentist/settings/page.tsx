import { requireAuth } from "@/lib/auth-session/auth-server";
import { redirect } from "next/navigation";
import { UserSettingsContent } from "@/components/user/settings-content";
import { prisma } from "@/lib/types/prisma";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

// Force dynamic rendering since this page uses authentication (headers)
export const dynamic = "force-dynamic";

export default async function DentistSettingsPage() {
  const session = await requireAuth();

  if (session.user.role !== "dentist") {
    redirect("/forbidden");
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
      user={{ ...user, role: user.role || "dentist" }}
      role="dentist"
    >
      <UserSettingsContent user={{ ...user, role: user.role || "dentist" }} />
    </DashboardLayout>
  );
}
