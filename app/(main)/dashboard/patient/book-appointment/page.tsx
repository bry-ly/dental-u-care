import type React from "react";
import BookingForm from "@/components/patient/booking-form";
import { requirePatient } from "@/lib/auth-session/auth-server";
import { prisma } from "@/lib/types/prisma";
import type { Metadata } from "next";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Book Appointment",
};

// Force dynamic rendering since this page uses authentication (headers)
export const dynamic = "force-dynamic";

interface BookAppointmentPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BookAppointmentPage({
  searchParams,
}: BookAppointmentPageProps) {
  const { user } = await requirePatient();

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
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-6 md:px-6 md:py-8">
        {/* Back Button */}
        <Link href="/dashboard/patient">
          <Button variant="ghost" className="mb-4" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Patient Dashboard
          </Button>
        </Link>

        {showCanceled && (
          <Alert className="mb-6 border-red-200 bg-red-50 dark:bg-red-950/30">
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
    </div>
  );
}
