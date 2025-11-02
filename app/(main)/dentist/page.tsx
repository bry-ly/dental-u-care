import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, CheckCircle } from "lucide-react";
import Link from "next/link";
import { requireAuth } from "@/lib/auth-session/auth-server";
import { prisma } from "@/lib/types/prisma";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dentist Dashboard",
};

export default async function DentistDashboard() {
  const session = await requireAuth();
  const user = session.user;

  if (user.role !== "dentist") {
    redirect("/");
  }

  // Fetch today's appointments
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayAppointments = await prisma.appointment.findMany({
    where: {
      dentistId: user.id,
      date: {
        gte: today,
        lt: tomorrow,
      },
      status: {
        in: ["pending", "confirmed"],
      },
    },
    include: {
      patient: true,
      service: true,
    },
    orderBy: {
      timeSlot: "asc",
    },
  });

  // Fetch pending appointments
  const pendingAppointments = await prisma.appointment.findMany({
    where: {
      dentistId: user.id,
      status: "pending",
      date: {
        gte: new Date(),
      },
    },
    include: {
      patient: true,
      service: true,
    },
    orderBy: {
      date: "asc",
    },
    take: 5,
  });

  // Get statistics
  const totalPatients = await prisma.appointment.groupBy({
    by: ["patientId"],
    where: {
      dentistId: user.id,
    },
  });

  const completedAppointments = await prisma.appointment.count({
    where: {
      dentistId: user.id,
      status: "completed",
    },
  });

  const upcomingAppointments = await prisma.appointment.count({
    where: {
      dentistId: user.id,
      status: {
        in: ["pending", "confirmed"],
      },
      date: {
        gte: new Date(),
      },
    },
  });

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
                <h1 className="text-3xl font-bold">
                  Welcome, Dr. {user.name}!
                </h1>
                <p className="text-muted-foreground">
                  Manage your schedule and patients
                </p>
              </div>

              {/* Statistics Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Today&apos;s Appointments
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {todayAppointments.length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Scheduled for today
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Upcoming
                    </CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {upcomingAppointments}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Future appointments
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Patients
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {totalPatients.length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Unique patients
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Completed
                    </CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {completedAppointments}
                    </div>
                    <p className="text-xs text-muted-foreground">All time</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid gap-4 md:grid-cols-3">
                <Link href="/dentist/appointments">
                  <Button className="w-full h-20" variant="outline">
                    <div className="flex flex-col items-center gap-2">
                      <Calendar className="h-6 w-6" />
                      <span>View All Appointments</span>
                    </div>
                  </Button>
                </Link>
                <Link href="/dentist/schedule">
                  <Button className="w-full h-20" variant="outline">
                    <div className="flex flex-col items-center gap-2">
                      <Clock className="h-6 w-6" />
                      <span>Manage Schedule</span>
                    </div>
                  </Button>
                </Link>
                <Link href="/dentist/patients">
                  <Button className="w-full h-20" variant="outline">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="h-6 w-6" />
                      <span>Patient Records</span>
                    </div>
                  </Button>
                </Link>
              </div>

              {/* Today's Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle>Today&apos;s Schedule</CardTitle>
                  <CardDescription>
                    {today.toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {todayAppointments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No appointments scheduled for today
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {todayAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex items-center justify-between border-b pb-4 last:border-0"
                        >
                          <div>
                            <p className="font-medium">
                              {appointment.patient.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {appointment.service.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {appointment.timeSlot}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                            {appointment.status === "pending" && (
                              <Button size="sm">Confirm</Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pending Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle>Pending Appointments</CardTitle>
                  <CardDescription>
                    Appointments awaiting confirmation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {pendingAppointments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No pending appointments
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {pendingAppointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex items-center justify-between border-b pb-4 last:border-0"
                        >
                          <div>
                            <p className="font-medium">
                              {appointment.patient.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {appointment.service.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(appointment.date).toLocaleDateString()}{" "}
                              at {appointment.timeSlot}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm">Accept</Button>
                            <Button size="sm" variant="destructive">
                              Decline
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
