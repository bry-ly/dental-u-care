import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";

type UserRole = "admin" | "dentist" | "patient";

interface DashboardLayoutProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string | null | undefined;
    image?: string | null;
  };
  role: UserRole;
  children: ReactNode;
  variant?: "inset" | "sidebar";
}

/**
 * Shared dashboard layout component that wraps pages with SidebarProvider,
 * AppSidebar, and SiteHeader to reduce code duplication across pages.
 */
export function DashboardLayout({
  user,
  role,
  children,
  variant = "inset",
}: DashboardLayoutProps) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant={variant} user={user} />
      <SidebarInset>
        <SiteHeader role={role} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
