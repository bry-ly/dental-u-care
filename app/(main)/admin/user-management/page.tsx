import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AdminUsersTable } from "@/components/admin/users-table";
import { requireAdmin } from "@/lib/auth-session/auth-server";
import { prisma } from "@/lib/types/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Management",
};

export default async function UserManagementPage() {
  const { user } = await requireAdmin();

  const usersRaw = await prisma.user.findMany({
    take: 100, // Limit to 100 most recent users
    orderBy: {
      createdAt: "desc",
    },
  });
  const users = usersRaw.map((u) => ({ ...u, role: u.role ?? undefined }));

  return (
    <DashboardLayout
      user={{ ...user, role: user.role || "admin" }}
      role="admin"
    >
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage all users in the system
          </p>
        </div>

        <AdminUsersTable users={users} />
      </div>
    </DashboardLayout>
  );
}
