import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { DentistPatientsTable } from "@/components/dentist/patients-table";
import { requireDentist } from "@/lib/auth-session/auth-server";
import { prisma } from "@/lib/types/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Patient Records",
};

export default async function DentistPatientsPage() {
  const { user } = await requireDentist();

  // Get all unique patients who have appointments with this dentist
  const appointments = await prisma.appointment.findMany({
    take: 200, // Limit to prevent excessive data loading
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
    <DashboardLayout user={user} role="dentist">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
        <div>
          <h1 className="text-3xl font-bold">Patient Records</h1>
          <p className="text-muted-foreground">
            View your patients&apos; information and history
          </p>
        </div>

        <DentistPatientsTable patients={patients} />
      </div>
    </DashboardLayout>
  );
}
