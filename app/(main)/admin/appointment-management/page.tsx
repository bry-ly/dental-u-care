import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AdminAppointmentsTable } from "@/components/admin/appointments-table";
import { requireAdmin } from "@/lib/auth-session/auth-server";
import { safeFindManyAppointments } from "@/lib/utils/appointment-helpers";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Appointment Management",
};

// Force dynamic rendering since this page uses authentication (headers)
export const dynamic = "force-dynamic";

export default async function AppointmentManagementPage() {
  const { user } = await requireAdmin();

  // Add pagination limit to prevent loading too much data at once
  // Use safe find to filter out orphaned appointments
  const appointments = await safeFindManyAppointments({
    take: 100, // Limit to 100 most recent appointments
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

  return (
    <DashboardLayout
      user={{ ...user, role: user.role || "admin" }}
      role="admin"
    >
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
        <div>
          <h1 className="text-3xl font-bold">Appointment Management</h1>
          <p className="text-muted-foreground">
            Manage all appointments in the system
          </p>
        </div>

        <AdminAppointmentsTable appointments={appointments} />
      </div>
    </DashboardLayout>
  );
}
