import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppointmentsList } from "@/components/patient/appointments-list";
import { requireAuth } from "@/lib/auth-session/auth-server";
import { prisma } from "@/lib/types/prisma";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "My Appointments",
};

interface AppointmentsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AppointmentsPage({
  searchParams,
}: AppointmentsPageProps) {
  const session = await requireAuth();
  const user = session.user;

  if (user.role !== "patient") {
    redirect("/");
  }

  const appointmentsData = await prisma.appointment.findMany({
    take: 50, // Limit to 50 most recent appointments
    where: {
      patientId: user.id,
    },
    include: {
      dentist: true,
      service: true,
      payment: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  const appointments = appointmentsData.map((appointment) => ({
    ...appointment,
    service: {
      ...appointment.service,
      price: Number(appointment.service.price),
    },
  }));

  const params = await searchParams;
  const showSuccess = params.success === "true";

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
        <SiteHeader role={user.role} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              <div>
                <h1 className="text-3xl font-bold">My Appointments</h1>
                <p className="text-muted-foreground">
                  View and manage your dental appointments
                </p>
              </div>

              {showSuccess && (
                <Alert className="border-green-200 bg-green-50 dark:bg-green-950/30">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    Your appointment has been successfully booked! Check your
                    email for confirmation.
                  </AlertDescription>
                </Alert>
              )}

              <AppointmentsList appointments={appointments} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
