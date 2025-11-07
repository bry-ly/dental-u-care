import { requireAdmin } from "@/lib/auth-session/auth-server";
import { AdminSettingsContent } from "@/components/admin/settings-content";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function AdminSettingsPage() {
  const { user } = await requireAdmin();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar user={user} />
      <SidebarInset>
        <SiteHeader role="admin" />
        <AdminSettingsContent user={user} />
      </SidebarInset>
    </SidebarProvider>
  );
}
