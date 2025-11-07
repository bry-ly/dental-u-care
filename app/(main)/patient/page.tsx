import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PatientSectionCards } from "@/components/patient/section-cards";
import { requirePatient } from "@/lib/auth-session/auth-server";
import { prisma } from "@/lib/types/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Patient Dashboard",
};

export default async function PatientDashboard() {
  // Require patient role - will redirect to appropriate page if not patient
  const { user } = await requirePatient();

  // Fetch statistics
  const upcomingAppointmentsCount = await prisma.appointment.count({
    where: {
      patientId: user.id,
      date: {
        gte: new Date(),
      },
      status: {
        in: ["pending", "confirmed"],
      },
    },
  });

  const completedAppointmentsCount = await prisma.appointment.count({
    where: {
      patientId: user.id,
      status: "completed",
    },
  });

  // Calculate total spent (paid payments)
  const totalSpentResult = await prisma.payment.aggregate({
    where: {
      userId: user.id,
      status: "paid",
    },
    _sum: {
      amount: true,
    },
  });

  // Calculate pending payments
  const pendingPaymentsResult = await prisma.payment.aggregate({
    where: {
      userId: user.id,
      status: "pending",
    },
    _sum: {
      amount: true,
    },
  });

  const patientStats = {
    upcomingAppointments: upcomingAppointmentsCount,
    completedAppointments: completedAppointmentsCount,
    totalSpent: totalSpentResult._sum.amount || 0,
    pendingPayments: pendingPaymentsResult._sum.amount || 0,
  };

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
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="text-3xl font-bold">
                  Welcome back, {user.name}!
                </h1>
                <p className="text-muted-foreground">
                  Manage your appointments and health records
                </p>
              </div>

              <PatientSectionCards stats={patientStats} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
