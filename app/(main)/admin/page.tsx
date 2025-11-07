import { ChartAreaInteractive } from "@/components/chart/chart-area-interactive";
import { AdminAppointmentsTable } from "@/components/admin/appointments-table";
import { SectionCards } from "@/components/layout/section-cards";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth-session/auth-server";
import { prisma } from "@/lib/types/prisma";

export const metadata: Metadata = {
  title: "Dashboard",
};
export default async function Page() {
  // Require admin role - will redirect to home page (/) if not admin
  const { user } = await requireAdmin();

  // Fetch dashboard statistics - optimize by running queries in parallel
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  // Run all count queries in parallel for better performance
  const [
    totalAppointments,
    previousAppointments,
    newPatients,
    previousPatients,
    payments,
    previousPayments,
    completedAppointments,
    previousCompleted,
  ] = await Promise.all([
    // Total appointments in last 30 days
    prisma.appointment.count({
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
    // Previous period appointments for comparison
    prisma.appointment.count({
      where: {
        createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
      },
    }),
    // New patients in last 30 days
    prisma.user.count({
      where: {
        role: "patient",
        createdAt: { gte: thirtyDaysAgo },
      },
    }),
    // Previous period patients
    prisma.user.count({
      where: {
        role: "patient",
        createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
      },
    }),
    // Revenue this month
    prisma.payment.aggregate({
      where: {
        status: "paid",
        paidAt: { gte: thirtyDaysAgo },
      },
      _sum: {
        amount: true,
      },
    }),
    // Previous period revenue
    prisma.payment.aggregate({
      where: {
        status: "paid",
        paidAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
      },
      _sum: {
        amount: true,
      },
    }),
    // Calculate completed appointments for satisfaction (mock calculation)
    prisma.appointment.count({
      where: {
        status: "completed",
        updatedAt: { gte: thirtyDaysAgo },
      },
    }),
    // Previous completed
    prisma.appointment.count({
      where: {
        status: "completed",
        updatedAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
      },
    }),
  ]);

  const revenue = payments._sum.amount || 0;
  const previousRevenue = previousPayments._sum.amount || 0;

  // Calculate percentage changes
  const appointmentChange =
    previousAppointments > 0
      ? ((totalAppointments - previousAppointments) / previousAppointments) *
        100
      : 0;
  const patientChange =
    previousPatients > 0
      ? ((newPatients - previousPatients) / previousPatients) * 100
      : 0;
  const revenueChange =
    previousRevenue > 0
      ? ((revenue - previousRevenue) / previousRevenue) * 100
      : 0;
  const satisfactionChange =
    previousCompleted > 0
      ? ((completedAppointments - previousCompleted) / previousCompleted) * 100
      : 0;

  // Mock satisfaction rate (in a real app, this would come from reviews/ratings)
  const satisfactionRate = 98.5;

  // Fetch appointments for chart (last 90 days)
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  const appointmentsForChart = await prisma.appointment.findMany({
    where: {
      createdAt: { gte: ninetyDaysAgo },
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Group appointments by date
  const chartData = appointmentsForChart.reduce(
    (acc: Record<string, number>, appointment) => {
      const date = appointment.createdAt.toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {}
  );

  // Convert to array format for chart
  const chartDataArray = Object.entries(chartData).map(([date, count]) => ({
    date,
    appointments: count,
  }));

  // Fetch recent appointments for table
  const appointments = await prisma.appointment.findMany({
    take: 20,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      patient: true,
      dentist: true,
      service: true,
      payment: true,
    },
  });

  const dashboardStats = {
    totalAppointments,
    appointmentChange,
    newPatients,
    patientChange,
    revenue,
    revenueChange,
    satisfactionRate,
    satisfactionChange,
  };

  return (
    <DashboardLayout user={user} role="admin">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards stats={dashboardStats} />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive data={chartDataArray} />
        </div>
        <div className="px-4 lg:px-6">
          <AdminAppointmentsTable appointments={appointments} />
        </div>
      </div>
    </DashboardLayout>
  );
}
