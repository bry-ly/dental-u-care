import { requireAdmin } from "@/lib/auth-session/auth-server";
import { AdminSettingsContent } from "@/components/admin/settings-content";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

// Force dynamic rendering since this page uses authentication (headers)
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const { user } = await requireAdmin();

  return (
    <DashboardLayout
      user={{ ...user, role: user.role || "admin" }}
      role="admin"
    >
      <AdminSettingsContent user={{ ...user, role: user.role || "admin" }} />
    </DashboardLayout>
  );
}
