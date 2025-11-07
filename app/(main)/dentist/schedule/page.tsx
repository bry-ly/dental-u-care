import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireAuth } from "@/lib/auth-session/auth-server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Schedule",
};

export default async function DentistSchedulePage() {
  const session = await requireAuth();
  const user = session.user;

  if (user.role !== "dentist") {
    redirect("/");
  }

  return (
    <DashboardLayout user={user} role="dentist">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Schedule</h1>
          <p className="text-muted-foreground">
            Set your working hours and availability
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Working Hours</CardTitle>
            <CardDescription>
              Configure your weekly schedule
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              Schedule management feature coming soon
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
