import { requireAdmin } from "@/lib/auth-session/auth-server";
import { AdminSettingsContent } from "@/components/admin/settings-content";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default async function AdminSettingsPage() {
  const { user } = await requireAdmin();

  return (
    <DashboardLayout user={user} role="admin">
      <AdminSettingsContent user={user} />
    </DashboardLayout>
  );
}
