import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AdminPatientsTable } from "@/components/admin/patients-table";
import { requireAdmin } from "@/lib/auth-session/auth-server";
import { prisma } from "@/lib/types/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Patient Management",
};

// Force dynamic rendering since this page uses authentication (headers)
export const dynamic = "force-dynamic";

export default async function PatientManagementPage() {
  const { user } = await requireAdmin();

  const patients = await prisma.user.findMany({
    take: 50, // Limit to 50 patients to prevent excessive data loading
    where: {
      role: "patient",
    },
    include: {
      appointmentsAsPatient: {
        take: 10, // Limit appointments per patient to avoid N+1 issue
        include: {
          service: true,
          dentist: true,
        },
        orderBy: {
          date: "desc",
        },
      },
      payments: {
        take: 10, // Limit payments per patient
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <DashboardLayout
      user={{ ...user, role: user.role || "admin" }}
      role="admin"
    >
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
        <div>
          <h1 className="text-3xl font-bold">Patient Management</h1>
          <p className="text-muted-foreground">
            Manage all patients in the system
          </p>
        </div>

        <AdminPatientsTable patients={patients} />
      </div>
    </DashboardLayout>
  );
}
