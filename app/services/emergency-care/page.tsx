import { EmergencyCare } from "@/components/services/EmergencyCare";
import { NavbarWrapper } from "@/components/landing/navbar-wrapper";

export default function EmergencyCarePage() {
  return (
    <main className="py-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <NavbarWrapper />
      <EmergencyCare />
    </main>
  );
}