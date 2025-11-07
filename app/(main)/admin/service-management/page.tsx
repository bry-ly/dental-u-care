import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminServicesTable } from "@/components/admin/services-table";
import { requireAdmin } from "@/lib/auth-session/auth-server";
import { prisma } from "@/lib/types/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Service Management",
};

export default async function ServiceManagementPage() {
  const { user } = await requireAdmin();

  const servicesData = await prisma.service.findMany({
    take: 100, // Limit to 100 services
    include: {
      appointments: {
        take: 5, // Limit appointments per service to avoid N+1 issue
        orderBy: {
          date: "desc",
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  // Transform the data to match the expected Service type
  const services = servicesData.map((service) => ({
    ...service,
    description: service.description ?? "",
  }));

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" user={user} />
      <SidebarInset>
        <SiteHeader role="admin" />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              <div>
                <h1 className="text-3xl font-bold">Service Management</h1>
                <p className="text-muted-foreground">
                  Manage all dental services
                </p>
              </div>

              <AdminServicesTable services={services} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
