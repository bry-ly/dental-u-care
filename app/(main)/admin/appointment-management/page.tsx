import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminAppointmentsTable } from "@/components/admin/appointments-table";
import { requireAdmin } from "@/lib/auth-session/auth-server";
import { prisma } from "@/lib/types/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Appointment Management",
};

export default async function AppointmentManagementPage() {
  const { user } = await requireAdmin();

  const rawAppointments = await prisma.appointment.findMany({
    include: {
      patient: true,
      dentist: true,
      service: true,
      payment: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  const appointments = rawAppointments.map((appointment) => ({
    ...appointment,
    service: {
      ...appointment.service,
      price: Number(appointment.service.price),
    },
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
                <h1 className="text-3xl font-bold">Appointment Management</h1>
                <p className="text-muted-foreground">
                  Manage all appointments in the system
                </p>
              </div>

              <AdminAppointmentsTable appointments={appointments} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
