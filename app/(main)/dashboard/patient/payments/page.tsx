import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PaymentHistory } from "@/components/patient/payment-history";
import { requirePatient } from "@/lib/auth-session/auth-server";
import { prisma } from "@/lib/types/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment History",
};

// Force dynamic rendering since this page uses authentication (headers)
export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  const { user } = await requirePatient();

  const payments = await prisma.payment.findMany({
    take: 50, // Limit to 50 most recent payments
    where: {
      userId: user.id,
    },
    include: {
      appointment: {
        include: {
          service: true,
          dentist: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <DashboardLayout
      user={{ ...user, role: user.role || "patient" }}
      role="patient"
    >
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
        <div>
          <h1 className="text-3xl font-bold">Payment History</h1>
          <p className="text-muted-foreground">
            View your payment transactions
          </p>
        </div>

        <PaymentHistory payments={payments} />
      </div>
    </DashboardLayout>
  );
}
