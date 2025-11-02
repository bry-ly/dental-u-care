import { auth } from "@/lib/auth-session/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { UserSettingsContent } from "@/components/user/settings-content";
import { prisma } from "@/lib/types/prisma";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function DentistSettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }

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
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar user={user} />
      <SidebarInset>
        <SiteHeader role="dentist" />
        <UserSettingsContent user={user} />
      </SidebarInset>
    </SidebarProvider>
  );
}
