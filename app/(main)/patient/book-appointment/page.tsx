import { AppSidebar } from "@/components/layout/app-sidebar"
import { SiteHeader } from "@/components/layout/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { BookingPageContent } from "@/components/patient/booking-page-content"
import { requireAuth } from "@/lib/auth-server"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Book Appointment",
};

export default async function BookAppointmentPage() {
  const session = await requireAuth();
  const user = session.user;

  if (user.role !== "patient") {
    redirect("/");
  }

  // Fetch available services
  const services = await prisma.service.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  // Fetch available dentists
  const dentists = await prisma.user.findMany({
    where: {
      role: "dentist",
      isAvailable: true,
    },
    select: {
      id: true,
      name: true,
      specialization: true,
      image: true,
    },
    orderBy: {
      name: "asc",
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
            <BookingPageContent 
              services={services}
              dentists={dentists}
              patientId={user.id}
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
