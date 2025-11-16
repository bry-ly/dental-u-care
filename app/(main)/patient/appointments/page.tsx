import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AppointmentsList } from "@/components/patient/appointments-list";
import { requirePatient } from "@/lib/auth-session/auth-server";
import { safeFindManyAppointments } from "@/lib/utils/appointment-helpers";
import type { Metadata } from "next";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "My Appointments",
};

// Force dynamic rendering since this page uses authentication (headers)
export const dynamic = "force-dynamic";

interface AppointmentsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AppointmentsPage({
  searchParams,
}: AppointmentsPageProps) {
  const { user } = await requirePatient();

  const appointmentsData = await safeFindManyAppointments({
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
      price: appointment.service.price, // Keep price as is (can be string or number)
    },
  }));

  const params = await searchParams;
  const showSuccess = params.success === "true";

  return (
    <DashboardLayout
      user={{ ...user, role: user.role || "patient" }}
      role="patient"
    >
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
              Your appointment has been successfully booked! Check your email
              for confirmation.
            </AlertDescription>
          </Alert>
        )}

        <AppointmentsList appointments={appointments} />
      </div>
    </DashboardLayout>
  );
}
