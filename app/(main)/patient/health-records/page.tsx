import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requirePatient } from "@/lib/auth-session/auth-server";
import { prisma } from "@/lib/types/prisma";
import type { Metadata } from "next";
import { FileText, Calendar, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Health Records",
};

export default async function HealthRecordsPage() {
  const { user } = await requirePatient();

  const userDetails = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      appointmentsAsPatient: {
        where: {
          status: "completed",
        },
        include: {
          service: true,
          dentist: true,
        },
        orderBy: {
          date: "desc",
        },
      },
    },
  });

  return (
    <DashboardLayout
      user={{ ...user, role: user.role || "patient" }}
      role="patient"
    >
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
        <div>
          <h1 className="text-3xl font-bold">Health Records</h1>
          <p className="text-muted-foreground">
            Your medical history and treatment records
          </p>
        </div>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Full Name
              </p>
              <p className="text-base">{userDetails?.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-base">{userDetails?.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p className="text-base">
                {userDetails?.phone || "Not provided"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Date of Birth
              </p>
              <p className="text-base">
                {userDetails?.dateOfBirth
                  ? new Date(userDetails.dateOfBirth).toLocaleDateString()
                  : "Not provided"}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-muted-foreground">
                Address
              </p>
              <p className="text-base">
                {userDetails?.address || "Not provided"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Medical History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Medical History
            </CardTitle>
            <CardDescription>
              Important medical information for your dentist
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userDetails?.medicalHistory ? (
              <p className="text-base whitespace-pre-wrap">
                {userDetails.medicalHistory}
              </p>
            ) : (
              <p className="text-muted-foreground">
                No medical history recorded
              </p>
            )}
          </CardContent>
        </Card>

        {/* Treatment History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Treatment History
            </CardTitle>
            <CardDescription>Completed dental procedures</CardDescription>
          </CardHeader>
          <CardContent>
            {!userDetails?.appointmentsAsPatient ||
            userDetails.appointmentsAsPatient.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No treatment history
              </p>
            ) : (
              <div className="space-y-4">
                {userDetails.appointmentsAsPatient.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="border-b pb-4 last:border-0"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">
                          {appointment.service.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Dr. {appointment.dentist.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(appointment.date).toLocaleDateString()} at{" "}
                          {appointment.timeSlot}
                        </p>
                        {appointment.notes && (
                          <p className="text-sm mt-2">
                            <span className="font-medium">Notes:</span>{" "}
                            {appointment.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
