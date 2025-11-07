import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DentistAppointmentsList } from "@/components/dentist/appointments-list";
import { requireAuth } from "@/lib/auth-session/auth-server";
import { prisma } from "@/lib/types/prisma";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Appointments - Dentist",
};

export default async function DentistAppointmentsPage() {
  const session = await requireAuth();
  const user = session.user;

  if (user.role !== "dentist") {
    redirect("/");
  }

  const appointmentsData = await prisma.appointment.findMany({
    take: 100, // Limit to 100 most recent appointments
    where: {
      dentistId: user.id,
    },
    include: {
      patient: true,
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
      price: parseFloat(appointment.service.price),
    },
  }));

  return (
    <DashboardLayout user={user} role="dentist">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-muted-foreground">
            Manage your patient appointments
          </p>
        </div>

        <DentistAppointmentsList appointments={appointments} />
      </div>
    </DashboardLayout>
  );
}
