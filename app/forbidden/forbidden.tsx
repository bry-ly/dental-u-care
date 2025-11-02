import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth-session/auth-server";
import { redirect } from "next/navigation";

export default async function ForbiddenPage() {
  const user = await getCurrentUser();

  // If not authenticated, redirect to sign-in
  if (!user) {
    redirect("/sign-in");
  }

  // Determine the appropriate dashboard based on role
  const getDashboardUrl = () => {
    switch (user.role) {
      case "admin":
        return "/admin";
      case "dentist":
        return "/dentist";
      case "patient":
        return "/patient";
      default:
        return "/profile";
    }
  };

  return (
    <main className="flex grow items-center justify-center px-4 text-center">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">403</h1>
          <h2 className="text-2xl font-semibold">Access Denied</h2>
          <p className="text-muted-foreground">
            You don&apos;t have permission to access this page.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Button asChild variant="default">
            <Link href={getDashboardUrl()}>Go to Dashboard</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
