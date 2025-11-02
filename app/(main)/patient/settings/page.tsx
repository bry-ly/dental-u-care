import { auth } from "@/lib/auth-session/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { UserSettingsContent } from "@/components/user/settings-content";
import { prisma } from "@/lib/types/prisma";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function UserSettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
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
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar user={user} />
      <SidebarInset>
        <SiteHeader role="patient" />
        <UserSettingsContent user={user} />
      </SidebarInset>
    </SidebarProvider>
  );
}
