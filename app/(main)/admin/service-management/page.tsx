import { DashboardLayout } from "@/components/layout/dashboard-layout";
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
    <DashboardLayout user={user} role="admin">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
        <div>
          <h1 className="text-3xl font-bold">Service Management</h1>
          <p className="text-muted-foreground">
            Manage all dental services
          </p>
        </div>

        <AdminServicesTable services={services} />
      </div>
    </DashboardLayout>
  );
}
