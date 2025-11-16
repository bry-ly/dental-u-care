import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AdminDentistsTable } from "@/components/admin/dentists-table";
import { requireAdmin } from "@/lib/auth-session/auth-server";
import { prisma } from "@/lib/types/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dentist Management",
};

// Force dynamic rendering since this page uses authentication (headers)
export const dynamic = "force-dynamic";

export default async function DentistManagementPage() {
  const { user } = await requireAdmin();

  // First, fetch dentists without appointments to avoid orphaned patient errors
  const dentistsData = await prisma.user.findMany({
    take: 50, // Limit to 50 dentists to prevent excessive data loading
    where: {
      role: "dentist",
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Get all dentist IDs
  const dentistIds = dentistsData.map((d) => d.id);

  // Fetch appointments separately, filtering for valid patients
  // First get all valid patient IDs
  const allPatientIds = await prisma.user.findMany({
    where: { role: "patient" },
    select: { id: true },
  });
  const validPatientIds = new Set(allPatientIds.map((p) => p.id));

  // Fetch appointments with relations, but filter for valid patients only
  const appointments = await prisma.appointment.findMany({
    where: {
      dentistId: { in: dentistIds },
      patientId: { in: Array.from(validPatientIds) }, // Only include appointments with valid patients
    },
    include: {
      service: true,
      patient: true,
    },
    orderBy: {
      date: "desc",
    },
  });

  // Group appointments by dentist ID
  const appointmentsByDentist = new Map<string, typeof appointments>();
  appointments.forEach((apt) => {
    if (!appointmentsByDentist.has(apt.dentistId)) {
      appointmentsByDentist.set(apt.dentistId, []);
    }
    appointmentsByDentist.get(apt.dentistId)!.push(apt);
  });

  // Combine dentists with their appointments (limit to 10 per dentist)
  const dentists = dentistsData.map((dentist) => ({
    ...dentist,
    experience: dentist.experience !== null ? String(dentist.experience) : null,
    appointmentsAsDentist: (appointmentsByDentist.get(dentist.id) || []).slice(0, 10),
  }));

  return (
    <DashboardLayout
      user={{ ...user, role: user.role || "admin" }}
      role="admin"
    >
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
        <div>
          <h1 className="text-3xl font-bold">Dentist Management</h1>
          <p className="text-muted-foreground">
            Manage all dentists in the system
          </p>
        </div>

        <AdminDentistsTable dentists={dentists} />
      </div>
    </DashboardLayout>
  );
}
