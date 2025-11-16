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

  const dentistsData = await prisma.user.findMany({
    take: 50, // Limit to 50 dentists to prevent excessive data loading
    where: {
      role: "dentist",
    },
    include: {
      appointmentsAsDentist: {
        take: 10, // Limit appointments per dentist to avoid N+1 issue
        include: {
          service: true,
          patient: true,
        },
        orderBy: {
          date: "desc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Transform the data to match the expected Dentist type
  const dentists = dentistsData.map((dentist) => ({
    ...dentist,
    experience: dentist.experience !== null ? String(dentist.experience) : null,
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
