import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DentistPatientsTable } from "@/components/dentist/patients-table";
import { requireAuth } from "@/lib/auth-session/auth-server";
import { prisma } from "@/lib/types/prisma";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Patient Records",
};

export default async function DentistPatientsPage() {
  const session = await requireAuth();
  const user = session.user;

  if (user.role !== "dentist") {
    redirect("/");
  }

  // Get all unique patients who have appointments with this dentist
  const appointments = await prisma.appointment.findMany({
    where: {
      dentistId: user.id,
    },
    include: {
      patient: true,
      service: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  // Group by patient
  const patientsMap = new Map();
  appointments.forEach((apt) => {
    if (!patientsMap.has(apt.patient.id)) {
      patientsMap.set(apt.patient.id, {
        ...apt.patient,
        appointments: [],
      });
    }
    patientsMap.get(apt.patient.id).appointments.push(apt);
  });

  const patients = Array.from(patientsMap.values());

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
                <h1 className="text-3xl font-bold">Patient Records</h1>
                <p className="text-muted-foreground">
                  View your patients&apos; information and history
                </p>
              </div>

              <DentistPatientsTable patients={patients} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
