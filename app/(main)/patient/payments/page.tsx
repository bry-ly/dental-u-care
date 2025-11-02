import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PaymentHistory } from "@/components/patient/payment-history";
import { requireAuth } from "@/lib/auth-session/auth-server";
import { prisma } from "@/lib/types/prisma";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment History",
};

export default async function PaymentsPage() {
  const session = await requireAuth();
  const user = session.user;

  if (user.role !== "patient") {
    redirect("/");
  }

  const payments = await prisma.payment.findMany({
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
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
              <div>
                <h1 className="text-3xl font-bold">Payment History</h1>
                <p className="text-muted-foreground">
                  View your payment transactions
                </p>
              </div>

              <PaymentHistory payments={payments} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
