import { DashboardLayout } from "@/components/layout/dashboard-layout";
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

  const now = new Date();

  // Run all queries in parallel for better performance
  const [
    upcomingAppointmentsCount,
    completedAppointmentsCount,
    totalSpentResult,
    pendingPaymentsResult,
  ] = await Promise.all([
    // Fetch upcoming appointments count
    prisma.appointment.count({
      where: {
        patientId: user.id,
        date: {
          gte: now,
        },
        status: {
          in: ["pending", "confirmed"],
        },
      },
    }),
    // Fetch completed appointments count
    prisma.appointment.count({
      where: {
        patientId: user.id,
        status: "completed",
      },
    }),
    // Calculate total spent (paid payments)
    prisma.payment.aggregate({
      where: {
        userId: user.id,
        status: "paid",
      },
      _sum: {
        amount: true,
      },
    }),
    // Calculate pending payments
    prisma.payment.aggregate({
      where: {
        userId: user.id,
        status: "pending",
      },
      _sum: {
        amount: true,
      },
    }),
  ]);

  const patientStats = {
    upcomingAppointments: upcomingAppointmentsCount,
    completedAppointments: completedAppointmentsCount,
    totalSpent: totalSpentResult._sum.amount || 0,
    pendingPayments: pendingPaymentsResult._sum.amount || 0,
  };

  return (
    <DashboardLayout
      user={{ ...user, role: user.role || "patient" }}
      role="patient"
    >
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">
            Manage your appointments and health records
          </p>
        </div>

        <PatientSectionCards stats={patientStats} />
      </div>
    </DashboardLayout>
  );
}
