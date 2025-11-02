import type React from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import BookingForm from "@/components/patient/booking-form";
import { requireAuth } from "@/lib/auth-session/auth-server";
import { prisma } from "@/lib/types/prisma";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Book Appointment",
};

interface BookAppointmentPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BookAppointmentPage({
  searchParams,
}: BookAppointmentPageProps) {
  const session = await requireAuth();
  const user = session.user;

  if (user.role !== "patient") {
    redirect("/");
  }

  // Fetch available services from database
  const servicesFromDb = await prisma.service.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  // Transform services to match component expectations
  const services = servicesFromDb.map((service) => ({
    id: service.id,
    name: service.name,
    price: service.price,
    duration: service.duration,
    category: service.category,
    description: service.description || undefined,
  }));

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

  // Transform dentists data to match component expectations
  const transformedDentists = dentists.map((dentist) => ({
    ...dentist,
    specialization: dentist.specialization || undefined,
    image: dentist.image || undefined,
  }));

  const params = await searchParams;
  const showCanceled = params.canceled === "true";

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
          {showCanceled && (
            <Alert className="m-4 md:m-8 border-red-200 bg-red-50 dark:bg-red-950/30">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                Payment was canceled. You can try booking again.
              </AlertDescription>
            </Alert>
          )}
          <BookingForm
            services={services}
            dentists={transformedDentists}
            patientId={user.id}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
